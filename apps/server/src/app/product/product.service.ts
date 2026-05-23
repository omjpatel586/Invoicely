import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '../database/models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>
  ) { }

  async create(companyId: string, dto: CreateProductDto) {
    const product = new this.productModel({
      ...dto,
      unitPrice: Types.Decimal128.fromString(dto.unitPrice),
      company: new Types.ObjectId(companyId),
    });

    return product.save();
  }

  async findAll(companyId: string) {
    return this.productModel
      .find({
        company: companyId,
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(companyId: string, productId: string) {
    const product = await this.productModel.findOne({
      _id: productId,
      company: companyId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(companyId: string, productId: string, dto: UpdateProductDto) {
    const updatePayload: Record<string, unknown> = { ...dto };

    if (dto.unitPrice) {
      updatePayload.unitPrice = Types.Decimal128.fromString(dto.unitPrice);
    }

    const product = await this.productModel.findOneAndUpdate(
      {
        _id: productId,
        company: companyId,
      },
      { $set: updatePayload },
      { new: true }
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(companyId: string, productId: string) {
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: productId,
        company: companyId,
      },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }
}