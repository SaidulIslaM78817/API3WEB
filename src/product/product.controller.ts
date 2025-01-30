import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Session,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { SessionGuard } from '../auth/session.guard'; // Adjust import based on your actual file structure
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError } from 'multer';
import { diskStorage } from 'multer';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { ProductAddDTO } from '../product/product.dto'; // Adjust import based on your actual DTO file
import { pid } from 'process';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //   @Post('addProducts')
  //   @UsePipes(new ValidationPipe())
  //   @UseGuards(SessionGuard)
  //   @UseInterceptors(FileInterceptor('image', {
  //     fileFilter: (req, file, cb) => {
  //       if (file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
  //         cb(null, true);
  //       } else {
  //         cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  //       }
  //     },
  //     limits: { fileSize: 150000000 }, // Adjusted file size limit to 150MB
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix = Date.now() + '-' + file.originalname;
  //         cb(null, uniqueSuffix);
  //       },
  //     }),
  //   }))
  //   async addProducts(
  //     @UploadedFile() image: Express.Multer.File,
  //     @Body() ProductAddInfo: ProductAddDTO,
  //     @Session() session,
  //   ): Promise<string> {
  //     if (image) {
  //       ProductAddInfo.photoFileName = image.filename;
  //     }
  //     await this.productService.create(ProductAddInfo);
  //     return "Product Added Successfully";
  //   }
  //
  @Get('product/all')
  async getAllProducts(@Session() session): Promise<ProductEntity[]> {
    const adminUsername = session.username;
    return this.productService.getAllProducts(pid, adminUsername);
  }
  @Get(':pid')
  async getProduct(
    @Param('pid') pid: number,
    @Session() session,
  ): Promise<ProductEntity> {
    const adminUsername = session.username;
    return this.productService.getProduct(pid, adminUsername);
  }

  @Delete(':pid')
  async deleteProduct(
    @Param('pid') pid: number,
    @Session() session,
  ): Promise<void> {
    const adminUsername = session.username;
    return this.productService.deleteProduct(pid, adminUsername);
  }

  @Put(':pid')
  @UsePipes(new ValidationPipe())
  async updateProduct(
    @Param('pid') pid: number,
    @Body() productUpdateInfo: ProductAddDTO,
    @Session() session,
  ): Promise<ProductEntity> {
    const adminUsername = session.username;
    return this.productService.updateProduct(
      pid,
      productUpdateInfo,
      adminUsername,
    );
  }
}
