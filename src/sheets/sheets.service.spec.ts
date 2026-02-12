import { Test, TestingModule } from '@nestjs/testing';
import { SheetsService } from './sheets.service';
import { CreateGuestDto, UpdateGuestDto } from '../dto/guest.dto';

// Mock Google API
jest.mock('googleapis', () => ({
  google: {
    sheets: jest.fn(() => ({
      spreadsheets: {
        values: {
          append: jest.fn(),
          update: jest.fn(),
          get: jest.fn(),
        },
      },
    })),
  },
}));

jest.mock('google-auth-library', () => ({
  GoogleAuth: jest.fn(() => ({})),
}));

describe('SheetsService', () => {
  let service: SheetsService;
  let mockAppend: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(async () => {
    // Set up required environment variables
    process.env.GOOGLE_SHEET_ID = 'test-sheet-id';
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@example.com';
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY =
      Buffer.from('{"test": "key"}').toString('base64');

    const module: TestingModule = await Test.createTestingModule({
      providers: [SheetsService],
    }).compile();

    service = module.get<SheetsService>(SheetsService);

    // Access the mocked methods
    mockAppend = (service as any).sheets.spreadsheets.values.append;
    mockUpdate = (service as any).sheets.spreadsheets.values.update;
    mockGet = (service as any).sheets.spreadsheets.values.get;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addRow', () => {
    it('should successfully add a row with valid data', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: 'John',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      };

      mockAppend.mockResolvedValue({});

      await expect(service.addRow(createGuestDto)).resolves.not.toThrow();
      expect(mockAppend).toHaveBeenCalledTimes(1);
    });

    it('should throw error when firstName is empty', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: '',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      };

      await expect(service.addRow(createGuestDto)).rejects.toThrow(
        'Le prénom (firstName) ne peut pas être vide',
      );
      expect(mockAppend).not.toHaveBeenCalled();
    });

    it('should throw error when firstName is only whitespace', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: '   ',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      };

      await expect(service.addRow(createGuestDto)).rejects.toThrow(
        'Le prénom (firstName) ne peut pas être vide',
      );
      expect(mockAppend).not.toHaveBeenCalled();
    });

    it('should throw error when lastName is empty', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: 'John',
        lastName: '',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      };

      await expect(service.addRow(createGuestDto)).rejects.toThrow(
        'Le nom (lastName) ne peut pas être vide',
      );
      expect(mockAppend).not.toHaveBeenCalled();
    });

    it('should throw error when lastName is only whitespace', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: 'John',
        lastName: '   ',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      };

      await expect(service.addRow(createGuestDto)).rejects.toThrow(
        'Le nom (lastName) ne peut pas être vide',
      );
      expect(mockAppend).not.toHaveBeenCalled();
    });

    it('should throw error when guest in guestList has empty firstName', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: 'John',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 2,
        guestList: [
          {
            firstName: '',
            lastName: 'Smith',
            meal: 'Végétarien',
            willAttend: true,
          },
        ],
      };

      await expect(service.addRow(createGuestDto)).rejects.toThrow(
        'Le prénom des invités ne peut pas être vide',
      );
      expect(mockAppend).not.toHaveBeenCalled();
    });

    it('should throw error when guest in guestList has empty lastName', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: 'John',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 2,
        guestList: [
          {
            firstName: 'Jane',
            lastName: '',
            meal: 'Végétarien',
            willAttend: true,
          },
        ],
      };

      await expect(service.addRow(createGuestDto)).rejects.toThrow(
        'Le nom des invités ne peut pas être vide',
      );
      expect(mockAppend).not.toHaveBeenCalled();
    });

    it('should successfully add a row with multiple guests when all names are valid', async () => {
      const createGuestDto: CreateGuestDto = {
        firstName: 'John',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 3,
        guestList: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
            meal: 'Végétarien',
            willAttend: true,
          },
          {
            firstName: 'Jack',
            lastName: 'Smith',
            meal: 'Normal',
            willAttend: false,
          },
        ],
      };

      mockAppend.mockResolvedValue({});

      await expect(service.addRow(createGuestDto)).resolves.not.toThrow();
      expect(mockAppend).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateRow', () => {
    it('should successfully update a row with partial data', async () => {
      const updateGuestDto: UpdateGuestDto = {
        meal: 'Végétarien',
      };

      mockGet.mockResolvedValue({
        data: {
          values: [['John DOE', 'Normal', 'Oui', 1]],
        },
      });
      mockUpdate.mockResolvedValue({});

      await expect(service.updateRow(2, updateGuestDto)).resolves.not.toThrow();
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    it('should handle empty existing row', async () => {
      const updateGuestDto: UpdateGuestDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockGet.mockResolvedValue({
        data: {
          values: [],
        },
      });
      mockUpdate.mockResolvedValue({});

      await expect(service.updateRow(2, updateGuestDto)).resolves.not.toThrow();
    });
  });

  describe('getAllRows', () => {
    it('should return all rows', async () => {
      const mockRows = [
        ['John DOE', 'Normal', 'Oui', 1],
        ['Jane SMITH', 'Végétarien', 'Oui', 2],
      ];

      mockGet.mockResolvedValue({
        data: {
          values: mockRows,
        },
      });

      const result = await service.getAllRows();

      expect(result).toEqual(mockRows);
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no data', async () => {
      mockGet.mockResolvedValue({
        data: {},
      });

      const result = await service.getAllRows();

      expect(result).toEqual([]);
    });
  });
});
