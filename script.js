it connected. s client.");
            ws.send(JSON.stringify({ type: 'register', userId: userId }));
        };

        ws.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
ß            if (messageData.type === àaaaaaa'sms') {
                displayMessage(messageData.text);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected. Attempting to reconnect...");
            setTimeout(connectToServer, 5000); // Reconnect after 5 seconds
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    // --- User Interface and Event Handlers ---
    countryCards.forEach(card => {
        card.addEventListener("click", () => {
            const selectedCountry = card.dataset.country;
            // In a real app, you would send this to the backend to get a number.
            // For now, we'll just show the display.
            
            // Your backend call would go here:
            // fetch('/api/get-number', { method: 'POST', body: JSON.stringify({ userId, country: selectedCountry }) })
            //     .then(response => response.json())
            //     .then(data => {
            //         numberDisplay.textContent = data.phoneNumber;
            //         numberSelectionSection.classList.add('hidden');
            //         verificationDisplaySection.classList.remove('hidden');
            //     });

            // For now, we just show the UI
            numberDisplay.textContent = `Getting a number for ${selectedCountry.toUpperCase()}...`;
            setTimeout(() => {
                numberDisplay.textContent = `+1 (555) 555-5555`; // Placeholder number
            }, 2000);

            numberSelectionSection.classList.add('hidden');
            verificationDisplaySection.classList.remove('hidden');
        });
    });

    copyButton.addEventListener("click", () => {
        const numberToCopy = numberDisplay.textContent;
        navigator.clipboard.writeText(numberToCopy).then(() => {
            alert("Number copied to clipboard!");
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });

    function displayMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.className = "message incoming-message";
        messageElement.innerHTML = `<p>${message}</p>`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Start the WebSocket connection when the page loads
    connectToServer();
});
