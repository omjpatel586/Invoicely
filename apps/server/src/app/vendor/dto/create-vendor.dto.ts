import {
  COUNTRY_CODE_PATTERN,
  GSTIN_PATTERN,
  IndianState,
  MOBILE_NUMBER_PATTERN,
  PIN_CODE_PATTERN,
} from '@invoicely/constants';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

const hasPhone = (vendor: { countryCode?: unknown; mobileNumber?: unknown }) =>
  vendor.countryCode != null || vendor.mobileNumber != null;

export class VendorAddressDto {
  @IsString()
  @IsNotEmpty()
  line1: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(IndianState)
  state: IndianState;

  @Matches(PIN_CODE_PATTERN, { message: 'pinCode must be a 6 digit PIN code' })
  pinCode: string;
}

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Matches(GSTIN_PATTERN, { message: 'gstIn must be a valid GSTIN' })
  gstIn: string;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ValidateIf(hasPhone)
  @Matches(COUNTRY_CODE_PATTERN, {
    message: 'countryCode must be like +91 and is required with mobileNumber',
  })
  countryCode?: string | null;

  @ValidateIf(hasPhone)
  @Matches(MOBILE_NUMBER_PATTERN, {
    message: 'mobileNumber must be 10 digits and is required with countryCode',
  })
  mobileNumber?: string | null;

  @IsDefined({ message: 'address is required' })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VendorAddressDto)
  address: VendorAddressDto;
}
