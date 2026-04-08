import { Teacher, Institution, TeacherRegistrationInput, FileValidationResult } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getTeachers(): Promise<Teacher[]> {
    return this.request('/teachers');
  }

  async getTeacher(id: string): Promise<Teacher> {
    return this.request(`/teachers/${id}`);
  }

  async registerTeacher(input: TeacherRegistrationInput): Promise<Teacher> {
    return this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getInstitutions(): Promise<Institution[]> {
    return this.request('/teachers/institutions');
  }

  async validateFile(file: File): Promise<FileValidationResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/uploads/validate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async uploadFile(file: File, teacherId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('teacherId', teacherId);

    const response = await fetch(`${API_BASE_URL}/uploads`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();