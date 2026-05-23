import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bill } from '../database/models/bill.model';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillService {
  constructor(@InjectModel(Bill.name) private readonly billModel: Model<Bill>) { }

  async create(companyId: string, dto: CreateBillDto) {
    const lastBill = await this.billModel.findOne({ company: companyId });

    let billNumber = 1;

    if (lastBill) {
      billNumber = lastBill.billNumber + 1;
    }

    const bill = new this.billModel({
      billNumber,
      ...dto,
      billDate: new Date(),
      products: (dto.products ?? []).map((product) => ({
        ...product,
        unitPrice: product.unitPrice
          ? Types.Decimal128.fromString(product.unitPrice)
          : null,
        totalPrice: product.totalPrice
          ? Types.Decimal128.fromString(product.totalPrice)
          : null,
      })),
      billingDetails: dto.billingDetails
        ? {
          amount: dto.billingDetails.amount
            ? Types.Decimal128.fromString(dto.billingDetails.amount)
            : null,
          gstAmount: dto.billingDetails.gstAmount
            ? Types.Decimal128.fromString(dto.billingDetails.gstAmount)
            : null,
          totalAmount: dto.billingDetails.totalAmount
            ? Types.Decimal128.fromString(dto.billingDetails.totalAmount)
            : null,
        }
        : {},
      company: new Types.ObjectId(companyId),
    });

    return bill.save();
  }

  async findAll(companyId: string) {
    return this.billModel
      .find({ company: companyId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(companyId: string, billId: string) {
    const bill = await this.billModel.findOne({
      _id: billId,
      company: companyId,
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    return bill;
  }

  async update(companyId: string, billId: string, dto: UpdateBillDto) {
    const updatePayload: Record<string, unknown> = { ...dto };

    if (dto.products) {
      updatePayload.products = dto.products.map((product) => ({
        ...product,
        unitPrice: product.unitPrice
          ? Types.Decimal128.fromString(product.unitPrice)
          : null,
        totalPrice: product.totalPrice
          ? Types.Decimal128.fromString(product.totalPrice)
          : null,
      }));
    }

    if (dto.billingDetails) {
      updatePayload.billingDetails = {
        amount: dto.billingDetails.amount
          ? Types.Decimal128.fromString(dto.billingDetails.amount)
          : null,
        gstAmount: dto.billingDetails.gstAmount
          ? Types.Decimal128.fromString(dto.billingDetails.gstAmount)
          : null,
        totalAmount: dto.billingDetails.totalAmount
          ? Types.Decimal128.fromString(dto.billingDetails.totalAmount)
          : null,
      };
    }

    const bill = await this.billModel.findOneAndUpdate(
      {
        _id: billId,
        company: companyId,
      },
      { $set: updatePayload },
      { new: true }
    );

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    return bill;
  }

  async remove(companyId: string, billId: string) {
    const bill = await this.billModel.findOneAndUpdate(
      {
        _id: billId,
        company: companyId,
      },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
  }
}
