import { ICompany } from '@invoicely/api-interfaces';
import { CompanyStatus, ConstitutionOfBusiness, TaxPayerType } from '@invoicely/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../database/models/company.model';
import { RegisteredGSTVerificationService } from './utils/cashfree.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>   
    , private readonly cashfreeService: RegisteredGSTVerificationService) { }
  
  verifyGSTFormat(gstNumber: string): boolean {
    // Basic GST number validation logic
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }

  async verifyGSTNumber(gstNumber: string): Promise<Partial<ICompany>> {
    const gstData = await this.cashfreeService.verify(gstNumber);
    return {
      legalName: gstData.data.legal_name_of_business,
      tradeName: gstData.data.trade_name_of_business,
      registrationDate: new Date(gstData.data.date_of_registration),
      status: gstData.data.gst_in_status === 'Active' ? CompanyStatus.ACTIVE : CompanyStatus.CANCELLED,
      taxPayerType: gstData.data.taxpayer_type as TaxPayerType,
      stateJurisdiction: gstData.data.state_jurisdiction,
      natureOfBusiness: gstData.data.nature_of_business_activities,
      centerJurisdiction: gstData.data.center_jurisdiction,
      constitutionOfBusiness: gstData.data.constitution_of_business as ConstitutionOfBusiness,
      headOfficeAddress: gstData.data.principal_place_address,
      gstIn: gstNumber,
      headOfficeSplitAddress: {
        buildingName: gstData.data.principal_place_split_address.building_name,
        buildingNumber: gstData.data.principal_place_split_address.building_number,
        location: gstData.data.principal_place_split_address.location,
        street: gstData.data.principal_place_split_address.street,
        district: gstData.data.principal_place_split_address.district,
        state: gstData.data.principal_place_split_address.state,
        city: gstData.data.principal_place_split_address.city,
        flatNumber: gstData.data.principal_place_split_address.flat_number,
        pincode: gstData.data.principal_place_split_address.pincode,
        latitude: Number(gstData.data.principal_place_split_address.latitude),
        longitude: Number(gstData.data.principal_place_split_address.longitude),
      },
      branches: gstData.data.additional_address_array.map((branch) => ({
        address: branch.address,
        splitAddress: {
          buildingName: branch.split_address.building_name,
          buildingNumber: branch.split_address.building_number,
          location: branch.split_address.location,
          street: branch.split_address.street,
          district: branch.split_address.district,
          state: branch.split_address.state,
          city: branch.split_address.city,
          flatNumber: branch.split_address.flat_number,
          pincode: branch.split_address.pincode,
          latitude: Number(branch.split_address.latitude),
          longitude: Number(branch.split_address.longitude),
        },
      })),
    };
  }

  async createCompany(companyData: Company) {
    const createdCompany = new this.companyModel(companyData);
    return await createdCompany.save();
  }

  async getCompany(companyId: string) {
    return await this.companyModel.findById(companyId).lean();
  }

  async getCompanyByGSTNumber(gstNumber: string) {
    return await this.companyModel.findOne({gstIn:gstNumber}).lean();
  }

  async getCompaniesByUserId(userId: string) {
    return await this.companyModel.find({userId}, "legalName gstIn registrationDate headOfficeAddress").sort({createdAt:-1}).lean();
  }
}
