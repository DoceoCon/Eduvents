import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('SMTP Server is ready to take our messages');
    }
});

export async function sendEventConfirmationEmail(organiserEmail: string, organiserName: string, eventTitle: string) {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: organiserEmail,
            subject: `Payment Made & Event Listed - EDUVENTS`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
                    <h2 style="color: #0F172A; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Payment Confirmation</h2>
                    <p>Hi ${organiserName},</p>
                    <p>Thank you for your payment. This email confirms that we have successfully received your payment for listing your event <strong>"${eventTitle}"</strong> on our website.</p>
                    <p>Your payment has been recorded and processed successfully.</p>
                    <p>Your event is currently under review. You will receive a separate notification informing you whether your event has been approved or rejected. The review process will be completed within 24 hours.</p>
                    <p>If you have any questions in the meantime, please feel free to contact us. Thank you for choosing our platform.</p>
                    <p>Best regards,<br><strong>EDUVENTS Team</strong></p>
                    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #64748b;">This is an automated message. Please do not reply to this email.</p>
                </div>
            `,
            text: `
Hi ${organiserName},

Thank you for your payment. This email confirms that we have successfully received your payment for listing your event "${eventTitle}" on our website.

Your payment has been recorded and processed successfully.

Your event is currently under review. You will receive a separate notification informing you whether your event has been approved or rejected. The review process will be completed within 24 hours.

If you have any questions in the meantime, please feel free to contact us. Thank you for choosing our platform.

Best regards,
EDUVENTS Team
            `
        };

        console.log(`Attempting to send payment confirmation email to ${organiserEmail}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`Payment confirmation email sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
}

export async function sendAdminNewEventNotification(eventData: any) {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: process.env.ADMIN_EMAIL || 'info@doceoconsulting.co.uk',
            subject: `New Event Submission: ${eventData.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #0F172A;">New Event Awaiting Review</h2>
                    <p>A new event has been submitted and is awaiting your approval.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Title:</strong> ${eventData.title}</p>
                        <p><strong>Organiser:</strong> ${eventData.organiser}</p>
                        <p><strong>Email:</strong> ${eventData.organiserEmail}</p>
                        <p><strong>Date:</strong> ${eventData.date}</p>
                    </div>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" style="background-color: #0F172A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Admin Dashboard</a>
                </div>
            `
        };

        console.log(`Attempting to send admin notification for event: ${eventData.title}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`Admin notification sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending admin notification:', error);
        return false;
    }
}

export async function sendStatusUpdateEmail(organiserEmail: string, organiserName: string, eventTitle: string, status: 'approved' | 'rejected') {
    try {
        const isApproved = status === 'approved';
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: organiserEmail,
            subject: `Event Review Update: ${eventTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: ${isApproved ? '#10b981' : '#ef4444'};">${isApproved ? 'Event Approved!' : 'Event Not Approved'}</h2>
                    <p>Dear ${organiserName},</p>
                    <p>We have completed the review for your event <strong>"${eventTitle}"</strong>.</p>
                    ${isApproved
                    ? `<p>Your event has been <strong>approved</strong> and is now live on our website.</p>
                           <div style="margin: 30px 0;">
                               <a href="${process.env.NEXT_PUBLIC_BASE_URL}/events" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Live Event</a>
                           </div>`
                    : `<p>Unfortunately, your event submission has been <strong>rejected</strong> at this time. If you have any questions or would like to appeal this decision, please contact us.</p>`
                }
                    <p>Thank you for choosing EDUVENTS!</p>
                </div>
            `
        };

        console.log(`Attempting to send status update email (${status}) to ${organiserEmail}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`Status update email sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending status update email:', error);
        return false;
    }
}
