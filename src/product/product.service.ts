import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductAddDTO } from './product.dto';

@Injectable()
export class ProductService {
    productRepository: any;
    products: ProductEntity[] | PromiseLike<ProductEntity[]>;
  async getAllProducts(pid: number, adminUsername: string): Promise<ProductEntity[]> {
      console.log(`Admin ${adminUsername} requested all products.`);
      return this.products;
    }
  async getProduct(pid: number, adminUsername: string): Promise<ProductEntity> {
      console.log(`Admin ${adminUsername} requested product with ID ${pid}.`);
      const product = this.productRepository.findOneBy((p) => p.id === pid);
      if (!product) {
        throw new Error(`Product with ID ${pid} not found.`);
      }
      return product;
    }
  
    async deleteProduct(pid: number, adminUsername: string): Promise<void> {
      console.log(`Admin ${adminUsername} is deleting product with ID ${pid}.`);
      const index = this.productRepository.findIndex((p) => p.id === pid);
      if (index === -1) {
        throw new Error(`Product with ID ${pid} not found.`);
      }
      this.productRepository.splice(index, 1);
    }
  
    async updateProduct(
      pid: number,
      productUpdateInfo: ProductAddDTO,
      adminUsername: string,
    ): Promise<ProductEntity> {
      console.log(`Admin ${adminUsername} is updating product with ID ${pid}.`);
      const productIndex = this.productRepository.findIndex((p) => p.id === pid);
      if (productIndex === -1) {
        throw new Error(`Product with ID ${pid} not found.`);
      }
      const updatedProduct = { ...this.products[productIndex], ...productUpdateInfo };
      this.products[productIndex] = updatedProduct;
      return updatedProduct;
    }
  
}

