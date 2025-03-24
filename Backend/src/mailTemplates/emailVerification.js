const otpTemplate = (otp, adminEmail) => {
	return `<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>OTP Verification</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.6;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 30px;
				text-align: center;
				box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				border-radius: 8px;
				background-color: #f9f9f9;
			}
	
			.header {
				background-color: #FFD60A;
				padding: 20px;
				border-radius: 8px 8px 0 0;
				color: #000;
				font-size: 24px;
				font-weight: bold;
			}
	
			.logo {
				max-width: 150px;
				margin-bottom: 20px;
			}
	
			.body {
				padding: 20px;
				text-align: left;
			}
	
			.otp {
				font-size: 28px;
				font-weight: bold;
				color: #333;
				margin: 20px 0;
			}
	
			.notice {
				font-size: 14px;
				color: #555;
				margin-top: 20px;
			}
	
			.footer {
				margin-top: 30px;
				font-size: 14px;
				color: #777;
			}
	
			.footer a {
				color: #0056b3;
				text-decoration: none;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<div class="header">Healthy Bakes & Delights OTP Verification</div>
			
			<div class="body">
				<p>Dear Customer,</p>
				<p>Thank you for shopping with <strong>Healthy Bakes & Delights</strong>. To verify your email please use the following OTP:</p>
				<div class="otp">${otp}</div>
				<p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this OTP, please ignore this message.</p>
			</div>
	
			<div class="notice">
				<p>If you encounter any issues, feel free to contact our support team at <a href="mailto:${adminEmail}">:${adminEmail}</a>. We are happy to assist you!</p>
			</div>
			
			<div class="footer">
				<p>Thank you for choosing <strong>Healthy Bakes & Delights</strong>. We hope you enjoy your sweet treats!</p>
			</div>
		</div>
	</body>
	
	</html>`;
};

export { otpTemplate };
