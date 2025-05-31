const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const { google } = require('googleapis');
const path = require('path');
const router = express.Router();

require('dotenv').config();

const CRYPTOMUS_API_KEY = process.env.CRYPTOMUS_API_KEY;
const CRYPTOMUS_MERCHANT_UUID = process.env.CRYPTOMUS_MERCHANT_UUID;
const SHEET_ID = "1lNXbjBWWyyr3wvclyepBrUujU3OFi0PkjKrzx2CzKw4";
const GOOGLE_CREDENTIALS_PATH = path.join(__dirname, "google-credentials.json");

// -- Google Sheets: Add Row
async function appendOrderToSheet(order) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: GOOGLE_CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const values = [[
      order.order_id,
      order.product_name,
      order.email,
      order.telegram,
      order.amount,
      order.status || "Pending",
      order.payment_id || "",
      new Date().toLocaleString(),
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });
    console.log('Logged new order to Google Sheets.');
  } catch (err) {
    console.error("Failed to log order to Google Sheets:", err.message || err);
    if (err.response && err.response.data) {
      console.error('Full error:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

// -- Google Sheets: Update Status
async function updateOrderStatusInSheet(order_id, newStatus) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: GOOGLE_CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const read = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A2:H",
    });
    const rows = read.data.values || [];
    const idx = rows.findIndex(r => r[0] === order_id);

    if (idx === -1) throw new Error(`Order ID ${order_id} not found in sheet`);
    const sheetRow = idx + 2;
    const statusCol = "F";

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Sheet1!${statusCol}${sheetRow}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [[newStatus]] },
    });
    console.log(`Order ${order_id} updated to status: ${newStatus}`);
  } catch (err) {
    console.error(`Failed to update order ${order_id} in Google Sheets:`, err.message || err);
    if (err.response && err.response.data) {
      console.error('Full error:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

// -- Cryptomus sign
function createSign(body, apiKey) {
  const bodyStr = JSON.stringify(body);
  const base64Body = Buffer.from(bodyStr).toString('base64');
  const md5 = crypto.createHash('md5');
  md5.update(base64Body + apiKey);
  return md5.digest('hex');
}

// -- Create payment
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, currency, order_id, email, telegram, product_name } = req.body;
    const cryptomusBody = {
      amount,
      currency,
      order_id,
      url_return: "http://localhost:5173/payment-success",
      url_callback: "http://localhost:4000/api/payment-webhook",
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

    // Log order to Google Sheets (Pending)
    await appendOrderToSheet({
      order_id,
      product_name,
      email,
      telegram,
      amount,
      status: "Pending",
      payment_id: response.data.result.payment_id || "",
    });

    res.json({ pay_url: response.data.result.url });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

// -- Webhook: update status
router.post('/payment-webhook', async (req, res) => {
  const { order_id, status } = req.body;
  console.log('Webhook received:', req.body);
  try {
    if (status === "paid" || status === "completed") {
      await updateOrderStatusInSheet(order_id, "Paid");
      console.log(`Order ${order_id} marked as Paid in Google Sheets!`);
    } else if (status === "cancel" || status === "fail" || status === "error") {
      await updateOrderStatusInSheet(order_id, "Failed");
      console.log(`Order ${order_id} marked as Failed in Google Sheets.`);
    } else {
      console.log(`Order ${order_id} has unhandled status: ${status}`);
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update order in Google Sheets:", err.message || err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
