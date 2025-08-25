// server.js
const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

// Initialize the Express application
const app = express();

// Use the express.urlencoded middleware to parse incoming webhook requests
app.use(express.urlencoded({ extended: false }));

// Define a route to handle incoming WhatsApp messages
app.post('/whatsapp', (req, res) => {
  console.log('Received message:', req.body.Body);
  
  // Create a TwiML response
  const twiml = new MessagingResponse();

  // Respond to the incoming message
  twiml.message('Hello from your Render-hosted Node.js app! Your app is now working perfectly.');

  // Set the response type and send it
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// Set the port based on the environment variable, or use 3000 for local development
const port = process.env.PORT || 3000;

// Start the server and listen for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
