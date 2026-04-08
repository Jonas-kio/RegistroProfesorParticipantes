import { FileValidationResult, FileValidationError, ParsedParticipant, REQUIRED_COLUMNS, VALID_LEVELS, VALID_COURSES } from '../types';

export class FileValidator {
  static validateCSV(csvContent: string): FileValidationResult {
    const errors: FileValidationError[] = [];
    const rows: ParsedParticipant[] = [];

    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      errors.push({ message: 'CSV must have at least a header row and one data row' });
      return { isValid: false, errors, rows };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = REQUIRED_COLUMNS.map(col => col.toLowerCase());

    // Check required columns
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        errors.push({ message: `Missing required column: ${required}` });
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors, rows };
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        errors.push({ row: i + 1, message: 'Incorrect number of columns' });
        continue;
      }

      const participant: ParsedParticipant = {
        firstName: '',
        lastName: '',
        level: '',
        course: 0,
        birthDate: '',
      };

      // Map columns
      headers.forEach((header, index) => {
        const value = values[index];
        switch (header) {
          case 'nombre del estudiante':
            participant.firstName = value;
            break;
          case 'apellidos estudiante':
            participant.lastName = value;
            break;
          case 'primaria/secundaria':
            participant.level = value;
            break;
          case 'curso':
            participant.course = parseInt(value, 10);
            break;
          case 'fecha de nacimiento':
            participant.birthDate = value;
            break;
        }
      });

      // Validate participant data
      if (!participant.firstName) {
        errors.push({ row: i + 1, column: 'nombre del estudiante', message: 'First name is required' });
      }
      if (!participant.lastName) {
        errors.push({ row: i + 1, column: 'apellidos estudiante', message: 'Last name is required' });
      }
      if (!VALID_LEVELS.includes(participant.level as any)) {
        errors.push({ row: i + 1, column: 'primaria/secundaria', message: `Level must be one of: ${VALID_LEVELS.join(', ')}` });
      }
      if (!VALID_COURSES.includes(participant.course as any)) {
        errors.push({ row: i + 1, column: 'curso', message: `Course must be one of: ${VALID_COURSES.join(', ')}` });
      }
      if (!participant.birthDate || isNaN(Date.parse(participant.birthDate))) {
        errors.push({ row: i + 1, column: 'fecha de nacimiento', message: 'Valid birth date is required' });
      }

      rows.push(participant);
    }

    return {
      isValid: errors.length === 0,
      errors,
      rows,
    };
  }
}