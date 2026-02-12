import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateGuestDto, UpdateGuestDto, GuestItemDto } from './guest.dto';

describe('Guest DTOs Validation', () => {
  describe('CreateGuestDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(CreateGuestDto, {
        firstName: 'John',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 2,
        guestList: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
            meal: 'Végétarien',
            willAttend: true,
          },
        ],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when firstName is empty', async () => {
      const dto = plainToClass(CreateGuestDto, {
        firstName: '',
        lastName: 'Doe',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when lastName is empty', async () => {
      const dto = plainToClass(CreateGuestDto, {
        firstName: 'John',
        lastName: '',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lastName');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when both firstName and lastName are empty', async () => {
      const dto = plainToClass(CreateGuestDto, {
        firstName: '',
        lastName: '',
        meal: 'Normal',
        willAttend: true,
        numberOfGuests: 1,
        guestList: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const properties = errors.map((e) => e.property);
      expect(properties).toContain('firstName');
      expect(properties).toContain('lastName');
    });
  });

  describe('UpdateGuestDto', () => {
    it('should pass validation with valid partial data', async () => {
      const dto = plainToClass(UpdateGuestDto, {
        firstName: 'John',
        meal: 'Végétarien',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation when fields are not provided', async () => {
      const dto = plainToClass(UpdateGuestDto, {
        meal: 'Normal',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when firstName is empty string', async () => {
      const dto = plainToClass(UpdateGuestDto, {
        firstName: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when lastName is empty string', async () => {
      const dto = plainToClass(UpdateGuestDto, {
        lastName: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lastName');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when both firstName and lastName are empty strings', async () => {
      const dto = plainToClass(UpdateGuestDto, {
        firstName: '',
        lastName: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const properties = errors.map((e) => e.property);
      expect(properties).toContain('firstName');
      expect(properties).toContain('lastName');
    });

    it('should pass validation with valid firstName and lastName', async () => {
      const dto = plainToClass(UpdateGuestDto, {
        firstName: 'John',
        lastName: 'Doe',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('GuestItemDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(GuestItemDto, {
        firstName: 'Jane',
        lastName: 'Smith',
        meal: 'Végétarien',
        willAttend: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when firstName is empty', async () => {
      const dto = plainToClass(GuestItemDto, {
        firstName: '',
        lastName: 'Smith',
        meal: 'Normal',
        willAttend: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when lastName is empty', async () => {
      const dto = plainToClass(GuestItemDto, {
        firstName: 'Jane',
        lastName: '',
        meal: 'Normal',
        willAttend: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lastName');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });
});
