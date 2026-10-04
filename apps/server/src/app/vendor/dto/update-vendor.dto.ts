import {
  COUNTRY_CODE_PATTERN,
  GSTIN_PATTERN,
  MOBILE_NUMBER_PATTERN,
} from '@invoicely/constants';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VendorAddressDto } from './create-vendor.dto';

const hasPhone = (vendor: { countryCode?: unknown; mobileNumber?: unknown }) =>
  vendor.countryCode != null || vendor.mobileNumber != null;

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @Matches(GSTIN_PATTERN, { message: 'gstIn must be a valid GSTIN' })
  gstIn?: string;

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

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VendorAddressDto)
  address?: VendorAddressDto;
}
