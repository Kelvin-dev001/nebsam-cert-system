const axios = require('axios');

// The two fixed phone numbers (format: 2547XXXXXXXX)
const OTP_NUMBERS = ['254759293030'];

// Onfon API credentials from .env
const ONFON_API_URL = process.env.ONFON_API_URL || 'https://api.onfonmedia.co.ke/v1/sms/SendBulkSMS';
const ONFON_APIKEY = process.env.ONFON_APIKEY;
const ONFON_CLIENTID = process.env.ONFON_CLIENTID;
const ONFON_ACCESSKEY = process.env.ONFON_ACCESSKEY; // Same as ClientID
const ONFON_SENDERID = process.env.ONFON_SENDERID || 'Nebsam-Tech';

/**
 * Sends OTP SMS to both admin numbers using Onfon API.
 * Returns true if SMS sent successfully, otherwise false.
 */
async function sendOtpSms(otp) {
  const message = `Your certificate system OTP is: ${otp}`;
  const messageParams = OTP_NUMBERS.map(number => ({
    Number: number,
    Text: message
  }));

  const data = {
    SenderId: ONFON_SENDERID,
    MessageParameters: messageParams,
    ApiKey: ONFON_APIKEY,
    ClientId: ONFON_CLIENTID
  };

  try {
    const response = await axios.post(
      ONFON_API_URL,
      data,
      {
        headers: {
          'Accesskey': ONFON_ACCESSKEY,
          'Content-Type': 'application/json'
        }
      }
    );

    // Debug: print response from Onfon API
    console.log('Onfon SMS API response:', response.data);

    // Success if ErrorCode is 0 and all MessageErrorCode are 0
    const resData = response.data;
    if (
      resData.ErrorCode === 0 &&
      Array.isArray(resData.Data) &&
      resData.Data.every(msg => msg.MessageErrorCode === 0)
    ) {
      return true;
    } else {
      console.error('Onfon SMS error:', response.data);
      return false;
    }
  } catch (error) {
    console.error('SMS sending error:', error.response ? error.response.data : error.message);
    return false;
  }
}

module.exports = { sendOtpSms };