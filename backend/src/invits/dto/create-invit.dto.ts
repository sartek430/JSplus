import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateInvitDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  @IsEmail()
  email: string;
}
