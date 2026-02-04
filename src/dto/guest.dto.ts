import {
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuestItemDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  meal: string; // Ex: "Végétarien", "Sans gluten", "Normal", etc.

  @IsBoolean()
  willAttend: boolean;
}

export class CreateGuestDto {
  @IsString()
  firstName: string;

  @IsString()
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
  firstName?: string;

  @IsOptional()
  @IsString()
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
