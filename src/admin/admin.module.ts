import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { AdminEntity } from "./admin.entity";
import { AdminService } from "./admin.service";

import { EmailEntity } from "./email-logEntity";
import { MailerModule } from "@nestjs-modules/mailer";
import { ProductEntity } from "src/product/product.entity";
import { AuthModule } from "src/auth/auth.module";



@Module({
  imports: [AuthModule,TypeOrmModule.forFeature([AdminEntity, ProductEntity, EmailEntity]),MailerModule.forRoot(
    {
        transport: {
            host: 'smtp.gmail.com',
            port: 465,
            ignoreTLS: true,
            secure: true,
            auth: {
                user: 'daruchinicheradip@gmail.com',
                pass: 'pzve vjtc rill geda'
            }
        }
    }
)],


        providers: [AdminService],
        controllers: [AdminController],
        exports: [AdminService],
      
        })

export class AdminModule {}