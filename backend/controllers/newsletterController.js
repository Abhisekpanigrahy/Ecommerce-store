import nodemailer from 'nodemailer';
import validator from 'validator';

const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email address' });
        }

        const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

        if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
            return res.json({
                success: false,
                message: 'Email service is not configured. Add SMTP details in backend/.env.',
            });
        }

        const smtpUser = SMTP_USER.trim();
        const smtpPass = SMTP_PASS.replace(/\s/g, '');

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: SMTP_SECURE === 'true',
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        await transporter.sendMail({
            from: SMTP_FROM || smtpUser,
            to: email,
            subject: 'Welcome to Forever - Your 20% off update',
            text: `Hi,\n\nThanks for subscribing to Forever.\n\nYou will receive new arrivals, exclusive offers, and style updates from our store. Your 20% off subscriber offer is ready for your next order.\n\nBest regards,\nForever`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                    <h2>Welcome to Forever</h2>
                    <p>Thanks for subscribing to Forever.</p>
                    <p>You will receive new arrivals, exclusive offers, and style updates from our store.</p>
                    <p><strong>Your 20% off subscriber offer is ready for your next order.</strong></p>
                    <p>Best regards,<br/>Forever</p>
                </div>
            `,
        });

        res.json({ success: true, message: 'Subscription email sent successfully' });
    } catch (error) {
        console.log(error);
        const message = error.responseCode === 535
            ? 'Gmail rejected the SMTP login. Use a 16-character app password for the same Gmail account in SMTP_USER.'
            : error.message;

        res.json({ success: false, message });
    }
};

export { subscribeNewsletter };
