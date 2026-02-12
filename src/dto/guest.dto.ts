import {
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuestItemDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  meal: string; // Ex: "Végétarien", "Sans gluten", "Normal", etc.

  @IsBoolean()
  willAttend: boolean;
}

export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  meal: string;

  @IsBoolean()
  willAttend: boolean; // Je suppose que vous vouliez dire "willAttend" pas "willAttempt"

  @IsNumber()
  numberOfGuests: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestItemDto)
  guestList: GuestItemDto[];
}

export class UpdateGuestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsString()
  meal?: string;

  @IsOptional()
  @IsBoolean()
  willAttend?: boolean;

  @IsOptional()
  @IsNumber()
  numberOfGuests?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestItemDto)
  guestList?: GuestItemDto[];
}
