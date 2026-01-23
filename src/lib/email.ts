import nodemailer from 'nodemailer';

export async function sendEventConfirmationEmail(organiserEmail: string, organiserName: string, eventTitle: string) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '2525', 10),
            secure: parseInt(process.env.SMTP_PORT || '2525', 10) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: organiserEmail,
            subject: `Your Event "${eventTitle}" has been listed!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #0F172A;">Event Successfully Listed!</h2>
                    <p>Dear ${organiserName},</p>
                    <p>We are excited to inform you that your event <strong>"${eventTitle}"</strong> has been successfully listed on <strong>EDUVENTS</strong>.</p>
                    <p>It is now live and visible to educators across the UK.</p>
                    <div style="margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_URL || 'https://eduvents.co.uk'}/events" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Your Event</a>
                    </div>
                    <p>Thank you for choosing EDUVENTS!</p>
                    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #64748b;">This is an automated message. Please do not reply to this email.</p>
                </div>
            `,
            text: `
                Hello ${organiserName},
                
                Your event "${eventTitle}" has been successfully listed on EDUVENTS.
                
                You can view it here: ${process.env.NEXT_PUBLIC_URL || 'https://eduvents.co.uk'}/events
                
                Thank you for choosing EDUVENTS!
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${organiserEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
}
