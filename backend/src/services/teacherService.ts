import pool from '../db/database';
import { Teacher, Institution, TeacherRegistrationInput } from '../types';

export class TeacherService {
  static async registerTeacher(input: TeacherRegistrationInput): Promise<Teacher> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if institution exists or create new one
      let institution: Institution;
      if (input.institutionId) {
        const institutionResult = await client.query(
          'SELECT id, name, city, created_at FROM institutions WHERE id = $1',
          [input.institutionId]
        );
        if (institutionResult.rows.length === 0) {
          throw new Error('Institution not found');
        }
        institution = institutionResult.rows[0];
      } else if (input.newInstitutionName && input.newInstitutionCity) {
        const institutionResult = await client.query(
          'INSERT INTO institutions (name, city) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id, name, city, created_at',
          [input.newInstitutionName, input.newInstitutionCity]
        );
        institution = institutionResult.rows[0];
      } else {
        throw new Error('Institution ID or new institution details required');
      }

      // Check if teacher already exists
      const existingTeacher = await client.query(
        'SELECT id FROM teachers WHERE email = $1',
        [input.email]
      );
      if (existingTeacher.rows.length > 0) {
        throw new Error('Teacher with this email already exists');
      }

      // Create new teacher
      const teacherResult = await client.query(
        'INSERT INTO teachers (full_name, email, institution_id) VALUES ($1, $2, $3) RETURNING id, full_name, email, institution_id, registered_at',
        [input.fullName, input.email, institution.id]
      );

      await client.query('COMMIT');

      return teacherResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getTeachers(): Promise<Teacher[]> {
    const result = await pool.query(`
      SELECT t.id, t.full_name, t.email, t.institution_id, t.registered_at,
             i.name as institution_name, i.city as institution_city
      FROM teachers t
      JOIN institutions i ON t.institution_id = i.id
      ORDER BY t.registered_at DESC
    `);
    return result.rows.map(row => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      institutionId: row.institution_id,
      registeredAt: row.registered_at,
    }));
  }

  static async getTeacherById(id: string): Promise<Teacher | null> {
    const result = await pool.query(`
      SELECT t.id, t.full_name, t.email, t.institution_id, t.registered_at,
             i.name as institution_name, i.city as institution_city
      FROM teachers t
      JOIN institutions i ON t.institution_id = i.id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      institutionId: row.institution_id,
      registeredAt: row.registered_at,
    };
  }

  static async getInstitutions(): Promise<Institution[]> {
    const result = await pool.query(
      'SELECT id, name, city, created_at FROM institutions ORDER BY name'
    );
    return result.rows;
  }
}