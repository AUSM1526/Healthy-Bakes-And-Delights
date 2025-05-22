const userOrderApproved = (firstName, lastName, totalAmount, adminEmail) => {
	return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Order Confirmation</title>
  <style>
    body {
      background-color: #fdf9f3;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #3c2a1e;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      text-align: center;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }

    .header {
      background-color: #c9f4c2;
      padding: 20px;
      border-radius: 12px 12px 0 0;
      color: #2e6c3e;
      font-size: 22px;
      font-weight: 700;
      border-bottom: 1px solid #b3e9aa;
    }

    .body {
      padding: 24px 28px;
      text-align: left;
    }

    .body p {
      margin-bottom: 16px;
    }

    .order-details {
      background-color: #e6f7e4;
      color: #2e5e3a;
      padding: 16px 20px;
      border-radius: 10px;
      border: 1px dashed #b8dfb0;
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
      color: #2e6c3e;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
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

      <p>Thank you for shopping with us. We hope you enjoy your treats!</p>
    </div>

    <div class="footer">
      For any queries, contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>.
    </div>
  </div>
</body>

</html>`;
};

export { userOrderApproved };
