const userOrderNotApproved = (firstName, lastName, totalAmount, adminEmail) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Order Not Approved</title>
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
			<div class="header">Order Not Approved</div>
			
			<div class="body">
				<p>Dear <strong>${firstName} ${lastName}</strong>,</p>
				<p>We regret to inform you that your order has not been approved after manual verification.</p>
				
				<div class="order-details">
					<p><strong>Total Amount:</strong> ₹${totalAmount}</p>
					<p>Your order will not be processed further. The amount, if deducted, will be refunded shortly.</p>
				</div>
				
				<p>We apologize for any inconvenience caused. Feel free to place a new order or reach out for support.</p>
			</div>
			
			<div class="footer">
				<p>For any queries, contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>.</p>
			</div>
		</div>
	</body>
	
	</html>`;
};

export { userOrderNotApproved };
