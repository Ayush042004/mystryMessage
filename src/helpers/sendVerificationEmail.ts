
import { transporter } from "@/lib/nodemailer";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import {render} from "@react-email/render";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
   
    try {
    const html = await render(VerificationEmail({ username, otp: verifyCode }));

    const mailOptions = {
      from: `"Mystery Message" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Mystery Message account",
      html,
    };

     await transporter.sendMail(mailOptions);
     console.log(`📤 Email sent to ${email} with code ${verifyCode}`);
    return { success: true, message: "Email sent successfully." };
        
    } catch (Error) {
         console.error('Error sending verification email:', Error);
    return { success: false, message: 'Failed to send verification email.' };
        
    }
}
