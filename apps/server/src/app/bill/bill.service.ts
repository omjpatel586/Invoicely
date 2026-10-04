import {
  BillStatus,
  BillType,
  LEGACY_PRODUCT_UNITS,
} from '@invoicely/constants';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bill } from '../database/models/bill.model';
import { BillingDetailsDto, CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

const toDecimal = (value?: string) =>
  value ? Types.Decimal128.fromString(value) : null;

const toBillingDetails = (billingDetails: BillingDetailsDto) => ({
  amount: toDecimal(billingDetails.amount),
  cgstAmount: toDecimal(billingDetails.cgstAmount),
  sgstAmount: toDecimal(billingDetails.sgstAmount),
  igstAmount: toDecimal(billingDetails.igstAmount),
  gstAmount: toDecimal(billingDetails.gstAmount),
  totalAmount: toDecimal(billingDetails.totalAmount),
});

const LEGACY_DRAFT_STATUS = 'Draft';
const LEGACY_BILL_OF_SUPPLY_TYPE = 'Bill Of Supply';
const LEGACY_BILL_NUMBER_INDEX = 'billNumber_1_company_1';

@Injectable()
export class BillService implements OnModuleInit {
  private readonly logger = new Logger(BillService.name);

  constructor(
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>
  ) {}

  async onModuleInit() {
    await this.dropLegacyBillNumberIndex();

    const [statusResult, typeResult, ...unitResults] = await Promise.all([
      this.billModel.collection.updateMany(
        { status: LEGACY_DRAFT_STATUS },
        { $set: { status: BillStatus.ISSUED } }
      ),
      this.billModel.collection.updateMany(
        { type: LEGACY_BILL_OF_SUPPLY_TYPE },
        { $set: { type: BillType.TAX_INVOICE } }
      ),
      ...Object.entries(LEGACY_PRODUCT_UNITS).map(([legacyUnit, unit]) =>
        this.billModel.collection.updateMany(
          { 'products.unit': legacyUnit },
          { $set: { 'products.$[line].unit': unit } },
          { arrayFilters: [{ 'line.unit': legacyUnit }] }
        )
      ),
    ]);

    const unitCount = unitResults.reduce(
      (sum, result) => sum + result.modifiedCount,
      0
    );

    if (statusResult.modifiedCount || typeResult.modifiedCount || unitCount) {
      this.logger.log(
        `Migrated legacy bills: ${statusResult.modifiedCount} Draft -> Issued, ${typeResult.modifiedCount} Bill Of Supply -> Tax Invoice, ${unitCount} with legacy units`
      );
    }
  }

  private async dropLegacyBillNumberIndex() {
    const indexExists = await this.billModel.collection
      .indexExists(LEGACY_BILL_NUMBER_INDEX)
      .catch(() => false);

    if (indexExists) {
      await this.billModel.collection.dropIndex(LEGACY_BILL_NUMBER_INDEX);
      this.logger.log(`Dropped legacy index ${LEGACY_BILL_NUMBER_INDEX}`);
    }
  }

  async create(companyId: string, dto: CreateBillDto) {
    const lastBill = await this.billModel
      .findOne({ company: companyId }, { billNumber: 1 })
      .sort({ billNumber: -1 })
      .lean();

    let billNumber = 1;

    if (lastBill) {
      billNumber = lastBill.billNumber + 1;
    }

    const bill = new this.billModel({
      ...dto,
      billNumber,
      billDate: dto.billDate ? new Date(dto.billDate) : new Date(),
      status: BillStatus.ISSUED,
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
        ? toBillingDetails(dto.billingDetails)
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
      updatePayload.billingDetails = toBillingDetails(dto.billingDetails);
    }

    const bill = await this.billModel.findOneAndUpdate(
      {
        _id: billId,
        company: companyId,
      },
      { $set: updatePayload },
      { returnDocument: 'after' }
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
      { returnDocument: 'after' }
    );

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
  }
}
