const otpTemplate = (otp, adminEmail) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      background-color: #fdf9f3;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #4b2e1e;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      text-align: center;
      border-radius: 12px;
      background-color: #ffffff;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }

    .header {
      background-color: #f5ebdf;
      padding: 20px;
      border-radius: 12px 12px 0 0;
      color: #4b2e1e;
      font-size: 22px;
      font-weight: 700;
      border-bottom: 1px solid #e7dccc;
    }

    .body {
      padding: 24px 28px;
      text-align: left;
    }

    .body p {
      margin-bottom: 16px;
    }

    .otp {
      font-size: 30px;
      font-weight: bold;
      color: #6a3d1a;
      margin: 28px 0;
      background-color: #fcf7f0;
      border: 1px dashed #e7dccc;
      padding: 12px 24px;
      display: inline-block;
      border-radius: 8px;
      letter-spacing: 4px;
    }

    .notice {
      font-size: 14px;
      color: #806651;
      margin-top: 16px;
      padding: 0 20px;
    }

    .footer {
      margin-top: 32px;
      font-size: 14px;
      color: #998675;
      padding-top: 16px;
      border-top: 1px solid #e7dccc;
    }

    a {
      color: #805b36;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">OTP Verification - Healthy Bakes & Delights</div>

    <div class="body">
      <p>Dear Customer,</p>
      <p>Thank you for shopping with <strong>Healthy Bakes & Delights</strong>. To verify your email, please use the OTP below:</p>

      <div class="otp">${otp}</div>

      <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request it, please disregard this email.</p>
    </div>

    <div class="notice">
      <p>Need help? Contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>. We're here to assist you.</p>
    </div>

    <div class="footer">
      Thank you for choosing <strong>Healthy Bakes & Delights</strong>. We hope you enjoy your sweet treats.
    </div>
  </div>
</body>

</html>`;
};

export { otpTemplate };
