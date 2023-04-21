/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Expose()
  password: string;
}
