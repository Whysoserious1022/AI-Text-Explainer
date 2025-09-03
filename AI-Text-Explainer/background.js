// Background service worker for Text Explainer extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'explainText') {
        handleExplainText(request, sendResponse);
        return true; // Keep the message channel open for async response
    }
});

async function handleExplainText(request, sendResponse) {
    try {
        // Get API key from storage
        const result = await chrome.storage.sync.get(['geminiApiKey']);
        const apiKey = result.geminiApiKey;

        if (!apiKey) {
            sendResponse({
                success: false,
                error: 'No API key found. Please configure your Gemini API key in the extension popup.'
            });
            return;
        }

        // Prepare the text for explanation
        const textToExplain = request.text.trim();
        
        if (!textToExplain) {
            sendResponse({
                success: false,
                error: 'No text provided for explanation.'
            });
            return;
        }

        // Create the prompt for Gemini
        const prompt = request.testMode 
            ? "Respond with 'API connection successful' to confirm the connection is working."
            : `Please provide a clear, concise explanation of the following text. Focus on the key concepts, context, and meaning. Keep the explanation accessible and informative:\n\n"${textToExplain}"`;

        // Prepare the request body for Gemini API
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        // Make the API call to Gemini
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            let errorMessage = 'API request failed';
            
            if (response.status === 401) {
                errorMessage = 'Invalid API key. Please check your Gemini API key.';
            } else if (response.status === 429) {
                errorMessage = 'API rate limit exceeded. Please try again later.';
            } else if (response.status === 400) {
                errorMessage = 'Invalid request. Please try selecting different text.';
            } else if (errorData.error?.message) {
                errorMessage = errorData.error.message;
            }

            sendResponse({
                success: false,
                error: errorMessage
            });
            return;
        }

        const data = await response.json();
        
        // Extract the generated text from the response
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const explanation = data.candidates[0].content.parts[0].text;
            
            sendResponse({
                success: true,
                explanation: explanation,
                originalText: textToExplain
            });
        } else {
            sendResponse({
                success: false,
                error: 'Unexpected response format from API. Please try again.'
            });
        }

    } catch (error) {
        console.error('Background script error:', error);
        
        let errorMessage = 'An unexpected error occurred';
        
        if (error.message.includes('fetch')) {
            errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('JSON')) {
            errorMessage = 'Error processing API response. Please try again.';
        }
        
        sendResponse({
            success: false,
            error: errorMessage
        });
    }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Text Explainer extension installed');
        // Open the options page or show welcome message
        chrome.action.openPopup();
    }
});