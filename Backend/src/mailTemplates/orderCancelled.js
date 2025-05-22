const orderCancelled = (userName, firstName, lastName, userEmail, totalAmount) => {
	return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Order Cancellation Notification</title>
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
      background-color: #f3d6d6;
      padding: 20px;
      border-radius: 12px 12px 0 0;
      color: #802121;
      font-size: 22px;
      font-weight: 700;
      border-bottom: 1px solid #e5c2c2;
    }

    .body {
      padding: 24px 28px;
      text-align: left;
    }

    .body p {
      margin-bottom: 16px;
    }

    .order-details {
      background-color: #fdf1f1;
      color: #802121;
      padding: 15px 20px;
      border-radius: 10px;
      border: 1px dashed #e5c2c2;
      margin: 24px 0;
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
    <div class="header">Order Cancelled - Healthy Bakes & Delights</div>

    <div class="body">
      <p>Dear Admin,</p>
      <p>An order has been cancelled by <strong>${firstName} ${lastName} (userName: ${userName})</strong> (<a href="mailto:${userEmail}">${userEmail}</a>).</p>

      <div class="order-details">
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p>Please review the cancellation and process the refund if applicable.</p>
      </div>

      <p>Thank you for managing the orders with care and attention.</p>
    </div>

    <div class="footer">
      This is an automated message. Please do not reply to this email.
    </div>
  </div>
</body>

</html>`;
};

export { orderCancelled };
