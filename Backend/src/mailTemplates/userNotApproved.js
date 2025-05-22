const userOrderNotApproved = (firstName, lastName, totalAmount, adminEmail) => {
	return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Order Not Approved</title>
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
      background-color: #f8d7da;
      padding: 20px;
      border-radius: 12px 12px 0 0;
      color: #842029;
      font-size: 22px;
      font-weight: 700;
      border-bottom: 1px solid #f5c2c7;
    }

    .body {
      padding: 24px 28px;
      text-align: left;
    }

    .body p {
      margin-bottom: 16px;
    }

    .order-details {
      background-color: #fdeaea;
      color: #842029;
      padding: 16px 20px;
      border-radius: 10px;
      border: 1px dashed #f1b5b5;
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
      color: #842029;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Order Not Approved</div>

    <div class="body">
      <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
      <p>We regret to inform you that your order could not be approved after manual verification.</p>

      <div class="order-details">
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p>The order will not be processed further. If payment has already been made, it will be refunded shortly.</p>
      </div>

      <p>We apologize for the inconvenience. You are welcome to place a new order or contact us for assistance.</p>
    </div>

    <div class="footer">
      For any queries, contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>.
    </div>
  </div>
</body>

</html>`;
};

export { userOrderNotApproved };
