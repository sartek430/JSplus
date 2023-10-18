import { IsIn, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { EWidgetSize } from "../models";

export class CreateWidgetDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  displayName: string;

  @IsNotEmpty()
  @IsLatitude()
  latitude: number;
  
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;
  
  @IsNotEmpty()
  @IsString()
  @IsIn([EWidgetSize.SMALL, EWidgetSize.MEDIUM])
  size: EWidgetSize;
}
