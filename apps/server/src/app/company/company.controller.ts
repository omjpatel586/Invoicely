import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { SecurityGuard } from "../guards/auth.guard";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/company.dto";

@Controller()
@UseGuards(SecurityGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/company/gst/verify')
  async verifyGSTNumber(@Query('gstNumber') gstNumber: string) {
    if (!this.companyService.verifyGSTFormat(gstNumber)) {
      throw new BadRequestException('Invalid GST number format');
    }

    return await this.companyService.verifyGSTNumber(gstNumber);
  }

  @Post('/user/company')
  async createCompany(@Req() req: Request, @Body() companyData: CreateCompanyDto) {
    if (!this.companyService.verifyGSTFormat(companyData.gstIn)) {
      throw new BadRequestException('Invalid GST number format');
    }

    const company = await this.companyService.getCompanyByGSTNumber(companyData.gstIn);

    if (company) {
      throw new BadRequestException('Company already exists');
    }

    companyData.userId = req.headers.user._id.toString();
    const companyDetails = await this.companyService.createCompany(companyData);

    return { message: 'Company created successfully', data: companyDetails };
  }

  @Get('/user/company/:id')
  async getCompany(@Param('id') id: string) {
    return await this.companyService.getCompany(id);
  }

  @Get('/user/companies')
  async getCompaniesByUserId(@Req() req: Request) {
    const userId = req.headers.user._id.toString();
    return await this.companyService.getCompaniesByUserId(userId);
  }
}