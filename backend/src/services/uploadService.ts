import pool from '../db/database';
import { Upload, Participant } from '../types';

export class UploadService {
  static async createUpload(teacherId: string, filename: string, status: string, totalRows: number, validRows: number): Promise<Upload> {
    const result = await pool.query(
      'INSERT INTO uploads (teacher_id, filename, status, total_rows, valid_rows) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [teacherId, filename, status, totalRows, validRows]
    );
    return result.rows[0];
  }

  static async updateUploadStatus(id: string, status: string, validRows?: number): Promise<void> {
    const query = validRows !== undefined
      ? 'UPDATE uploads SET status = $1, valid_rows = $2 WHERE id = $3'
      : 'UPDATE uploads SET status = $1 WHERE id = $2';
    const params = validRows !== undefined ? [status, validRows, id] : [status, id];

    await pool.query(query, params);
  }

  static async createParticipants(uploadId: string, participants: Omit<Participant, 'id' | 'uploadId'>[]): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const participant of participants) {
        await client.query(
          'INSERT INTO participants (upload_id, first_name, last_name, level, course, birth_date) VALUES ($1, $2, $3, $4, $5, $6)',
          [uploadId, participant.firstName, participant.lastName, participant.level, participant.course, participant.birthDate]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getUploadsByTeacher(teacherId: string): Promise<Upload[]> {
    const result = await pool.query(
      'SELECT * FROM uploads WHERE teacher_id = $1 ORDER BY uploaded_at DESC',
      [teacherId]
    );
    return result.rows;
  }

  static async getParticipantsByUpload(uploadId: string): Promise<Participant[]> {
    const result = await pool.query(
      'SELECT * FROM participants WHERE upload_id = $1 ORDER BY last_name, first_name',
      [uploadId]
    );
    return result.rows;
  }
}