const emailTemplate = (forgotPasswordURL, username) => {
  const subject = "PW Password Recovery";

  // create content of the reset password email as an HTML Link

  const emailStyles = `
  <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
    <div style="background-color: #ed0010; text-align: center; padding: 10px;">
      <h1 style="font-size: 30px; font-weight:700;">Shoppie</h1>
    </div>
    <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Dear ${username},</h1>
      <p style="color: #333;">You have requested to reset your password. Please click on the following link to reset your password:</p>
      <a href="${forgotPasswordURL}" style="color: #ed0010; text-decoration: none;">${forgotPasswordURL}</a>
      <p style="color: #333;">If you did not request this password reset, you can ignore this email.</p>
      <p style="color: #333;">Best regards,</p>
      <p style="color: #333;">PW Clone</p>
    </div>
  </div>
`;

  const message = `
  <html>
    <body>
      ${emailStyles}
    </body>
  </html>
`;

  return {
    subject: subject,
    message: message
  };
};

export default emailTemplate;
