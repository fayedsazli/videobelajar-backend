// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email kamu
    pass: process.env.EMAIL_PASS  // Password atau App Password dari Gmail
  }
});

// Fungsi untuk mengirim email verifikasi
const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:5000/api/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'EduCourse - Email Verification',
    html: `
      <h2>Verifikasi Email Anda</h2>
      <p>Klik link di bawah untuk memverifikasi email Anda:</p>
      <a href="${verificationLink}">Verifikasi Sekarang</a>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email: ", err);
    } else {
      console.log("Verification email sent: ", info.response);
    }
  });
};

module.exports = { sendVerificationEmail };
