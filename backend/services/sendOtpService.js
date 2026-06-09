import Brevo from 'sib-api-v3-sdk';
import OTP from "../models/otpModel.js";

// Configure Brevo
const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

export async function sendOtpService(email) {
  // OTP generate karo (4-digit)
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Database mein save/update karo
  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true }
  );

  // Brevo ke through email bhejo
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.sender = { email: process.env.GMAIL_USER, name: "StorageApp" };
  sendSmtpEmail.subject = "Storage App OTP";
  sendSmtpEmail.htmlContent = `
    <div style="font-family:sans-serif;">
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  await apiInstance.sendTransacEmail(sendSmtpEmail);
  return { success: true, message: `OTP sent successfully on ${email}` };
}