import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SecurityGuard } from '../guards/auth.guard';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorService } from './vendor.service';

@Controller('companies/:companyId/vendors')
@UseGuards(SecurityGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  createVendor(@Param('companyId') companyId: string, @Body() dto: CreateVendorDto) {
    return this.vendorService.create(companyId, dto);
  }

  @Get()
  getVendors(
    @Param('companyId') companyId: string,
    @Query('search') search?: string
  ) {
    return this.vendorService.findAll(companyId, search);
  }

  @Get(':vendorId')
  getVendorById(
    @Param('companyId') companyId: string,
    @Param('vendorId') vendorId: string
  ) {
    return this.vendorService.findOne(companyId, vendorId);
  }

  @Patch(':vendorId')
  updateVendor(
    @Param('companyId') companyId: string,
    @Param('vendorId') vendorId: string,
    @Body() dto: UpdateVendorDto
  ) {
    return this.vendorService.update(companyId, vendorId, dto);
  }

  @Delete(':vendorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteVendor(
    @Param('companyId') companyId: string,
    @Param('vendorId') vendorId: string
  ) {
    return this.vendorService.remove(companyId, vendorId);
  }
}
