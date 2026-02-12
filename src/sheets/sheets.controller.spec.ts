import { Test, TestingModule } from '@nestjs/testing';
import { SheetsController } from './sheets.controller';
import { SheetsService } from './sheets.service';
import { CreateGuestDto, UpdateGuestDto } from '../dto/guest.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SheetsController', () => {
  let controller: SheetsController;
  let service: SheetsService;

  const mockSheetsService = {
    addRow: jest.fn(),
    updateRow: jest.fn(),
    getAllRows: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SheetsController],
      providers: [
        {
          provide: SheetsService,
          useValue: mockSheetsService,
        },
      ],
    }).compile();

    controller = module.get<SheetsController>(SheetsController);
    service = module.get<SheetsService>(SheetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addGuest', () => {
    it('should add a guest successfully with valid data', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: 'John',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      };

      mockSheetsService.addRow.mockResolvedValue(undefined);

      const result = await controller.addGuest(createGuestDto);

      expect(result).toEqual({
        success: true,
        message: 'Invité ajouté au sheet',
      });
      expect(service.addRow).toHaveBeenCalledWith(createGuestDto);
      expect(service.addRow).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when service fails', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: 'John',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      };

      mockSheetsService.addRow.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.addGuest(createGuestDto)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.addGuest(createGuestDto)).rejects.toThrow(
        new HttpException(
          { success: false, message: 'Service error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateGuest', () => {
    it('should update a guest successfully', async () => {
      const updateGuestDto: UpdateGuestDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        meal: 'Végétarien',
      };

      mockSheetsService.updateRow.mockResolvedValue(undefined);

      const result = await controller.updateGuest(2, updateGuestDto);

      expect(result).toEqual({
        success: true,
        message: 'Invité mis à jour',
      });
      expect(service.updateRow).toHaveBeenCalledWith(2, updateGuestDto);
      expect(service.updateRow).toHaveBeenCalledTimes(1);
    });

    it('should return error when service fails', async () => {
      const updateGuestDto: UpdateGuestDto = {
        meal: 'Normal',
      };

      mockSheetsService.updateRow.mockRejectedValue(
        new Error('Update failed'),
      );

      const result = await controller.updateGuest(2, updateGuestDto);

      expect(result).toEqual({
        success: false,
        error: 'Update failed',
      });
    });
  });

  describe('getAllGuests', () => {
    it('should return all guests successfully', async () => {
      const mockRows = [
        ['John DOE', 'Normal', 'Oui', 1],
        ['Jane SMITH', 'Végétarien', 'Oui', 2],
      ];

      mockSheetsService.getAllRows.mockResolvedValue(mockRows);

      const result = await controller.getAllGuests();

      expect(result).toEqual({
        success: true,
        data: mockRows,
      });
      expect(service.getAllRows).toHaveBeenCalledTimes(1);
    });

    it('should return error when service fails', async () => {
      mockSheetsService.getAllRows.mockRejectedValue(
        new Error('Fetch failed'),
      );

      const result = await controller.getAllGuests();

      expect(result).toEqual({
        success: false,
        error: 'Fetch failed',
      });
    });
  });
});
