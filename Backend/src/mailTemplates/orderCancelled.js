const orderCancelled = (userName, firstName, lastName, userEmail, totalAmount) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Order Cancellation Notification</title>
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
				background-color: #dc3545;
				padding: 15px;
				color: #ffffff;
				font-size: 22px;
				font-weight: bold;
			}
	
			.body {
				margin: 20px 0;
				text-align: left;
			}
	
			.order-details {
				background-color: #f8d7da;
				color: #721c24;
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
			<div class="header">Order Cancelled</div>
			
			<div class="body">
				<p>Dear Admin,</p>
				<p>An order has been cancelled by <strong>${firstName} ${lastName} (userName: ${userName})</strong> (<a href="mailto:${userEmail}">${userEmail}</a>).</p>
				
				<div class="order-details">
					<p><strong>Total Amount:</strong> ₹${totalAmount}</p>
					<p>Please review the cancellation and process the refund if applicable.</p>
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

export { orderCancelled };
