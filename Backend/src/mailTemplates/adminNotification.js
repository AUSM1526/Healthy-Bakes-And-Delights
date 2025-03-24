const adminOrderNotification = (userName,firstName, lastName, userEmail, totalAmount) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>New Order Notification</title>
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
				padding: 20px;
				text-align: center;
			}
	
			.header {
				background-color: #FFD60A;
				padding: 15px;
				color: #000;
				font-size: 22px;
				font-weight: bold;
			}
	
			.body {
				margin: 20px 0;
				text-align: left;
			}
	
			.order-details {
				background-color: #f4f4f4;
				padding: 15px;
				border-radius: 8px;
				margin: 20px 0;
			}
	
			.footer {
				margin-top: 20px;
				font-size: 14px;
				color: #777;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<div class="header">New Order Placed</div>
			
			<div class="body">
				<p>Dear Admin,</p>
				<p>A new order has been placed by <strong>${firstName} ${lastName} (userName: ${userName})</strong> (<a href="mailto:${userEmail}">${userEmail}</a>).</p>
				
				<div class="order-details">
					<p><strong>Total Amount:</strong> ₹${totalAmount}</p>
					<p>Please verify the payment and approve the order manually.</p>
				</div>
				
				<p>Thank you for managing the orders efficiently!</p>
			</div>
			
			<div class="footer">
				<p>This is an automated message. Please do not reply to this email.</p>
			</div>
		</div>
	</body>
	
	</html>`;
};

export { adminOrderNotification };
