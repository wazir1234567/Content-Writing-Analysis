// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure SendGrid with your API key
sgMail.setApiKey('db0500d8-cc92-4124-ba30-384c5194622b');

app.use(cors());
app.use(bodyParser.json());

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const msg = {
      to: 'ha4006115@gmail.com', // Your receiving email
      from: 'noreply@yourdomain.com', // Use a verified sender in SendGrid
      subject: `New Contact Form: ${subject}`,
      text: `From: ${name} (${email})\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await sgMail.send(msg);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body?.errors || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.response?.body?.errors || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});