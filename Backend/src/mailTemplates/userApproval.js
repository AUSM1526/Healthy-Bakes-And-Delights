const userPendingApproval = (firstName, lastName, totalAmount, adminEmail) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Order Pending Approval</title>
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
			<div class="header">Order Awaiting Approval</div>
			
			<div class="body">
				<p>Dear <strong>${firstName} ${lastName}</strong>,</p>
				<p>Thank you for your order. Your payment is currently under manual verification by our admin team.</p>
				
				<div class="order-details">
					<p><strong>Total Amount:</strong> ₹${totalAmount}</p>
					<p>Please wait until the order is approved. You will receive a confirmation email once it is verified.</p>
				</div>
				<p>In case of any issues, the amount will be refunded.</p>
				<p>We appreciate your patience and support!</p>
			</div>
			
			<div class="footer">
				<p>For any queries, contact us at <a href= "mailto:${adminEmail}">${adminEmail}</a>.</p>
			</div>
		</div>
	</body>
	
	</html>`;
};

export { userPendingApproval };
