import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage, MulterError } from 'multer';
import { AdminLoginDTO, AdminRegDTO, AdminUpdateDTO } from './admin.dto';
import { ProductAddDTO } from 'src/product/product.dto';
import { AdminMessageDTO } from './admin.dto';
import { AdminService } from './admin.service';
import { SessionGuard } from '../auth/session.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailEntity } from './email-log.entity';
import { Repository } from 'typeorm';

import { AuthGuard } from 'src/auth/auth.guard';

interface LoginResponse {
  message: string;
  access_token: string; // Include access_token in the response type
}
@Controller('Admin')
export class AdminController {
  productService: any;
  constructor(
    private readonly AdminService: AdminService,
    @InjectRepository(EmailEntity)
    private readonly emailLogRepository: Repository<EmailEntity>,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async regAdmin(@Body() adminRegInfo: AdminRegDTO): Promise<string> {
    try {
      //  registration logic here
      await this.AdminService.regAdmin(adminRegInfo);
      return 'Admin Registration Successful!';
    } catch {
      throw new HttpException(
        'Already registered or Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginAdmin(
    @Body() AdminLoginInfo: AdminLoginDTO,
    @Session() session,
  ): Promise<LoginResponse | HttpException> {
    console.log(AdminLoginInfo);

    const result = await this.AdminService.loginAdmin(AdminLoginInfo);
    if (result) {
      session.username = AdminLoginInfo.username;
      console.log('login session username: ' + session.username);

      return {
        message: `Welcome ${session.username}!`,
        access_token: result.access_token,
      };
    } else {
      throw new NotFoundException({ message: 'Admin Not Found!' });
    }
  }

  @Post('logout')
  async logoutAdmin(@Session() session): Promise<{ access_token: string }> {
    if (session.username) {
      console.log('Logout session username: ' + session.username);

      // Destroy the session
      session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          throw new InternalServerErrorException({
            message: 'Failed to logout!',
          });
        }
      });

      return { message: 'Logged out successfully!' } as unknown as {
        access_token: string;
      };
    } else {
      throw new NotFoundException({ message: 'No active session found!' });
    }
  }

  @Put('upload')
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg|gif)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 300000 }, //bytes
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  uploadAdmin(
    @UploadedFile() photoObj: Express.Multer.File,
    @Session() session,
  ): Promise<'Admin Photo Uploaded!' | "Admin Photo Couldn't be Uploaded!"> {
    console.log(photoObj.filename);
    const fileName = photoObj.filename;
    return this.AdminService.uploadAdmin(fileName, session.username);
  }

  @Get('/profile')
  @UseGuards(SessionGuard, AuthGuard)
  viewAdminProfile(@Session() session) {
    return this.AdminService.viewAdminProfile(session.username);
  }

  @Put('updateinfo')
  @UsePipes(new ValidationPipe())
  @UseGuards(SessionGuard, AuthGuard)
  updateAdminInfo(
    @Body() AdminUpdateInfo: AdminUpdateDTO,
    @Session() session,
  ): any {
    console.log(AdminUpdateInfo);
    this.AdminService.updateAdminInfo(AdminUpdateInfo, session.username);
    return 'Admin info updated successfully!';
  }

  @Post('addProducts')
  @UsePipes(new ValidationPipe())
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 150000000000 }, // Set file size limit to
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + file.originalname;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async addProducts(
    @UploadedFile() image: Express.Multer.File,
    @Body() ProductAddInfo: ProductAddDTO,
    @Session() session,
  ): Promise<string> {
    // Attach the uploaded image filename to ProductAddInfo
    if (image) {
      ProductAddInfo.photoFileName = image.filename; // Save filename in DTO
    }
    await this.AdminService.addProducts(ProductAddInfo, session.username);
    return `Product added successfully! { ${ProductAddInfo.pid} } `;
  }

  @Get('/products')
  @UseGuards(SessionGuard)
  async viewProducts(@Session() session) {
    const products = await this.AdminService.viewProducts(session.username);
    return products;
  }

  @Get('/products/:pid')
  @UseGuards(SessionGuard)
  async viewProduct(
    @Param('pid', ParseIntPipe) pid: number,
    @Session() session,
  ) {
    const product = await this.AdminService.viewProduct(pid, session.username);
    if (product) {
      return product;
    } else {
      return new NotFoundException({
        message: `Product { ${pid} } not found!`,
      });
    }
  }

  @Put('/products/:pid')
  @UsePipes(new ValidationPipe())
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 150000000000 }, // Set file size limit to
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + file.originalname;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async updateProduct(
    @Param('pid', ParseIntPipe) pid: number,
    @Body() ProductAddInfo: ProductAddDTO,
    @UploadedFile() image: Express.Multer.File,
    @Session() session,
  ): Promise<string> {
    // Attach the uploaded image filename to ProductAddInfo
    if (image) {
      ProductAddInfo.photoFileName = image.filename; // Save filename in DTO
    }
    const product = await this.AdminService.updateProduct(
      pid,
      ProductAddInfo,
      session.username,
    );
    if (product) {
      return `Product { ${pid} } updated successfully!`;
    } else {
      throw new NotFoundException({ message: `Product { ${pid} } not found!` });
    }
  }

  @Delete('/products/:pid')
  @UseGuards(SessionGuard)
  async deleteProduct(
    @Param('pid', ParseIntPipe) pid: number,
    @Session() session,
  ) {
    const product = await this.AdminService.deleteProduct(
      pid,
      session.username,
    );
    if (product) {
      return `Product { ${pid} } deleted successfully!`;
    } else {
      return new NotFoundException({
        message: `Product { ${pid} } not found!`,
      });
    }
  }

  @Post('sendmail')
  @UseGuards(SessionGuard)
  sendMail(@Body() messageInfo: AdminMessageDTO, @Session() session) {
    console.log(messageInfo);
    this.AdminService.sendMail(messageInfo, session.username);

    return 'E-mail Send Successful!';
  }
}
