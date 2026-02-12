import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { CreateGuestDto, UpdateGuestDto } from '../dto/guest.dto';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Post('add-guest')
  async addGuest(@Body() guestData: CreateGuestDto) {
    try {
      console.log(guestData);
      await this.sheetsService.addRow(guestData);
      return { success: true, message: 'Invité ajouté au sheet' };
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('update-guest/:rowIndex')
  async updateGuest(
    @Param('rowIndex') rowIndex: number,
    @Body() guestData: UpdateGuestDto,
  ) {
    try {
      await this.sheetsService.updateRow(rowIndex, guestData);
      return { success: true, message: 'Invité mis à jour' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('guests')
  async getAllGuests() {
    try {
      const rows = await this.sheetsService.getAllRows();
      return { success: true, data: rows };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
