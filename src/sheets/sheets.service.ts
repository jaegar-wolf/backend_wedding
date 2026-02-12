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
      // Vérifier que firstName et lastName ne sont pas vides
      if (!data.firstName || data.firstName.trim() === '') {
        throw new Error('Le prénom (firstName) ne peut pas être vide');
      }
      if (!data.lastName || data.lastName.trim() === '') {
        throw new Error('Le nom (lastName) ne peut pas être vide');
      }

      // Vérifier que les invités dans la liste ont aussi des noms valides
      for (const guest of data.guestList) {
        if (!guest.firstName || guest.firstName.trim() === '') {
          throw new Error('Le prénom des invités ne peut pas être vide');
        }
        if (!guest.lastName || guest.lastName.trim() === '') {
          throw new Error('Le nom des invités ne peut pas être vide');
        }
      }

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
    // Lire la ligne existante pour faire une mise à jour partielle
    const existingRow = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `Sheet1!B${rowIndex}:F${rowIndex}`,
    });

    const currentValues = existingRow.data.values?.[0] || [];

    // Extraire les valeurs actuelles
    const currentName = currentValues[0] || '';
    const currentMeal = currentValues[1] || '';
    const currentWillAttend = currentValues[2] || '';
    const currentNumberOfGuests = currentValues[3] || 1;

    // Mettre à jour uniquement les champs fournis
    let updatedName = currentName;
    if (data.firstName !== undefined || data.lastName !== undefined) {
      // Extraire firstName et lastName actuels si nécessaire
      const nameParts = currentName.split(' ');
      const existingFirstName = nameParts[0] || '';
      const existingLastName = nameParts.slice(1).join(' ') || '';

      const firstName = data.firstName ?? existingFirstName;
      const lastName = data.lastName ?? existingLastName;
      updatedName = `${firstName} ${lastName.toUpperCase()}`;
    }

    const values = [
      [
        updatedName,
        data.meal ?? currentMeal,
        data.willAttend !== undefined
          ? data.willAttend
            ? 'Oui'
            : 'Non'
          : currentWillAttend,
        data.numberOfGuests ?? currentNumberOfGuests,
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
