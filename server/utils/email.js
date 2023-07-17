const mailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (email, subject, text) => {
  let connectionInfo = {
    host: process.env.EHOST,
    sevice: process.env.SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EUSER,
      pass: process.env.EPASS,
    },
  };

  try {
    const transporter = mailer.createTransport(connectionInfo);

    await transporter.sendMail({
      from: "finchcoservice@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email Sent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
