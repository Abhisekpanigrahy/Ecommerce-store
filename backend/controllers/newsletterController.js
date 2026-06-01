import nodemailer from 'nodemailer';
import validator from 'validator';

const subscribeNewsletter = async (req, res) => {
    console.log(">>> SUBSCRIBE REQUEST RECEIVED for:", req.body.email);
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

        // Debug logs to verify .env is loading (you can remove these after testing)
        console.log("DEBUG: SMTP_USER:", smtpUser);
        console.log("DEBUG: SMTP_PASS length:", smtpPass.length);
        console.log("DEBUG: SMTP_PASS (masked):", smtpPass.substring(0, 4) + "****" + smtpPass.substring(smtpPass.length - 4));

        // Use service: 'gmail' if host is gmail, otherwise use host/port
        const transporterConfig = SMTP_HOST.includes('gmail.com') 
            ? {
                service: 'gmail',
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            }
            : {
                host: SMTP_HOST,
                port: Number(SMTP_PORT),
                secure: SMTP_SECURE === 'true',
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            };

        const transporter = nodemailer.createTransport(transporterConfig);

        await transporter.sendMail({
            from: SMTP_FROM || smtpUser,
            to: email,
            subject: 'Welcome to ELITE WEAR. - Your 20% off update',
            text: `Hi,\n\nThanks for subscribing to ELITE WEAR.\n\nYou will receive new arrivals, exclusive offers, and style updates from our store. Your 20% off subscriber offer is ready for your next order.\n\nBest regards,\nELITE WEAR.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                    <h2>Welcome to ELITE WEAR.</h2>
                    <p>Thanks for subscribing to ELITE WEAR.</p>
                    <p>You will receive new arrivals, exclusive offers, and style updates from our store.</p>
                    <p><strong>Your 20% off subscriber offer is ready for your next order.</strong></p>
                    <p>Best regards,<br/>ELITE WEAR.</p>
                </div>
            `,
        });

        res.json({ success: true, message: 'Subscription email sent successfully' });
    } catch (error) {
        console.log(error);
        let message = error.message;

        if (error.responseCode === 535 || error.message.includes('535') || error.message.includes('Invalid login')) {
            message = 'SMTP Authentication Failed: Gmail rejected the login. If you are using Gmail, please use a 16-character "App Password" instead of your regular password. Ensure 2nd Step Verification is enabled in your Google Account.';
        } else if (error.code === 'ECONNREFUSED') {
            message = 'SMTP Connection Refused: Please check your SMTP_HOST and SMTP_PORT configuration.';
        }

        res.json({ success: false, message });
    }
};

export { subscribeNewsletter };
