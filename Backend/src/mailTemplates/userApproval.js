const userPendingApproval = (firstName, lastName, totalAmount, adminEmail) => {
	return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Order Pending Approval</title>
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
      background-color: #ffecbc;
      padding: 20px;
      border-radius: 12px 12px 0 0;
      color: #805b36;
      font-size: 22px;
      font-weight: 700;
      border-bottom: 1px solid #f0dca8;
    }

    .body {
      padding: 24px 28px;
      text-align: left;
    }

    .body p {
      margin-bottom: 16px;
    }

    .order-details {
      background-color: #fff8e5;
      color: #5a3d23;
      padding: 16px 20px;
      border-radius: 10px;
      border: 1px dashed #f3e0b3;
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
      For any queries, contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>.
    </div>
  </div>
</body>

</html>`;
};

export { userPendingApproval };
