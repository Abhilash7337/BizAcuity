const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #625d8c;">Verify Your Email</h2>
                    <p>Thank you for registering with Picture Wall Designer. To complete your registration, please use the following OTP:</p>
                    <div style="background-color: #f1e6cb; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #625d8c; margin: 0; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p style="color: #666;">If you didn't request this verification, please ignore this email.</p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

const sendPlanSubscriptionEmail = async (email, name, planDetails) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Subscription Confirmation: ${planDetails.name} Plan`,
            html: `
                <div style="font-family: 'Poppins', Arial, sans-serif; background: #f1e6cb; max-width: 600px; margin: 0 auto; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 24px rgba(98,93,140,0.08); border: 1px solid #e0d3b8;">
                    <div style="background: linear-gradient(90deg, #625d8c 60%, #ff9800 100%); padding: 32px 0 16px 0; text-align: center;">
                        <img src="https://placehold.co/80x80/orange/fff?text=Logo" alt="Picture Wall Designer Logo" style="width: 64px; height: 64px; border-radius: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px #ff980033;" />
                        <h2 style="color: #fff; font-size: 2rem; font-weight: 700; margin: 0; letter-spacing: 1px;">Picture Wall Designer</h2>
                    </div>
                    <div style="padding: 32px 32px 24px 32px; background: #fff; border-radius: 0 0 18px 18px;">
                        <h3 style="color: #625d8c; font-size: 1.5rem; font-weight: 600; margin-bottom: 8px;">Thank you for subscribing, <span style="color: #ff9800;">${name}</span>!</h3>
                        <p style="font-size: 1.1rem; color: #444; margin-bottom: 18px;">You have successfully subscribed to the <b style='color:#ff9800;'>${planDetails.name}</b> plan. Here are your plan details:</p>
                        <div style="background: #f1e6cb; border-radius: 12px; padding: 20px 24px; margin-bottom: 18px; border: 1px solid #e0d3b8;">
                            <h4 style="color: #625d8c; font-size: 1.1rem; margin: 0 0 10px 0;">Plan Details</h4>
                            <ul style="padding-left: 20px; color: #333; font-size: 1rem; margin: 0;">
                                <li><b>Plan Name:</b> ${planDetails.name}</li>
                                <li><b>Monthly Price:</b> <span style='color:#ff9800;'>₹${planDetails.monthlyPrice}</span></li>
                                <li><b>Yearly Price:</b> <span style='color:#ff9800;'>₹${planDetails.yearlyPrice}</span></li>
                                <li><b>Description:</b> ${planDetails.description || 'N/A'}</li>
                                <li><b>Features:</b> <ul style="margin: 6px 0 0 0; padding-left: 18px;">${(planDetails.features || []).map(f => `<li style='color:#625d8c;'>${f}</li>`).join('')}</ul></li>
                                <li><b>Limits:</b>
                                    <ul style="margin: 6px 0 0 0; padding-left: 18px;">
                                        <li>Saved Drafts: <b>${planDetails.limits?.designsPerMonth === -1 ? 'Unlimited' : planDetails.limits?.designsPerMonth}</b></li>
                                        <li>Image Uploads per Design: <b>${planDetails.limits?.imageUploadsPerDesign === -1 ? 'Unlimited' : planDetails.limits?.imageUploadsPerDesign}</b></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div style="text-align: center; margin: 24px 0 12px 0;">
                            <a href="https://picturewalldesigner.com/dashboard" style="display: inline-block; background: linear-gradient(90deg, #ff9800 60%, #625d8c 100%); color: #fff; font-weight: 600; font-size: 1.1rem; padding: 14px 36px; border-radius: 32px; text-decoration: none; box-shadow: 0 2px 8px #ff980033; letter-spacing: 1px;">Go to Dashboard</a>
                        </div>
                        <p style="color: #888; font-size: 0.95rem; margin-top: 18px; text-align: center;">If you have any questions or need support, please contact us at <a href="mailto:support@picturewalldesigner.com" style="color:#ff9800; text-decoration:underline;">support@picturewalldesigner.com</a>.</p>
                        <div style="margin-top: 32px; text-align: center; color: #b7a77a; font-size: 0.9rem;">
                            &copy; ${new Date().getFullYear()} Picture Wall Designer. All rights reserved.
                        </div>
                    </div>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Plan subscription email sending failed:', error);
        return false;
    }
};

module.exports = {
    sendOTPEmail,
    sendPlanSubscriptionEmail
}; 

