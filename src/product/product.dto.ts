import {IsNotEmpty, IsNumber, IsString, IsOptional} from "class-validator";

export class ProductAddDTO {
    pid:number;

    @IsNotEmpty({message: "Product name must be provided!"})
    productType:string;


    @IsOptional()
    @IsString()
    photoFileName?: string; // Optional for cases where no photo is uploaded

    
    AdminID:number;

}