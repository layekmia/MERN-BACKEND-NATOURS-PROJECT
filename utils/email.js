const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create a transporter;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // false for TLS (587)
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // active in gmail 'less secure app" options;
  });
  // 2) Define the email options;
  const mailOptions = {
    from: `Layek Miah <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
