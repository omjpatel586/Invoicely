import { IGstVerifyResponse } from '@invoicely/api-interfaces';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RegisteredGSTVerificationService {
  private CLIENT_ID;
  private CLIENT_SECRET;
  private BASE_URL;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.CLIENT_ID = this.configService.get<string>('CASHFREE_CLIENT_ID');
    this.CLIENT_SECRET = this.configService.get<string>(
      'CASHFREE_CLIENT_SECRET'
    );
    this.BASE_URL = this.configService.get<string>('CASHFREE_API_URL');
  }

  async verify(
    gstNumber: string
  ): Promise<{ isVerified: boolean; data: IGstVerifyResponse }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.BASE_URL}/verification/gstin`,
          {
            gstin: gstNumber,
          },
          {
            headers: {
              'x-client-id': this.CLIENT_ID,
              'x-client-secret': this.CLIENT_SECRET,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      /**
       * Cashfree GSTIN response structure (simplified):
       * data = {
       *   status: 'SUCCESS',
       *   data: {
       *     legal_name,
       *     trade_name,
       *     registration_date,
       *     status,
       *     taxpayer_type,
       *     state_jurisdiction,
       *     nature_of_business,
       *     address
       *   }
       * }
       */

      if (!data.valid) {
        throw new HttpException(
          'Invalid GST number',
          HttpStatus.BAD_REQUEST
        );
      }

      // ✅ Normalize response for frontend
      return {
        isVerified: true, data };
    } catch (err: unknown) {
      // ✅ Axios error (Cashfree API failure)
      if (err instanceof AxiosError) {
        const status = err.response?.status ?? HttpStatus.BAD_GATEWAY;

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Cashfree API error';

        throw new HttpException(message, status);
      }

      // ✅ Already a NestJS HttpException → rethrow
      if (err instanceof HttpException) {
        throw err;
      }

      // ✅ Unknown / programming error
      throw new HttpException(
        'GST verification service failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
