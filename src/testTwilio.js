const twilio = require("twilio");
require("dotenv").config();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function sendTestSMS() {
  try {
    const message = await client.messages.create({
      body: "EduSphere Test SMS: Twilio is working!",
      from: process.env.TWILIO_PHONE,
      to: "+918660279860", // your phone number
    });

    console.log("SMS sent:", message.sid);
  } catch (error) {
    console.log("SMS failed:", error.message);
  }
}

sendTestSMS();
