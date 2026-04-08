import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import teacherRoutes from './routes/teachers'
import uploadRoutes from './routes/uploads'

dotenv.config()

const app = express()
app.use(express.json())

// API routes
app.use('/api/teachers', teacherRoutes)
app.use('/api/uploads', uploadRoutes)

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Backend is running' })
})

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK')
})

const port = Number(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
