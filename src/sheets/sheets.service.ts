import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { CreateGuestDto, UpdateGuestDto } from '../dto/guest.dto';

@Injectable()
export class SheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId = process.env.GOOGLE_SHEET_ID;

  constructor() {
    const privateKey = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      'base64',
    ).toString('utf-8');

    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async addRow(data: CreateGuestDto): Promise<void> {
    try {
      const values = [
        [
          `${data.firstName} ${data.lastName.toUpperCase()}`,
          data.willAttend ? data.meal : '',
          data.willAttend ? 'Oui' : 'Non',
          data.numberOfGuests ?? 1,
        ],
        ...data.guestList.map((guest) => [
          `${guest.firstName} ${guest.lastName.toUpperCase()}`,
          guest.meal,
          guest.willAttend ? 'Oui' : 'Non',
        ]),
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });
    } catch (error) {
      console.error('❌ Erreur Google Sheets:', error.message);
      throw error;
    }
  }

  async updateRow(rowIndex: number, data: UpdateGuestDto): Promise<void> {
    const values = [
      [
        `${data.firstName} ${data.lastName.toUpperCase()}`,
        data.meal,
        data.willAttend !== undefined ? (data.willAttend ? 'Oui' : 'Non') : '',
        data.numberOfGuests ?? 1,
      ],
    ];

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `Sheet1!B${rowIndex}:F${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log(`✅ Ligne ${rowIndex} mise à jour`);
  }

  async getAllRows(): Promise<any[]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Sheet1!A:F',
    });

    return response.data.values || [];
  }
}
