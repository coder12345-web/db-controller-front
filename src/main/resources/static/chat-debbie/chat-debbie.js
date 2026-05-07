// ==================== DEBBIE CHAT LOGIC ====================

const DEBBIE_API = 'http://localhost:8080/api/v1/chat';
const MAX_MESSAGES = 50;

let debbieMessages = [];
let currentSlide = 0;
let isDebbieResponding = false;
let currentEventSource = null;

// ==================== INITIALIZATION ====================

function initDebbie() {
    const hasSeenOnboarding = sessionStorage.getItem('debbieOnboardingSeen');

    // Show button initially
    document.getElementById('debbieButton').classList.remove('hidden');

    console.log('✅ Debbie initialized');
}

// ==================== OPEN/CLOSE DEBBIE ====================

function openDebbie() {
    const hasSeenOnboarding = sessionStorage.getItem('debbieOnboardingSeen');

    if (!hasSeenOnboarding) {
        // Show onboarding
        document.getElementById('debbieOnboarding').classList.add('active');
    } else {
        // Open chat directly
        showDebbieChat();
    }
}

function showDebbieChat() {
    // Hide button
    document.getElementById('debbieButton').classList.add('hidden');

    // Show chat
    document.getElementById('debbieChat').classList.add('open');

    // Focus input
    setTimeout(() => {
        document.getElementById('debbieInput').focus();
    }, 300);
}

function closeDebbie() {
    // Hide chat
    document.getElementById('debbieChat').classList.remove('open');

    // Show button
    document.getElementById('debbieButton').classList.remove('hidden');
}

// ==================== ONBOARDING ====================

function nextSlide() {
    const slides = document.querySelectorAll('.debbie-slide');
    const dots = document.querySelectorAll('.debbie-dot');
    const btn = document.getElementById('debbieOnboardingBtn');

    if (currentSlide < slides.length - 1) {
        // Next slide
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide++;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Change button text on last slide
        if (currentSlide === slides.length - 1) {
            btn.textContent = "Let's Chat!";
        }
    } else {
        // Finish onboarding
        finishOnboarding();
    }
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.debbie-slide');
    const dots = document.querySelectorAll('.debbie-dot');
    const btn = document.getElementById('debbieOnboardingBtn');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    btn.textContent = currentSlide === slides.length - 1 ? "Let's Chat!" : "Next";
}

function skipOnboarding() {
    finishOnboarding();
}

function finishOnboarding() {
    // Mark as seen
    sessionStorage.setItem('debbieOnboardingSeen', 'true');

    // Hide onboarding
    document.getElementById('debbieOnboarding').classList.remove('active');

    // Reset for next time
    currentSlide = 0;
    const slides = document.querySelectorAll('.debbie-slide');
    const dots = document.querySelectorAll('.debbie-dot');
    slides.forEach((s, i) => {
        s.classList.toggle('active', i === 0);
    });
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === 0);
    });
    document.getElementById('debbieOnboardingBtn').textContent = 'Next';

    // Show chat
    showDebbieChat();
}

// ==================== CHAT SIZE ====================

function toggleDebbieSize() {
    const chat = document.getElementById('debbieChat');
    const currentSize = chat.getAttribute('data-size');

    // Cycle: small → medium → large → small
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizes.length;

    chat.setAttribute('data-size', sizes[nextIndex]);
}

// ==================== MESSAGES ====================

function addMessage(content, isUser = false) {
    const message = {
        content,
        isUser,
        timestamp: new Date().toISOString()
    };

    debbieMessages.push(message);

    // Limit messages to MAX_MESSAGES
    if (debbieMessages.length > MAX_MESSAGES) {
        debbieMessages.shift();
        // Remove first message from DOM
        const messagesContainer = document.getElementById('debbieMessages');
        const firstMessage = messagesContainer.querySelector('.debbie-message');
        if (firstMessage) {
            firstMessage.remove();
        }
    }

    renderMessage(message);
    scrollToBottom();
}

