// Initialize chat history
let chatHistory;

// Listen for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    // Set default API model and empty chat history
    const defaultModel = "gpt-3.5-turbo-1106";
    chrome.storage.local.set({ apiModel: defaultModel, chatHistory: [] });

    // Open the options page
    chrome.runtime.openOptionsPage();
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.userInput) {
        try {
            // Retrieve API key and model from local storage
            const { apiKey, apiModel, chatHistory: storedChatHistory } = await getStorageData(["apiKey", "apiModel", "chatHistory"]);

            chatHistory = storedChatHistory || [
                { role: "system", content: "I'm your helpful chat bot! I provide helpful and concise answers." },
            ];

            // Save user's message to chat history
            chatHistory.push({ role: "user", content: message.userInput });

            let response;
            if (apiModel === "dall-e-3") {
                response = await fetchImage(message.userInput, apiKey, apiModel);
                handleImageResponse(response, sendResponse);
            } else {
                response = await fetchChatCompletion(chatHistory, apiKey, apiModel);
                handleChatResponse(response, sendResponse);
            }
        } catch (error) {
            sendErrorMessage(error.message, sendResponse);
        }
        return true; // Enable async response
    }
    return true; // Enable async response
});

// Handle chat response
function handleChatResponse(response, sendResponse) {
    if (response && response.choices && response.choices.length > 0) {
        const assistantResponse = response.choices[0].message.content;
        chatHistory.push({ role: "assistant", content: assistantResponse });
        chrome.storage.local.set({ chatHistory });
        chrome.runtime.sendMessage({ answer: assistantResponse });
        console.log("Sent response to popup:", assistantResponse);
    }
}

// Handle image response
function handleImageResponse(response, sendResponse) {
    if (response && response.data && response.data.length > 0) {
        const imageUrl = response.data[0].url;
        chatHistory.push({ role: "assistant", content: imageUrl });
        chrome.storage.local.set({ chatHistory });
        chrome.runtime.sendMessage({ imageUrl });
        console.log("Sent image URL to popup:", imageUrl);
    }
}

// Send error message
function sendErrorMessage(errorMessage, sendResponse) {
    chrome.runtime.sendMessage({ error: errorMessage });
    console.error(errorMessage);
}

// Fetch data from the OpenAI Chat Completion API
async function fetchChatCompletion(messages, apiKey, apiModel) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ messages, model: apiModel })
        });

        if (!response.ok) throw new Error(`Failed to fetch. Status code: ${response.status}`);
        return await response.json();
    } catch (error) {
        sendErrorMessage(error.message);
    }
}

// Fetch Image from the OpenAI DALL-E API
async function fetchImage(prompt, apiKey, apiModel) {
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': '// Initialize chat history
let chatHistory;

// Listen for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    // Set default API model and empty chat history
    const defaultModel = "gpt-3.5-turbo-1106";
    chrome.storage.local.set({ apiModel: defaultModel, chatHistory: [] });

    // Open the options page
    chrome.runtime.openOptionsPage();
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.userInput) {
        try {
            // Retrieve API key and model from local storage
            const { apiKey, apiModel, chatHistory: storedChatHistory } = await getStorageData(["apiKey", "apiModel", "chatHistory"]);

            chatHistory = storedChatHistory || [
                { role: "system", content: "I'm your helpful chat bot! I provide helpful and concise answers." },
            ];

            // Save user's message to chat history
            chatHistory.push({ role: "user", content: message.userInput });

            let response;
            if (apiModel === "dall-e-3") {
                response = await fetchImage(message.userInput, apiKey, apiModel);
                handleImageResponse(response, sendResponse);
            } else {
                response = await fetchChatCompletion(chatHistory, apiKey, apiModel);
                handleChatResponse(response, sendResponse);
            }
        } catch (error) {
            sendErrorMessage(error.message, sendResponse);
        }
        return true; // Enable async response
    }
    return true; // Enable async response
});

// Handle chat response
function handleChatResponse(response, sendResponse) {
    if (response && response.choices && response.choices.length > 0) {
        const assistantResponse = response.choices[0].message.content;
        chatHistory.push({ role: "assistant", content: assistantResponse });
        chrome.storage.local.set({ chatHistory });
        chrome.runtime.sendMessage({ answer: assistantResponse });
        console.log("Sent response to popup:", assistantResponse);
    }
}

// Handle image response
function handleImageResponse(response, sendResponse) {
    if (response && response.data && response.data.length > 0) {
        const imageUrl = response.data[0].url;
        chatHistory.push({ role: "assistant", content: imageUrl });
        chrome.storage.local.set({ chatHistory });
        chrome.runtime.sendMessage({ imageUrl });
        console.log("Sent image URL to popup:", imageUrl);
    }
}

// Send error message
function sendErrorMessage(errorMessage, sendResponse) {
    chrome.runtime.sendMessage({ error: errorMessage });
    console.error(errorMessage);
}

// Fetch data from the OpenAI Chat Completion API
async function fetchChatCompletion(messages, apiKey, apiModel) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ messages, model: apiModel })
        });

        if (!response.ok) throw new Error(`Failed to fetch. Status code: ${response.status}`);
        return await response.json();
    } catch (error) {
        sendErrorMessage(error.message);
    }
}

// Fetch Image from the OpenAI DALL-E API
async function fetchImage(prompt, apiKey, apiModel) {
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ prompt, model: apiModel, n: 1, size: "1024x1024" })
        });

        if (!response.ok) throw new Error(`Failed to fetch. Status code: ${response.status}`);
        return await response.json();
    } catch (error) {
        sendErrorMessage(error.message);
    }
}

// Get data from local storage
function getStorageData(keys) {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => resolve(result));
    });
}
