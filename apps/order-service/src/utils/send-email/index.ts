import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import ejs from "ejs";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const renderEmailTemplate = async (
  templatename: string,
  data: Record<string, any>
): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    "apps",
    "auth-service",
    "src",
    "utils",
    "email-templates",
    `${templatename}.ejs`
  );

  return ejs.renderFile(templatePath, {
    ...data,
    year: new Date().getFullYear(), // default year
  });
};


// /send email to the nodemailer

export const sendEmail = async (
  to: string,
  subject: string,
  templatename: string,
  data: Record<string, any>
) => {
  try {
    const html = await renderEmailTemplate(templatename, data);

    await transporter.sendMail({
      from: `${process.env.SMTP_USER}`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.log("Error sending Email",error)
    return false;
  }
};
