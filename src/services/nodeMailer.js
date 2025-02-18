import { createTransport } from 'nodemailer';
import Verify from '../models/verifyModel.js';

async function sendEmail(data) {
    return new Promise(async (resolve, reject) => {
        try {

            // Create a transporter
            let transporter = createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL, 
                    pass: process.env.PASS 
                }
            });
             
            // Generate OTP
            const token = generateOTP();
            let verify = await Verify.findOne({email :data.email})
            if(verify){
               
                verify.token = token;
                await verify.save()

            }else{
            verify = new Verify({
                name: data.name,
                email: data.email,
                phone:data.phone,
                password:data.password,
                token: token,
            });
            await verify.save();
        }
            const template = `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Social Media OTP Email</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
              <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; text-align: center;">Social Media OTP Code</h2>
                <p>Hello ${data.userName},</p>
                <p>You have requested an OTP code to verify your identity on our social media platform. Please enter the following code on the verification page to complete the process:</p>
                <p style="text-align: center; font-size: 24px; font-weight: bold;">OTP Code: ${token}</p>
                <p>If you did not request this code, please ignore this message. The code is valid for 30 minutes.</p>
                <p>Thank you for using our social media platform.</p>
                <p style="text-align: center;">Best regards,<br>The Social Media Team</p>
              </div>
            </body>
            </html>`;
            

            // Send email
            const info = await transporter.sendMail({
                from: process.env.EMAIL, // Sender address
                to: data.email, // Recipient address
                subject: 'Your OTP', // Subject line
                text: '', // Plain text body
                html: template // HTML body
            });

            console.log('Email sent: ', info.messageId, "otp", token);

            resolve(verify);
      
        } catch (error) {
            console.error('Error sending OTP: ', error);
            reject(error);
        }
    });
}

function generateOTP() {
    // Generate a random 4-digit OTP
    return Math.floor(1000 + Math.random() * 9000).toString();
}


export default sendEmail