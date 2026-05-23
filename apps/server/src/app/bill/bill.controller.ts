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
  UseGuards,
} from '@nestjs/common';
import { SecurityGuard } from '../guards/auth.guard';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Controller('companies/:companyId/bills')
@UseGuards(SecurityGuard)
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  create(@Param('companyId') companyId: string, @Body() dto: CreateBillDto) {
    return this.billService.create(companyId, dto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.billService.findAll(companyId);
  }

  @Get(':billId')
  findOne(
    @Param('companyId') companyId: string,
    @Param('billId') billId: string
  ) {
    return this.billService.findOne(companyId, billId);
  }

  @Patch(':billId')
  update(
    @Param('companyId') companyId: string,
    @Param('billId') billId: string,
    @Body() dto: UpdateBillDto
  ) {
    return this.billService.update(companyId, billId, dto);
  }

  @Delete(':billId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('companyId') companyId: string, @Param('billId') billId: string) {
    return this.billService.remove(companyId, billId);
  }
}
