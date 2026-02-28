import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { EnvConfigModule } from "../config/config.module";
import { DatabaseModule } from "../database/database.module";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { RegisteredGSTVerificationService } from "./utils/cashfree.service";

@Module({
  imports: [EnvConfigModule, DatabaseModule, HttpModule],
  controllers: [CompanyController],
  providers:[CompanyService, RegisteredGSTVerificationService]
})
export class CompanyModule {}