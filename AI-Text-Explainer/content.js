// content.js (Final Corrected Version)
'use strict';

let explainButton = null;

// --- BUTTON LOGIC (Corrected) ---

function initializeExplainButton() {
    if (explainButton) return;
    explainButton = document.createElement('div');
    explainButton.className = 'text-explainer-button';
    explainButton.innerHTML = '🔍 Explain';
    explainButton.title = 'Click to explain selected text';
    explainButton.style.display = 'none';
    explainButton.style.position = 'absolute';
    explainButton.style.zIndex = '999999';
    document.body.appendChild(explainButton);

    explainButton.addEventListener('mousedown', (e) => e.stopPropagation());
    explainButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            triggerExplanation(selectedText);
        }
        hideExplainButton();
    });
}

function showExplainButton(range) {
    const rect = range.getBoundingClientRect();
    if (!explainButton) initializeExplainButton();
    explainButton.style.display = 'block';
    const buttonTop = rect.bottom + window.scrollY + 5;
    const buttonLeft = rect.left + window.scrollX + (rect.width / 2) - (explainButton.offsetWidth / 2);
    explainButton.style.top = `${buttonTop}px`;
    explainButton.style.left = `${buttonLeft}px`;
}

function hideExplainButton() {
    if (explainButton) {
        explainButton.style.display = 'none';
    }
}

function handleMouseUp() {
    setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0 && selectedText.length <= 5000) {
            showExplainButton(selection.getRangeAt(0));
        } else {
            hideExplainButton();
        }
    }, 10);
}

function handleMouseDown(event) {
    if (explainButton && event.target !== explainButton) {
        hideExplainButton();
    }
}

// --- API COMMUNICATION LOGIC ---

async function triggerExplanation(text) {
    showLoadingModal();
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'explainText',
            text: text
        });
        if (response.success) {
            // This now correctly calls your function to show the explanation
            showExplanationModal(response.explanation, response.originalText);
        } else {
            showError(response.error || 'Failed to get explanation');
        }
    } catch (error) {
        console.error('Content script error:', error);
        showError('Extension error. Please try again.');
    }
}

// --- MODAL LOGIC (Your Original Code) ---

let modal = null;

function showLoadingModal() {
    createModal();
    const content = `
        <div class="modal-header"><h3>🤔 Thinking...</h3><button class="modal-close">&times;</button></div>
        <div class="modal-body"><div class="loading-spinner"></div><p>Getting explanation from Gemini AI...</p></div>`;
    modal.innerHTML = content;
    addModalEventListeners();
}

function showExplanationModal(explanation, originalText) {
    createModal();
    const truncatedText = originalText.length > 100 ? originalText.substring(0, 100) + '...' : originalText;
    const content = `
        <div class="modal-header"><h3>💡 Text Explanation</h3><button class="modal-close">&times;</button></div>
        <div class="modal-body">
            <div class="original-text"><h4>Selected Text:</h4><p>"${escapeHtml(truncatedText)}"</p></div>
            <div class="explanation"><h4>Explanation:</h4><div class="explanation-content">${formatExplanation(explanation)}</div></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary modal-close-btn">Close</button></div>`;
    modal.innerHTML = content;
    addModalEventListeners();
}

function showError(errorMessage) {
    createModal();
    const content = `
        <div class="modal-header"><h3>❌ Error</h3><button class="modal-close">&times;</button></div>
        <div class="modal-body">
            <p class="error-message">${escapeHtml(errorMessage)}</p>
            <p>Please check your API key configuration in the extension popup.</p>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary modal-close-btn">Close</button></div>`;
    modal.innerHTML = content;
    addModalEventListeners();
}

function createModal() {
    removeModal();
    const overlay = document.createElement('div');
    overlay.className = 'text-explainer-modal-overlay';
    modal = document.createElement('div');
    modal.className = 'text-explainer-modal';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function removeModal() {
    const overlay = document.querySelector('.text-explainer-modal-overlay');
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }
    document.body.style.overflow = '';
    modal = null;
}

function addModalEventListeners() {
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(btn => btn.addEventListener('click', removeModal));
    const overlay = document.querySelector('.text-explainer-modal-overlay');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) removeModal();
    });
}

function handleKeyDown(event) {
    if (event.key === 'Escape') {
        if (modal) removeModal();
        else hideExplainButton();
    }
}

function formatExplanation(text) {
    return escapeHtml(text).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^(.*)$/, '<p>$1</p>');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- INITIALIZE ALL LISTENERS ---

document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('keydown', handleKeyDown);

window.addEventListener('beforeunload', () => {
    hideExplainButton();
    removeModal();
});