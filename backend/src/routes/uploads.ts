import { Router, Request, Response } from 'express';
import multer from 'multer';
import { FileValidator } from '../services/fileValidator';
import { NotificationService } from '../services/notificationService';
import { UploadService } from '../services/uploadService';
import { TeacherService } from '../services/teacherService';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/uploads/validate - Validate CSV file
router.post('/validate', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const result = FileValidator.validateCSV(csvContent);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate file' });
  }
});

// POST /api/uploads - Upload and process CSV file
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const teacherId = req.body.teacherId;
    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }

    // Verify teacher exists
    const teacher = await TeacherService.getTeacherById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const validation = FileValidator.validateCSV(csvContent);

    // Create upload record
    const uploadRecord = await UploadService.createUpload(
      teacherId,
      req.file.originalname,
      validation.isValid ? 'success' : 'failed',
      validation.rows.length,
      validation.rows.filter(r => validation.isValid).length
    );

    // If validation passed, save participants to database
    if (validation.isValid && validation.rows.length > 0) {
      const participants = validation.rows.map(row => ({
        firstName: row.firstName,
        lastName: row.lastName,
        level: row.level as 'Primaria' | 'Secundaria',
        course: row.course as 1 | 2 | 3 | 4 | 5 | 6,
        birthDate: new Date(row.birthDate),
      }));

      await UploadService.createParticipants(uploadRecord.id, participants);
    }

    // Send notification (mock email)
    try {
      await NotificationService.sendUploadResult(
        teacher.email, // Use real email from database
        uploadRecord.filename,
        uploadRecord.status,
        uploadRecord.validRows,
        uploadRecord.totalRows
      );
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }

    res.json({
      upload: uploadRecord,
      validation,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

// GET /api/uploads/:teacherId - Get uploads for a teacher
router.get('/:teacherId', async (req: Request, res: Response) => {
  try {
    const uploads = await UploadService.getUploadsByTeacher(req.params.teacherId as string);
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
});

// GET /api/uploads/:uploadId/participants - Get participants for an upload
router.get('/:uploadId/participants', async (req: Request, res: Response) => {
  try {
    const participants = await UploadService.getParticipantsByUpload(req.params.uploadId as string);
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

export default router;