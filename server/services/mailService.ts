export const mailService = async (to: string, otp: string) =>{
    const { sendMail } = useNodeMailer();
    sendMail({
        subject: 'One Time Password (OTP) for login',
        text: `The Otp for the signUp is ${otp}. Do Not Share This OTP with anyone else`,
        html: `
            <div style="line-height: 1.5;">
            <h2 style="color: #1976D2;">Welcome to Our App!</h2>
            <p>Your OTP for signing up is:</p>
            <p style="font-size: 1.5rem; font-weight: bold; color: #1976D2;">${otp}</p>
            <p style="color: #D32F2F;">Do <strong>not</strong> share this OTP with anyone else. This OTP is valid for 30 minutes.</p>
            <hr style="border: none; border-top: 1px solid;" />
            <p style="font-size: 0.9rem;">If you didn’t request this, please ignore this email.</p>
            </div>
        `,
        to: to
    })
}