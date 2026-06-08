import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    // Reuse existing nodemailer transporter (same as OTP)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    // Email to admin (you)
    await transporter.sendMail({
      from: `"StorageApp Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // your email
      subject: `New Contact Message from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${message.replace(/\n/g, '<br>')}</p>
          <hr />
          <p style="font-size: 12px; color: #6b7280;">Sent from StorageApp contact form</p>
        </div>
      `,
    });

    // Optional: Send auto-reply to user
    await transporter.sendMail({
      from: `"StorageApp Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "We've received your message",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #4f46e5;">Thank you for contacting StorageApp</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <p>Here's a copy of your message:</p>
          <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${message.replace(/\n/g, '<br>')}</p>
          <p>Best regards,<br/>StorageApp Team</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
};