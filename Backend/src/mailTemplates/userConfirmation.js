const userOrderApproved = (firstName, lastName, totalAmount, adminEmail) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Order Confirmation</title>
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
				background-color: #28a745;
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
			<div class="header">Order Confirmed</div>
			
			<div class="body">
				<p>Dear <strong>${firstName} ${lastName}</strong>,</p>
				<p>We are excited to inform you that your order has been successfully approved and confirmed!</p>
				
				<div class="order-details">
					<p><strong>Total Amount:</strong> ₹${totalAmount}</p>
					<p>Your order is now being processed and will be shipped soon.</p>
				</div>
				
				<p>Thank you for shopping with us!</p>
			</div>
			
			<div class="footer">
				<p>For any queries, contact us at <a href= "mailto:${adminEmail}">${adminEmail}</a>.</p>
			</div>
		</div>
	</body>
	
	</html>`;
};

export { userOrderApproved };
