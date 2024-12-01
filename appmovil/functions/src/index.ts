import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

export const sendRecoveryEmail = functions.https.onRequest(async (req, res) => {
  // Agregar headers CORS manualmente
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { email, recoveryCode } = req.body;

    // Acceder a las variables de entorno para las credenciales de Gmail
    const gmailEmail = process.env.GMAIL_EMAIL!;
    const gmailPassword = process.env.GMAIL_PASSWORD!;

    // Configurar el transporter si no está configurado
    if (!transporter) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailEmail,
          pass: gmailPassword,
        },
      });
    }

    // Enviar correo
    await transporter.sendMail({
      from: gmailEmail,
      to: email,
      subject: 'Password Recovery Code',
      text: `Your recovery code is: ${recoveryCode}`,
    });

    res.json({ success: true, message: 'Recovery email sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send recovery email',
    });
  }
});