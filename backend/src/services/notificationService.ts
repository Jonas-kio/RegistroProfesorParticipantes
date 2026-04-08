import nodemailer from 'nodemailer';

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendTeacherRegistrationConfirmation(email: string, teacherName: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Registro de Profesor Confirmado',
      html: `
        <h1>Bienvenido, ${teacherName}!</h1>
        <p>Tu registro como profesor ha sido confirmado exitosamente.</p>
        <p>Ya puedes subir listas de participantes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async sendUploadResult(email: string, filename: string, status: string, validRows: number, totalRows: number): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Resultado de carga: ${filename}`,
      html: `
        <h1>Resultado de Carga de Archivo</h1>
        <p>Archivo: ${filename}</p>
        <p>Estado: ${status}</p>
        <p>Filas válidas: ${validRows}/${totalRows}</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}