import { ConflictException, Inject, Injectable, NotFoundException, Session } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { AdminLoginDTO, AdminRegDTO, AdminUpdateDTO} from "./admin.dto";
import { ProductAddDTO } from "src/product/product.dto";
import { ProductEntity } from "src/product/product.entity";
import { AdminMessageDTO } from "./admin.dto";
import { AdminEntity } from "./admin.entity";
import * as bcrypt from 'bcrypt';

import { MailerService } from "@nestjs-modules/mailer/dist";
import { EmailEntity } from "./email-logEntity";





@Injectable()
export class AdminService {
    products: ProductEntity[] | PromiseLike<ProductEntity[]>;
    productRepository: any;
    getAllUsers(username: any) {
        throw new Error("Method not implemented.");
    }
    constructor (
        @InjectRepository(AdminEntity)
            private AdminRepo:Repository<AdminEntity>,

        @InjectRepository(ProductEntity)
            private ProductRepo:Repository<ProductEntity>,

        private readonly mailerService: MailerService,
        @InjectRepository(EmailEntity)
        private readonly EmailRepo: Repository<EmailEntity>,
   
        
    ) {}

    async regAdmin (AdminRegInfo:AdminRegDTO) : Promise<AdminEntity> {
        const salt = await bcrypt.genSalt();
        AdminRegInfo.password = await bcrypt.hash(AdminRegInfo.password, salt);

        return this.AdminRepo.save(AdminRegInfo);
        
    }

    

    async loginAdmin (AdminLoginInfo:AdminLoginDTO) {
        const Admin = await this.AdminRepo.findOneBy({username:AdminLoginInfo.username});
        
        if (Admin != null) {
        const isMatch:boolean = await bcrypt.compare(AdminLoginInfo.password, Admin.password);
        console.log(isMatch);
        return isMatch;
        }else{
            return false;
        }

        
    }

    async uploadAdmin(fileName: string, username: string) {
        const Admin = await this.AdminRepo.findOneBy({ username: username });
        console.log(username);
        if (Admin) {
            Admin.photoFileName = fileName;
            await this.AdminRepo.save(Admin);
            return "Admin Photo Uploaded!";
        }
        return "Admin Photo Couldn't be Uploaded!";
    }


    async viewAdminProfile (AdminUsername:string) {
        console.log(AdminUsername);
        const Admin = await this.AdminRepo.findOneBy({username:AdminUsername});
        

        if (Admin) {
            const { id, name, email, } = Admin;
            return { id, name, email,  };
        }
    
        return "Admin not found!";
    }


    async updateAdminInfo (AdminUpdateInfo:AdminUpdateDTO, AdminUsername:string) : Promise<AdminEntity> {
        const Admin = await this.AdminRepo.findOneBy({username:AdminUsername});
        AdminUpdateInfo.id = Admin.id;

        const salt = await bcrypt.genSalt();
        AdminUpdateInfo.password = await bcrypt.hash(AdminUpdateInfo.password, salt);

        await this.AdminRepo.update({id:Admin.id}, AdminUpdateInfo);
        console.log("update!");
        return this.AdminRepo.findOneBy({id:Admin.id});
    }
//  ///////////////////////////////
   async viewProducts(AdminUsername: string): Promise<ProductEntity[]> {
            // Find the admin based on the session username
        const Admin = await this.AdminRepo.findOneBy({ username: AdminUsername });
        if (!Admin) {
        throw new Error('Admin not found');
    }

  // Find all products associated with the admin using adminId
        const products = await this.ProductRepo.find({ where: { Admin: Admin } });
        return products;
}
    async viewProduct(pid: number, AdminUsername: string): Promise<ProductEntity> {
        // Find the admin based on the session username
        const Admin = await this.AdminRepo.findOneBy({ username: AdminUsername });
        if (!Admin) {
          throw new Error('Admin not found');
        }

        // Find the product based on the productId and adminId
        const product = await this.ProductRepo.findOneBy({ pid: pid, Admin: Admin });
        if (!product) {
          throw new NotFoundException('Product not found');
        }

        return product;
      }
      async updateProduct(pid: number, ProductAddInfo: ProductAddDTO, AdminUsername: string): Promise<ProductEntity> {
        // Find the admin based on the session username
        const Admin = await this.AdminRepo.findOneBy({ username: AdminUsername });
        if (!Admin) {
          throw new Error('Admin not found');
        }

        // Find the product based on the productId and adminId
        const product = await this.ProductRepo.findOneBy({ pid: pid, Admin: Admin });
        if (!product) {
          throw new NotFoundException('Product not found');
        }

        // Update the product with the new info
        await this.ProductRepo.update({ pid: pid }, ProductAddInfo);
        return this.ProductRepo.findOneBy({ pid: pid });
      }
    async deleteProduct(pid: number, AdminUsername: string): Promise<ProductEntity> {
  // Find the admin based on the session username
         const Admin = await this.AdminRepo.findOneBy({ username: AdminUsername });
          if (!Admin) {
          throw new Error('Admin not found');
     }

  // Find the product based on the productId and adminId
    const product = await this.ProductRepo.findOneBy({ pid: pid, Admin: Admin });
     if (!product) {
          throw new NotFoundException('Product not found');
     }

  // Delete the product
  await this.ProductRepo.delete(product.pid);
  return product;
}

///

    async addProducts(ProductAddInfo: ProductAddDTO, AdminUsername: string): Promise<ProductEntity> {
        // Find the admin based on the session username
        const Admin = await this.AdminRepo.findOneBy({ username: AdminUsername });
        if (!Admin) {
          throw new Error('Admin not found');
        }
      
        // Attach the Admin entity and save the product
        const product = this.ProductRepo.create({
          ...ProductAddInfo,
          Admin: Admin, // Associate product with admin
        });
      
        return await this.ProductRepo.save(product);
      }
      


      async sendMail(messageInfo: AdminMessageDTO, adminUsername: string) {
        const admin = await this.AdminRepo.findOneBy({ username: adminUsername });

       
        await this.mailerService.sendMail({
          to: messageInfo.receiver,
          subject: admin.name + ' : ' + messageInfo.subject,
          text: messageInfo.message,
        });
    
        // Save the email log to the database
        const emailLog = this.EmailRepo.create({
          senderUsername: adminUsername,
          receiver: messageInfo.receiver,
          subject: messageInfo.subject,
          message: messageInfo.message,
        });
        await this.EmailRepo.save(emailLog);

        
      }
      



}


