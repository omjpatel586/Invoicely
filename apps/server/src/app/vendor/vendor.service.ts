import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vendor } from '../database/models/vendor.model';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>
  ) { }

  async create(companyId: string, dto: CreateVendorDto) {
    const vendor = new this.vendorModel({
      ...dto,
      address: dto.address ?? {},
      company: new Types.ObjectId(companyId),
    });

    return vendor.save();
  }

  async findAll(companyId: string) {
    return this.vendorModel
      .find({ company: new Types.ObjectId(companyId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(companyId: string, vendorId: string) {
    const vendor = await this.vendorModel.findOne({
      _id: new Types.ObjectId(vendorId),
      company: new Types.ObjectId(companyId),
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async update(companyId: string, vendorId: string, dto: UpdateVendorDto) {
    const updatePayload: Record<string, unknown> = { ...dto };

    if (dto.address) {
      updatePayload.address = dto.address;
    }

    const vendor = await this.vendorModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(vendorId),
        company: new Types.ObjectId(companyId),
      },
      { $set: updatePayload },
      { new: true }
    );

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async remove(companyId: string, vendorId: string) {
    const vendor = await this.vendorModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(vendorId),
        company: new Types.ObjectId(companyId),
      },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
  }
}
