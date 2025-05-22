const adminOrderNotification = (userName, firstName, lastName, userEmail, totalAmount) => {
  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>New Order Notification</title>
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
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }

    .header {
      background-color: #f5ebdf;
      color: #4b2e1e;
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      border-bottom: 1px solid #e7dccc;
    }

    .body {
      padding: 24px 28px;
      text-align: left;
    }

    .body p {
      margin-bottom: 16px;
    }

    .order-details {
      background-color: #fcf7f0;
      border: 1px solid #e7dccc;
      padding: 16px 20px;
      border-radius: 10px;
      margin: 20px 0;
      font-size: 16px;
    }

    .order-details p {
      margin: 8px 0;
    }

    .footer {
      padding: 16px 24px;
      background-color: #fdf6ef;
      color: #998675;
      font-size: 13px;
      text-align: center;
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
    <div class="header">🍫 New Order Placed</div>
    <div class="body">
      <p>Dear Admin,</p>
      <p>
        A new order has been placed by <strong>${firstName} ${lastName}</strong>
        <br />
        (Username: <strong>${userName}</strong>)<br />
        Email: <a href="mailto:${userEmail}">${userEmail}</a>
      </p>

      <div class="order-details">
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p>Please verify the payment and approve the order manually.</p>
      </div>

      <p>Thank you for managing the orders with care and efficiency!</p>
    </div>
    <div class="footer">
      This is an automated message from <strong>Healthy Bakes & Delights</strong>.<br />
      Please do not reply to this email.
    </div>
  </div>
</body>

</html>`;
};

export { adminOrderNotification };
