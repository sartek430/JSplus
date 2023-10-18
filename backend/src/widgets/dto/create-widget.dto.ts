import { IsIn, IsLatitude, IsLongitude, IsNotEmpty, IsString } from "class-validator";
import { EWidgetSize } from "../models";

export class CreateWidgetDto {
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
