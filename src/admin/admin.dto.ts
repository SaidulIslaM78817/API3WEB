import { IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class AdminRegDTO {
    @PrimaryGeneratedColumn()
    id:number;

    @IsString({message: "Invalid Name"})
    @Matches(/^[a-z A-Z]+$/, {message:"Use Valid Name Format"})
    @IsNotEmpty({message: "Name Must be Filled!"})
    @MaxLength(200)
    name:string;

    @IsString({message: "Invalid Name"})
    @Matches(/^[a-zA-Z0-9@._$]+$/, {message:"Use Valid Username Format"})
    @IsNotEmpty({message: "Username Must be Filled!"})
    username:string;

    @IsEmail({}, {message: "Invalid E-mail!"})
    @IsNotEmpty({message: "E-mail Must be Filled!"})
    email:string;

    @IsString({message: "Invalid Password!"})
    @IsNotEmpty({message: "Password Must be Filled!"})
    password:string;

    
    contact:number;

    
}

export class AdminLoginDTO {

    @IsString({message: "Invalid Name"})
    @Matches(/^[a-zA-Z0-9@._$]+$/, {message:"Use Valid Username Format"})
    @IsNotEmpty({message: "Username Must be Filled!"})
    username:string;
   

    @IsString({message: "Invalid Password!"})
    @IsNotEmpty({message: "Password Must be Filled!"})
    password:string;
}

export class AdminUpdateDTO {
    
    @PrimaryGeneratedColumn()
    id:number;

    @IsString({message: "Invalid Name"})
    @Matches(/^[a-z A-Z]+$/, {message:"Use Valid Name Format"})
    @MaxLength(200)
    name:string;

    @IsEmail({}, {message: "Invalid E-mail!"})
    email:string;



    @IsString({message: "Invalid Password!"})
    // @Matches( /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^*!()<>?]).*$/, {message:"Please enter a valid password"})
    password:string;
}

export class AdminMessageDTO {
    @IsString({message: "Invalid Receiver!"})
    @IsNotEmpty({message: "Receiver Must be Filled!"})
    receiver:string;

    @IsString({message: "Invalid Subject!"})
    @IsNotEmpty({message: "Subject Must be Filled!"})
    subject:string;

    @IsString({message: "Invalid Message!"})
    message:string;
}
