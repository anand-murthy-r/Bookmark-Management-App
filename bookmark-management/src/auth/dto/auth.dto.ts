import { IsNotEmpty, IsEmail, IsString } from "class-validator"

export class AuthDtoSignUp {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}

export class AuthDtoSignIn {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;    
}