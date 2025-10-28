import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import express from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface IApiResponse<T = object> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IApiResponse> {
    const res: express.Response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => ({
        statusCode: res.statusCode ?? HttpStatus.OK,
        message: data?.message ?? 'Success',
        data: data?.data ?? data ?? {},
      }))
    );
  }
}
