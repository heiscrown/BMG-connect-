// filename: index.js
const express = require('express');
const twilio = require('twilio');

// Security best practice: Use environment variables for credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Ensure credentials are present
if (!accountSid || !authToken) {
  console.error('Error: Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) are not set in environment variables.');
  process.exit(1);
}

const client = twilio(accountSid, authToken);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

// Main health check route
app.get('/', (req, res) => {
  res.send('BMG Connect bot is online and ready for action!');
});

// IMPORTANT: Twilio request validation middleware
// This should be placed *before* your Twilio routes
// It will validate all POST requests to the server
app.post('*', (req, res, next) => {
  // Use the validator as middleware
  const validator = twilio.webhook({
    accountSid: accountSid,
    authToken: authToken
  });
  validator(req, res, next);
});


// Route for incoming WhatsApp messages with logic
app.post('/whatsapp', async (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase().trim();
  const twiml = new twilio.twiml.MessagingResponse();
  let replyMsg;

  if (incomingMsg.includes('hello') || incomingMsg.includes('hi')) {
    replyMsg = 'Hello from your BMG Connect WhatsApp bot! Ask me about our "services".';
  } else if (incomingMsg === 'services') {
    replyMsg = 'We offer: \n1. Custom Chatbots\n2. Web Development\n3. API Integration';
  } else {
    replyMsg = `You sent: "${req.body.Body}". I am a simple bot. Try sending "hello" or "services".`;
  }

  twiml.message(replyMsg);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// Route for incoming SMS messages with logic
app.post('/sms', async (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase().trim();
  const twiml = new twilio.twiml.MessagingResponse();
  let replyMsg;

  if (incomingMsg.includes('hello') || incomingMsg.includes('hi')) {
    replyMsg = 'Hello from your BMG Connect SMS bot! Ask me about our "services".';
  } else if (incomingMsg === 'services') {
    replyMsg = 'We offer: 1. Custom Chatbots, 2. Web Development, 3. API Integration';
  } else {
    replyMsg = `You sent: "${req.body.Body}". I am a simple bot. Try sending "hello" or "services".`;
  }

  twiml.message(replyMsg);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// Optional: Add a simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(port, () => {
  console.log(`Server is listening on por
t ${port}`);
});