function renderMessage(message) {
    const messagesContainer = document.getElementById('debbieMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `debbie-message ${message.isUser ? 'user' : 'ai'}`;

    const avatarSvg = message.isUser
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
             <circle cx="12" cy="7" r="4"></circle>
           </svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <circle cx="12" cy="12" r="10"></circle>
             <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
             <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
             <path d="M8 15 Q12 17 16 15"></path>
           </svg>`;

    messageDiv.innerHTML = `
        <div class="debbie-message-avatar">${avatarSvg}</div>
        <div class="debbie-message-content">${escapeHtml(message.content)}</div>
    `;

    messagesContainer.appendChild(messageDiv);
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('debbieMessages');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'debbie-message ai';
    typingDiv.id = 'debbieTyping';

    typingDiv.innerHTML = `
        <div class="debbie-message-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
                <path d="M8 15 Q12 17 16 15"></path>
            </svg>
        </div>
        <div class="debbie-message-content">
            <div class="debbie-typing">
                <div class="debbie-typing-dot"></div>
                <div class="debbie-typing-dot"></div>
                <div class="debbie-typing-dot"></div>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typing = document.getElementById('debbieTyping');
    if (typing) {
        typing.remove();
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('debbieMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ==================== SEND MESSAGE ====================

async function sendDebbieMessage() {
    const input = document.getElementById('debbieInput');
    const message = input.value.trim();

    if (!message || isDebbieResponding) {
        return;
    }

    // Add user message
    addMessage(message, true);

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Disable send button
    isDebbieResponding = true;
    document.getElementById('debbieSendBtn').disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        // Get auth token
        const token = await ensureValidToken();

        // Make POST request to start SSE stream
        const response = await fetch(DEBBIE_API, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', response.status, errorText);
            throw new Error(`Server returned ${response.status}: ${errorText || 'Unknown error'}`);
        }

        // Hide typing indicator
        hideTypingIndicator();

        // Read SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';

        // Create AI message container
        const messagesContainer = document.getElementById('debbieMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'debbie-message ai';
        messageDiv.id = 'debbieStreaming';

        messageDiv.innerHTML = `
            <div class="debbie-message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                    <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
                    <path d="M8 15 Q12 17 16 15"></path>
                </svg>
            </div>
            <div class="debbie-message-content"></div>
        `;

        messagesContainer.appendChild(messageDiv);
        const contentDiv = messageDiv.querySelector('.debbie-message-content');

        // Read stream with error handling
        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                aiResponse += chunk;

                // Update content
                contentDiv.textContent = aiResponse;
                scrollToBottom();
            }
        } catch (streamError) {
            console.error('Stream reading error:', streamError);
            // If we got partial response, keep it; otherwise show error
            if (!aiResponse) {
                aiResponse = 'Sorry, the connection was interrupted. Please try again.';
                contentDiv.textContent = aiResponse;
            }
        }

        // Remove streaming indicator
        messageDiv.removeAttribute('id');

        // Store message only if we have content
        if (aiResponse) {
            debbieMessages.push({
                content: aiResponse,
                isUser: false,
                timestamp: new Date().toISOString()
            });

            // Limit messages
            if (debbieMessages.length > MAX_MESSAGES) {
                debbieMessages.shift();
                const firstMessage = messagesContainer.querySelector('.debbie-message');
                if (firstMessage) {
                    firstMessage.remove();
                }
            }
        }

    } catch (error) {
        console.error('Debbie error:', error);
        hideTypingIndicator();

        // Remove any partial streaming message
        const streamingMsg = document.getElementById('debbieStreaming');
        if (streamingMsg) {
            streamingMsg.remove();
        }

        addMessage('Sorry, I encountered an error. Please try again. If the problem persists, check your connection and authentication.', false);

        // Show more specific error message
        if (error.message.includes('401') || error.message.includes('403')) {
            showToast('Authentication error - please refresh the page', 'error');
        } else if (error.message.includes('network')) {
            showToast('Network error - check your connection', 'error');
        } else {
            showToast('Failed to get response from Debbie', 'error');
        }
    } finally {
        // Re-enable send button
        isDebbieResponding = false;
        document.getElementById('debbieSendBtn').disabled = false;
        input.focus();
    }
}

function handleDebbieKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendDebbieMessage();
    }
}

// ==================== UTILITY ====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('debbieInput');
    if (input) {
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
});

// ==================== EXPORTS ====================

window.initDebbie = initDebbie;
window.openDebbie = openDebbie;
window.closeDebbie = closeDebbie;
window.toggleDebbieSize = toggleDebbieSize;
window.sendDebbieMessage = sendDebbieMessage;
window.handleDebbieKeydown = handleDebbieKeydown;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;
window.skipOnboarding = skipOnboarding;

// Initialize on load
document.addEventListener('DOMContentLoaded', initDebbie);

console.log('✅ Debbie chat loaded successfully');