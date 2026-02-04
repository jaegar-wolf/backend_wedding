import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { SheetsModule } from './sheets/sheets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Assurez-vous que le chemin est correct
    }),
    SheetsModule,
  ],
})
export class AppModule {}
