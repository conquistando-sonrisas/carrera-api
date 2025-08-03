
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  name: process.env.MAIL_HOST,
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})


export default transporter;