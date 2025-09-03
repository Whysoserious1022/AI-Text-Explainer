// Popup script for Text Explainer extension
document.addEventListener('DOMContentLoaded', async () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveKeyBtn = document.getElementById('saveKey');
    const testKeyBtn = document.getElementById('testKey');
    const toggleKeyBtn = document.getElementById('toggleKey');
    const statusDiv = document.getElementById('status');

    // Load existing API key
    await loadApiKey();

    // Event listeners
    saveKeyBtn.addEventListener('click', saveApiKey);
    testKeyBtn.addEventListener('click', testApiKey);
    toggleKeyBtn.addEventListener('click', togglePasswordVisibility);
    apiKeyInput.addEventListener('input', clearStatus);
    apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveApiKey();
        }
    });

    async function loadApiKey() {
        try {
            const result = await chrome.storage.sync.get(['geminiApiKey']);
            if (result.geminiApiKey) {
                apiKeyInput.value = result.geminiApiKey;
                showStatus('API key loaded', 'success');
            }
        } catch (error) {
            showStatus('Error loading API key', 'error');
        }
    }

    async function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key', 'error');
            return;
        }

        try {
            await chrome.storage.sync.set({ geminiApiKey: apiKey });
            showStatus('API key saved successfully!', 'success');
        } catch (error) {
            showStatus('Error saving API key', 'error');
        }
    }

    async function testApiKey() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key first', 'error');
            return;
        }

        showStatus('Testing API connection...', 'loading');
        testKeyBtn.disabled = true;

        try {
            // Test with a simple request
            const response = await chrome.runtime.sendMessage({
                action: 'explainText',
                text: 'Hello world',
                testMode: true
            });

            if (response.success) {
                showStatus('API key is valid and working!', 'success');
            } else {
                showStatus(`API test failed: ${response.error}`, 'error');
            }
        } catch (error) {
            showStatus('Error testing API connection', 'error');
        } finally {
            testKeyBtn.disabled = false;
        }
    }

    function togglePasswordVisibility() {
        const type = apiKeyInput.type === 'password' ? 'text' : 'password';
        apiKeyInput.type = type;
        toggleKeyBtn.textContent = type === 'password' ? '👁️' : '🙈';
    }

    function clearStatus() {
        statusDiv.textContent = '';
        statusDiv.className = 'status-message';
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.textContent = '';
                statusDiv.className = 'status-message';
            }, 3000);
        }
    }
});