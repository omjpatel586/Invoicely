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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('companies/:companyId/products')
@UseGuards(SecurityGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Param('companyId') companyId: string, @Body() dto: CreateProductDto) {
    return this.productService.create(companyId, dto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.productService.findAll(companyId);
  }

  @Get(':productId')
  findOne(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string
  ) {
    return this.productService.findOne(companyId, productId);
  }

  @Patch(':productId')
  update(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productService.update(companyId, productId, dto);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string
  ) {
    return this.productService.remove(companyId, productId);
  }
}