import { TeacherService } from '../services/teacherService';
import { TeacherRegistrationInput } from '../types';

describe('TeacherService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    (TeacherService as any).teachers = [];
    (TeacherService as any).institutions = [];
  });

  describe('registerTeacher', () => {
    it('should register a teacher with existing institution', async () => {
      // Create mock institution
      const institution = {
        id: 'inst_1',
        name: 'Test School',
        city: 'Test City',
        createdAt: new Date(),
      };
      (TeacherService as any).institutions.push(institution);

      const input: TeacherRegistrationInput = {
        fullName: 'John Doe',
        email: 'john@example.com',
        institutionId: 'inst_1',
      };

      const teacher = await TeacherService.registerTeacher(input);

      expect(teacher.fullName).toBe('John Doe');
      expect(teacher.email).toBe('john@example.com');
      expect(teacher.institutionId).toBe('inst_1');
      expect(teacher.id).toBeDefined();
      expect(teacher.registeredAt).toBeInstanceOf(Date);
    });

    it('should create new institution if not exists', async () => {
      const input: TeacherRegistrationInput = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        newInstitutionName: 'New School',
        newInstitutionCity: 'New City',
      };

      const teacher = await TeacherService.registerTeacher(input);

      expect(teacher.fullName).toBe('Jane Doe');
      expect(teacher.email).toBe('jane@example.com');
      expect(teacher.institutionId).toBeDefined();

      const institutions = await TeacherService.getInstitutions();
      expect(institutions).toHaveLength(1);
      expect(institutions[0].name).toBe('New School');
      expect(institutions[0].city).toBe('New City');
    });

    it('should throw error if teacher email already exists', async () => {
      const input: TeacherRegistrationInput = {
        fullName: 'John Doe',
        email: 'john@example.com',
        newInstitutionName: 'Test School',
        newInstitutionCity: 'Test City',
      };

      await TeacherService.registerTeacher(input);

      await expect(TeacherService.registerTeacher(input)).rejects.toThrow('Teacher with this email already exists');
    });

    it('should throw error if institution not found', async () => {
      const input: TeacherRegistrationInput = {
        fullName: 'John Doe',
        email: 'john@example.com',
        institutionId: 'nonexistent',
      };

      await expect(TeacherService.registerTeacher(input)).rejects.toThrow('Institution not found');
    });
  });

  describe('getTeachers', () => {
    it('should return all teachers', async () => {
      const input: TeacherRegistrationInput = {
        fullName: 'John Doe',
        email: 'john@example.com',
        newInstitutionName: 'Test School',
        newInstitutionCity: 'Test City',
      };

      await TeacherService.registerTeacher(input);
      const teachers = await TeacherService.getTeachers();

      expect(teachers).toHaveLength(1);
      expect(teachers[0].fullName).toBe('John Doe');
    });
  });

  describe('getTeacherById', () => {
    it('should return teacher by id', async () => {
      const input: TeacherRegistrationInput = {
        fullName: 'John Doe',
        email: 'john@example.com',
        newInstitutionName: 'Test School',
        newInstitutionCity: 'Test City',
      };

      const teacher = await TeacherService.registerTeacher(input);
      const found = await TeacherService.getTeacherById(teacher.id);

      expect(found).toEqual(teacher);
    });

    it('should return null if teacher not found', async () => {
      const found = await TeacherService.getTeacherById('nonexistent');
      expect(found).toBeNull();
    });
  });
});