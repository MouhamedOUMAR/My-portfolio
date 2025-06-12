const nodemailer = require('nodemailer');

const EMAIL_ADDRESS = 'YOUR_EMAIL@gmail.com'; // replace with your Gmail address
const GMAIL_PASSKEY = 'YOUR_APP_PASSWORD';   // replace with your Gmail App Password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ADDRESS,
    pass: GMAIL_PASSKEY,
  },
});

const mailOptions = {
  from: EMAIL_ADDRESS,
  to: EMAIL_ADDRESS, // send to yourself for testing
  subject: 'Test Email from Node.js',
  text: 'This is a test email sent using Nodemailer and Gmail SMTP.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Error sending email:', error);
  }
  console.log('Email sent:', info.response);
});
