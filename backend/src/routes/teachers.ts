import { Router, Request, Response } from 'express';
import { TeacherService } from '../services/teacherService';
import { TeacherRegistrationInput } from '../types';

const router = Router();

// GET /api/teachers - Get all teachers
router.get('/', async (req: Request, res: Response) => {
  try {
    const teachers = await TeacherService.getTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// GET /api/teachers/:id - Get teacher by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const teacher = await TeacherService.getTeacherById(req.params.id as string);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

// POST /api/teachers - Register new teacher
router.post('/', async (req: Request, res: Response) => {
  try {
    const input: TeacherRegistrationInput = req.body;
    const teacher = await TeacherService.registerTeacher(input);
    res.status(201).json(teacher);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/institutions - Get all institutions
router.get('/institutions', async (req: Request, res: Response) => {
  try {
    const institutions = await TeacherService.getInstitutions();
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch institutions' });
  }
});

export default router;