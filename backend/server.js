const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const CRYPTOMUS_API_KEY = process.env.CRYPTOMUS_API_KEY;
const CRYPTOMUS_MERCHANT_UUID = process.env.CRYPTOMUS_MERCHANT_UUID; // Merchant UUID

function createSign(body, apiKey) {
  const bodyStr = JSON.stringify(body);
  const base64Body = Buffer.from(bodyStr).toString('base64');
  const md5 = crypto.createHash('md5');
  md5.update(base64Body + apiKey);
  return md5.digest('hex');
}

app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, currency, order_id, email, telegram, product_name } = req.body;
    const cryptomusBody = {
      amount,
      currency,
      order_id,
      url_return: "http://localhost:5173/payment-success", // Change in prod
      url_callback: "",
      to_email: email,
      comment: `Order for ${product_name} | Telegram: ${telegram}`,
    };
    const sign = createSign(cryptomusBody, CRYPTOMUS_API_KEY);

    const response = await axios.post(
      'https://api.cryptomus.com/v1/payment',
      cryptomusBody,
      {
        headers: {
          merchant: CRYPTOMUS_MERCHANT_UUID,
          sign: sign,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ pay_url: response.data.result.url });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
