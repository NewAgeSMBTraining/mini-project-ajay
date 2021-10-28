import nodemailer from "nodemailer";

const sendEmail = async (to: string, title: string, message: string) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Admin" ${process.env.GMAIL}`,
      to,
      subject: title,
      text: message,
    });

    return { info, status: true };
  } catch (e: any) {
    console.log(e.message);
    return { info: null, status: false };
  }
};

export default sendEmail;
