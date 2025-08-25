// A complete backend server for a top-notch SMS verification app.
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// A map to store active WebSocket connections by user ID.
const clients = new Map();

// A map to store which phone number belongs to which user.
// In a real app, this would be a database.
const numberToUserMap = new Map();

// Middleware to parse webhook data
app.use(bodyParser.urlencoded({ extended: false }));

// --- WebSocket Connection & User Management ---
wss.on('connection', (ws) => {
    console.log('A new client connected.');

    // When the client sends their unique ID, store the connection.
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'register') {
                const userId = data.userId;
                clients.set(userId, ws);
                console.log(`Client registered with ID: ${userId}`);
            }
        } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
        }
    });

    // Handle client disconnections
    ws.on('close', () => {
        // Find and remove the client from our map
        for (let [userId, clientWs] of clients.entries()) {
            if (clientWs === ws) {
                clients.delete(userId);
                console.log(`Client with ID ${userId} disconnected.`);
                break;
            }
        }
    });
});

// --- Webhook Endpoint for Incoming SMS ---
// You will point your SMS provider's webhook URL to this endpoint.
app.post('/incoming-sms', (req, res) => {
    res.status(200).send('<Response/>'); // Acknowledge the webhook

    const fromNumber = req.body.From; // The number the SMS came from
    const incomingMessageText = req.body.Body; // The message content
    const toNumber = req.body.To; // Your virtual phone number that received the SMS

    console.log('Received SMS:', incomingMessageText, 'from:', fromNumber, 'to:', toNumber);

    // This is the core logic. Look up the user ID associated with the phone number.
    // In a real app, you would query your database here.
    const userId = numberToUserMap.get(toNumber);

    if (userId && clients.has(userId)) {
        const clientWs = clients.get(userId);
        const message = { type: 'sms', text: incomingMessageText };
        clientWs.send(JSON.stringify(message));
        console.log(`SMS routed successfully to user: ${userId}`);
    } else {
        console.log('No active user session found for this number.');
    }
});

// --- API Endpoint to get a new number (for your front-end) ---
// Your front-end will call this endpoint to request a number for a country.
app.post('/api/get-number', (req, res) => {
    // In a real app, you would use a library like the Twilio API here.
    // e.g., twilio.api.numbers.purchase(...)
    
    // For now, we'll just simulate getting a number and mapping it.
    const userId = req.body.userId;
    const country = req.body.country;
    const assignedNumber = "+1234567890"; // This would be a real number from your provider
    
    // Assign the number to the user's ID
    numberToUserMap.set(assignedNumber, userId);
    
    res.json({ phoneNumber: assignedNumber });
    console.log(`Assigned number ${assignedNumber} to user ${userId} for country ${country}.`);
});

// Serve your front-end HTML file.
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

