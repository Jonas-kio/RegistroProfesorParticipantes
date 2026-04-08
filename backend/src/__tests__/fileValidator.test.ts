import { FileValidator } from '../services/fileValidator';

describe('FileValidator', () => {
  describe('validateCSV', () => {
    it('should validate correct CSV', () => {
      const csv = `nombre del estudiante,apellidos estudiante,primaria/secundaria,curso,fecha de nacimiento
Juan,Pérez,Primaria,1,2000-01-01
María,García,Secundaria,3,1999-05-15`;

      const result = FileValidator.validateCSV(csv);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({
        firstName: 'Juan',
        lastName: 'Pérez',
        level: 'Primaria',
        course: 1,
        birthDate: '2000-01-01',
      });
    });

    it('should detect missing required columns', () => {
      const csv = `nombre,apellidos,nivel,grado,fecha
Juan,Pérez,Primaria,1,2000-01-01`;

      const result = FileValidator.validateCSV(csv);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ message: 'Missing required column: nombre del estudiante' });
      expect(result.errors).toContainEqual({ message: 'Missing required column: apellidos estudiante' });
    });

    it('should validate invalid level', () => {
      const csv = `nombre del estudiante,apellidos estudiante,primaria/secundaria,curso,fecha de nacimiento
Juan,Pérez,Preescolar,1,2000-01-01`;

      const result = FileValidator.validateCSV(csv);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        row: 2,
        column: 'primaria/secundaria',
        message: 'Level must be one of: Primaria, Secundaria'
      });
    });

    it('should validate invalid course', () => {
      const csv = `nombre del estudiante,apellidos estudiante,primaria/secundaria,curso,fecha de nacimiento
Juan,Pérez,Primaria,7,2000-01-01`;

      const result = FileValidator.validateCSV(csv);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        row: 2,
        column: 'curso',
        message: 'Course must be one of: 1, 2, 3, 4, 5, 6'
      });
    });

    it('should validate invalid birth date', () => {
      const csv = `nombre del estudiante,apellidos estudiante,primaria/secundaria,curso,fecha de nacimiento
Juan,Pérez,Primaria,1,invalid-date`;

      const result = FileValidator.validateCSV(csv);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        row: 2,
        column: 'fecha de nacimiento',
        message: 'Valid birth date is required'
      });
    });

    it('should validate missing required fields', () => {
      const csv = `nombre del estudiante,apellidos estudiante,primaria/secundaria,curso,fecha de nacimiento
,Pérez,Primaria,1,2000-01-01
Juan,,Secundaria,2,1999-01-01`;

      const result = FileValidator.validateCSV(csv);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        row: 2,
        column: 'nombre del estudiante',
        message: 'First name is required'
      });
      expect(result.errors).toContainEqual({
        row: 3,
        column: 'apellidos estudiante',
        message: 'Last name is required'
      });
    });
  });
});