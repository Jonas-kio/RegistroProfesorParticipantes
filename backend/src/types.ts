export interface Institution {
  id: string;
  name: string;
  city: string;
  createdAt: Date;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  institutionId: string;
  registeredAt: Date;
}

export interface Participant {
  id: string;
  uploadId: string;
  firstName: string;
  lastName: string;
  level: 'Primaria' | 'Secundaria';
  course: 1 | 2 | 3 | 4 | 5 | 6;
  birthDate: Date;
}

export interface Upload {
  id: string;
  teacherId: string;
  filename: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  totalRows: number;
  validRows: number;
  uploadedAt: Date;
}

export interface TeacherRegistrationInput {
  fullName: string;
  email: string;
  institutionId?: string;
  newInstitutionName?: string;
  newInstitutionCity?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: FileValidationError[];
  rows: ParsedParticipant[];
}

export interface FileValidationError {
  row?: number;
  column?: string;
  message: string;
}

export interface ParsedParticipant {
  firstName: string;
  lastName: string;
  level: string;
  course: number;
  birthDate: string;
}

export const REQUIRED_COLUMNS = [
  'nombre del estudiante',
  'apellidos estudiante',
  'primaria/secundaria',
  'curso',
  'fecha de nacimiento',
] as const;

export type RequiredColumn = (typeof REQUIRED_COLUMNS)[number];

export const VALID_LEVELS = ['Primaria', 'Secundaria'] as const;
export const VALID_COURSES = [1, 2, 3, 4, 5, 6] as const;