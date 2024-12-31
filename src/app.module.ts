import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
// import { typeOrmConfig } from './config/typeromConfig';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';




@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sami',
      database: 'ShopOnline',
      entities: [ __dirname + '/**/*.entity{.ts,.js}', ],
      synchronize: true,
    }),
    
    AdminModule, ProductModule,AuthModule  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
