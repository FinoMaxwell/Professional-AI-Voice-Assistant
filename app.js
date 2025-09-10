// Enhanced Professional Voice Virtual Assistant
class ProfessionalVoiceAssistant {
    constructor() {
        this.isListening = false;
        this.isSpeaking = false;
        this.isProcessing = false;
        this.recognition = null;
        this.currentAudio = null;
        this.conversationHistory = [];
        this.settings = {
            voiceId: '21m00Tcm4TlvDq8ikWAM',
            speechSpeed: 1.0,
            volume: 0.8,
            apiKey: '',
            continuousListening: false
        };

        // Professional responses
        this.responses = {
            greeting: [
                "Hello! I'm your professional AI voice assistant. How may I assist you today?",
                "Welcome! I'm here to help with whatever you need. What's on your mind?",
                "Good to hear from you! I'm ready to assist. What would you like to know?",
                "Greetings! Your AI assistant is online and ready to help. How can I support you?"
            ],
            time: [
                "The current time is [TIME]. Is there anything else I can help you with?",
                "It's [TIME] right now. What else would you like to know?",
                "The time is currently [TIME]. How else may I assist you?",
                "According to my system clock, it's [TIME]. What other information do you need?"
            ],
            weather: [
                "I'd be happy to help with weather information. For the most accurate forecast, I recommend checking your preferred weather service or app.",
                "While I don't have access to real-time weather data, I suggest using a dedicated weather application for current conditions and forecasts.",
                "For up-to-date weather information, please check your local weather service, as I don't currently have access to meteorological data."
            ],
            calculation: [
                "Let me calculate that for you... The result is [RESULT].",
                "I've processed the calculation, and the answer is [RESULT].",
                "After computing the values, the result equals [RESULT].",
                "The mathematical result of your query is [RESULT]."
            ],
            joke: [
                "Why don't scientists trust atoms? Because they make up everything!",
                "I told my computer a joke about UDP, but it didn't get it.",
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
                "Why don't eggs tell jokes? They'd crack each other up!",
                "What do you call a fake noodle? An impasta!"
            ],
            help: [
                "I can help you with various tasks! Try asking me about the time, simple calculations, tell you jokes, or just have a friendly conversation. You can also use the quick action buttons for easy access to common requests.",
                "I'm here to assist with time queries, basic math problems, jokes, and general conversation. Feel free to use voice commands or click the quick action buttons above.",
                "My capabilities include providing the current time, performing calculations, sharing jokes, and engaging in conversation. Use either voice input or the convenient quick actions."
            ],
            fallback: [
                "That's an interesting question! While I don't have specific information about that topic, I'm here to help with general questions, calculations, time queries, or we can simply have a conversation.",
                "I don't have detailed information on that particular subject, but I can assist with time queries, math problems, jokes, or general discussion. What else would you like to explore?",
                "I'm not equipped with information on that specific topic, but I excel at helping with calculations, time queries, jokes, and casual conversation. How else can I assist you?"
            ]
        };

        // Ensure DOM is loaded before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Professional Voice Assistant...');
        this.loadSettings();
        this.initializeElements();
        this.initializeSpeechRecognition();
        this.bindEvents();
        this.showWelcomeScreen();
        this.setupAnimations();
        console.log('Professional Voice Assistant initialized successfully');
    }

    initializeElements() {
        console.log('Initializing elements...');
        
        // Main interface elements
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.mainInterface = document.getElementById('main-interface');
        this.startButton = document.getElementById('start-button');
        this.microphoneButton = document.getElementById('microphone-button');
        this.conversationArea = document.getElementById('conversation-area');
        this.speechDisplay = document.getElementById('speech-display');
        this.speechText = document.getElementById('speech-text');
        this.statusIndicator = document.getElementById('status-indicator');
        this.micInstructions = document.getElementById('mic-instructions');

        // Settings elements
        this.settingsModal = document.getElementById('settings-modal');
        this.settingsBtn = document.getElementById('settings-btn');
        this.closeSettings = document.getElementById('close-settings');
        this.voiceSelect = document.getElementById('voice-select');
        this.speechSpeed = document.getElementById('speech-speed');
        this.volumeControl = document.getElementById('volume-control');
        this.apiKeyInput = document.getElementById('api-key');
        this.continuousListening = document.getElementById('continuous-listening');
        this.testVoiceBtn = document.getElementById('test-voice');
        this.saveSettingsBtn = document.getElementById('save-settings');

        // Other elements
        this.clearChatBtn = document.getElementById('clear-chat');
        this.errorToast = document.getElementById('error-toast');
        this.errorMessage = document.getElementById('error-message');
        this.toastIcon = document.getElementById('toast-icon');
        this.quickActionBtns = document.querySelectorAll('.quick-action-btn');

        console.log('Elements found:', {
            welcomeScreen: !!this.welcomeScreen,
            mainInterface: !!this.mainInterface,
            startButton: !!this.startButton,
            settingsModal: !!this.settingsModal,
            quickActionBtns: this.quickActionBtns.length
        });
    }

    setupAnimations() {
        // Add entrance animations
        if (this.welcomeScreen) {
            this.welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                this.welcomeScreen.style.transition = 'opacity 0.5s ease-in-out';
                this.welcomeScreen.style.opacity = '1';
            }, 100);
        }
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                console.log('Speech recognition started');
                this.isListening = true;
                this.updateStatus('Listening...', 'listening');
                this.showSpeechDisplay();
                this.activateMicrophone();
            };

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (this.speechText) {
                    this.speechText.textContent = finalTranscript || interimTranscript || 'Listening...';
                }

                if (finalTranscript) {
                    this.handleUserInput(finalTranscript.trim());
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
                this.handleSpeechError(event.error);
            };

            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                this.stopListening();
            };

            console.log('Speech recognition initialized');
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.showError('Speech recognition is not supported in your browser. Please try using Chrome or Safari.');
        }
    }

    bindEvents() {
        console.log('Binding events...');

        // Start button
        if (this.startButton) {
            console.log('Binding start button event');
            this.startButton.addEventListener('click', (e) => {
                console.log('Start button clicked!');
                e.preventDefault();
                this.showMainInterface();
            });
        } else {
            console.error('Start button not found!');
        }

        // Microphone button
        if (this.microphoneButton) {
            console.log('Binding microphone button event');
            this.microphoneButton.addEventListener('click', (e) => {
                console.log('Microphone button clicked!');
                e.preventDefault();
                this.toggleListening();
            });
        } else {
            console.error('Microphone button not found!');
        }

        // Quick action buttons
        console.log('Binding quick action buttons, found:', this.quickActionBtns.length);
        this.quickActionBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                console.log('Quick action button clicked:', index);
                e.preventDefault();
                const text = btn.getAttribute('data-text');
                if (text) {
                    console.log('Processing text:', text);
                    this.handleUserInput(text);
                } else {
                    console.warn('No data-text attribute found');
                }
            });
        });

        // Settings button
        if (this.settingsBtn) {
            console.log('Binding settings button event');
            this.settingsBtn.addEventListener('click', (e) => {
                console.log('Settings button clicked!');
                e.preventDefault();
                this.showSettings();
            });
        } else {
            console.error('Settings button not found!');
        }

        // Settings close button
        if (this.closeSettings) {
            console.log('Binding close settings event');
            this.closeSettings.addEventListener('click', (e) => {
                console.log('Close settings clicked!');
                e.preventDefault();
                this.hideSettings();
            });
        } else {
            console.error('Close settings button not found!');
        }

        // Settings backdrop
        if (this.settingsModal) {
            const backdrop = this.settingsModal.querySelector('.settings-backdrop');
            if (backdrop) {
                console.log('Binding settings backdrop event');
                backdrop.addEventListener('click', () => {
                    console.log('Settings backdrop clicked!');
                    this.hideSettings();
                });
            }
        }

        // Settings controls
        if (this.speechSpeed) {
            this.speechSpeed.addEventListener('input', () => {
                const speedValue = document.getElementById('speed-value');
                if (speedValue) {
                    speedValue.textContent = `${this.speechSpeed.value}x`;
                }
            });
        }

        if (this.volumeControl) {
            this.volumeControl.addEventListener('input', () => {
                const volumeValue = document.getElementById('volume-value');
                if (volumeValue) {
                    volumeValue.textContent = `${Math.round(this.volumeControl.value * 100)}%`;
                }
            });
        }

        if (this.testVoiceBtn) {
            this.testVoiceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.testVoice();
            });
        }

        if (this.saveSettingsBtn) {
            this.saveSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveSettings();
                this.hideSettings();
            });
        }

        // Clear chat button
        if (this.clearChatBtn) {
            this.clearChatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearConversation();
            });
        }

        // Toast close
        const toastClose = document.querySelector('.toast-close');
        if (toastClose) {
            toastClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.settingsModal && !this.settingsModal.classList.contains('hidden')) {
                    this.hideSettings();
                }
            }
            if (e.key === ' ' && e.ctrlKey) {
                e.preventDefault();
                this.toggleListening();
            }
        });

        console.log('Events binding completed');
    }

    showWelcomeScreen() {
        console.log('Showing welcome screen');
        if (this.welcomeScreen) {
            this.welcomeScreen.classList.remove('hidden');
            this.welcomeScreen.style.display = 'flex';
        }
        if (this.mainInterface) {
            this.mainInterface.classList.add('hidden');
            this.mainInterface.style.display = 'none';
        }
    }

    showMainInterface() {
        console.log('Transitioning to main interface...');
        
        if (this.welcomeScreen) {
            this.welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                this.welcomeScreen.classList.add('hidden');
                this.welcomeScreen.style.display = 'none';
                
                if (this.mainInterface) {
                    this.mainInterface.classList.remove('hidden');
                    this.mainInterface.style.display = 'flex';
                    this.mainInterface.style.opacity = '0';
                    
                    setTimeout(() => {
                        this.mainInterface.style.transition = 'opacity 0.5s ease-in-out';
                        this.mainInterface.style.opacity = '1';
                    }, 50);
                }
            }, 300);
        }
        
        this.updateStatus('Ready', 'ready');
        console.log('Main interface shown');
    }

    toggleListening() {
        console.log('Toggling listening state...');
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        console.log('Starting to listen...');
        if (this.recognition && !this.isListening && !this.isSpeaking) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.showError('Could not start voice recognition. Please try again.');
            }
        }
    }

    stopListening() {
        console.log('Stopping listening...');
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
            this.isListening = false;
            this.updateStatus('Ready', 'ready');
            this.hideSpeechDisplay();
            this.deactivateMicrophone();
        }
    }

    activateMicrophone() {
        if (this.microphoneButton) {
            this.microphoneButton.classList.add('active');
        }
        if (this.micInstructions) {
            this.micInstructions.textContent = 'Listening... Click to stop';
        }
    }

    deactivateMicrophone() {
        if (this.microphoneButton) {
            this.microphoneButton.classList.remove('active');
        }
        if (this.micInstructions) {
            this.micInstructions.textContent = 'Click to speak';
        }
    }

    handleSpeechError(error) {
        switch (error) {
            case 'not-allowed':
                this.showError('Microphone access denied. Please enable microphone permissions and refresh the page.');
                break;
            case 'no-speech':
                this.showError('No speech detected. Please try speaking more clearly.');
                break;
            case 'audio-capture':
                this.showError('No microphone found. Please check your audio devices.');
                break;
            case 'network':
                this.showError('Network error occurred. Please check your internet connection.');
                break;
            default:
                this.showError('Speech recognition error. Please try again.');
        }
    }

    handleUserInput(text) {
        console.log('Handling user input:', text);
        this.stopListening();
        this.addMessage(text, 'user');
        this.processUserQuery(text);
    }

    async processUserQuery(query) {
        console.log('Processing query:', query);
        this.updateStatus('Processing...', 'processing');
        this.showTypingIndicator();

        try {
            // Simulate processing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

            const response = this.generateResponse(query);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            
            // Convert to speech if API key is available
            if (this.settings.apiKey.trim()) {
                await this.speakText(response);
            }

            this.updateStatus('Ready', 'ready');
            
            // Continue listening if in continuous mode
            if (this.settings.continuousListening && !this.isSpeaking) {
                setTimeout(() => this.startListening(), 1000);
            }
        } catch (error) {
            console.error('Error processing query:', error);
            this.hideTypingIndicator();
            this.showError('Error processing your request. Please try again.');
            this.updateStatus('Ready', 'ready');
        }
    }

    generateResponse(query) {
        const lowerQuery = query.toLowerCase().trim();
        
        // Greeting detection
        if (this.matchesPattern(lowerQuery, ['hello', 'hi', 'hey', 'how are you', 'good morning', 'good afternoon', 'good evening'])) {
            return this.getRandomResponse('greeting');
        }
        
        // Time query
        if (this.matchesPattern(lowerQuery, ['time', 'what time', "what's the time", 'clock'])) {
            const time = new Date().toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            return this.getRandomResponse('time').replace('[TIME]', time);
        }
        
        // Weather query
        if (this.matchesPattern(lowerQuery, ['weather', 'forecast', 'temperature', "how's the weather"])) {
            return this.getRandomResponse('weather');
        }
        
        // Math calculations
        if (this.containsMath(lowerQuery)) {
            const result = this.performCalculation(lowerQuery);
            if (result !== null) {
                return this.getRandomResponse('calculation').replace('[RESULT]', result);
            }
        }

        // Jokes
        if (this.matchesPattern(lowerQuery, ['joke', 'funny', 'tell me a joke', 'make me laugh', 'humor'])) {
            return this.getRandomResponse('joke');
        }

        // Help
        if (this.matchesPattern(lowerQuery, ['help', 'what can you', 'what do you do', 'capabilities', 'commands'])) {
            return this.getRandomResponse('help');
        }

        // Default fallback
        return this.getRandomResponse('fallback');
    }

    matchesPattern(query, patterns) {
        return patterns.some(pattern => query.includes(pattern));
    }

    containsMath(query) {
        const mathPatterns = [
            /\d+\s*[\+\-\*\/x×÷]\s*\d+/,
            /calculate/,
            /what is \d+/,
            /what's \d+/,
            /multiply/,
            /divide/,
            /plus/,
            /minus/
        ];
        return mathPatterns.some(pattern => pattern.test(query));
    }

    getRandomResponse(type) {
        const responses = this.responses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    performCalculation(query) {
        try {
            // Handle basic mathematical expressions
            const mathRegex = /(\d+(?:\.\d+)?)\s*([\+\-\*\/x×÷])\s*(\d+(?:\.\d+)?)/g;
            const match = mathRegex.exec(query);
            
            if (match) {
                const num1 = parseFloat(match[1]);
                const operator = match[2];
                const num2 = parseFloat(match[3]);
                
                let result;
                switch (operator) {
                    case '+':
                        result = num1 + num2;
                        break;
                    case '-':
                        result = num1 - num2;
                        break;
                    case '*':
                    case 'x':
                    case '×':
                        result = num1 * num2;
                        break;
                    case '/':
                    case '÷':
                        if (num2 === 0) {
                            return 'undefined (division by zero)';
                        }
                        result = num1 / num2;
                        break;
                    default:
                        return null;
                }
                
                // Format result nicely
                return Number.isInteger(result) ? result.toString() : result.toFixed(2);
            }
            
            return null;
        } catch (error) {
            console.error('Calculation error:', error);
            return null;
        }
    }

    async speakText(text) {
        if (!this.settings.apiKey.trim()) {
            console.warn('ElevenLabs API key not provided');
            return;
        }

        try {
            this.isSpeaking = true;
            this.updateStatus('Speaking...', 'speaking');

            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.settings.voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.settings.apiKey.trim()
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5,
                        style: 0.5,
                        speed: this.settings.speechSpeed
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            if (this.currentAudio) {
                this.currentAudio.pause();
            }
            
            this.currentAudio = new Audio(audioUrl);
            this.currentAudio.volume = this.settings.volume;
            
            this.currentAudio.onended = () => {
                this.isSpeaking = false;
                this.updateStatus('Ready', 'ready');
                URL.revokeObjectURL(audioUrl);
            };

            this.currentAudio.onerror = () => {
                this.isSpeaking = false;
                this.updateStatus('Ready', 'ready');
                URL.revokeObjectURL(audioUrl);
            };

            await this.currentAudio.play();
        } catch (error) {
            console.error('Text-to-speech error:', error);
            this.isSpeaking = false;
            this.updateStatus('Ready', 'ready');
            
            if (error.message.includes('401')) {
                this.showError('Invalid API key. Please check your ElevenLabs API key in settings.');
            } else if (error.message.includes('429')) {
                this.showError('API rate limit exceeded. Please try again later.');
            } else {
                this.showError('Unable to play audio response. Please check your API key and internet connection.');
            }
        }
    }

    addMessage(text, type) {
        console.log('Adding message:', { text, type });
        
        if (!this.conversationArea) {
            console.error('Conversation area not found');
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${type}-message`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });

        const avatarIcon = type === 'user' ? '👤' : '🤖';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">${avatarIcon}</div>
            </div>
            <div class="message-content">
                <div class="message-text">
                    <p>${text}</p>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;

        this.conversationArea.appendChild(messageDiv);
        this.conversationArea.scrollTop = this.conversationArea.scrollHeight;

        // Store in conversation history
        this.conversationHistory.push({ text, type, timestamp: Date.now() });
    }

    showTypingIndicator() {
        if (!this.conversationArea) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">🤖</div>
            </div>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        this.conversationArea.appendChild(typingDiv);
        this.conversationArea.scrollTop = this.conversationArea.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    showSpeechDisplay() {
        if (this.speechDisplay) {
            this.speechDisplay.classList.add('active');
        }
    }

    hideSpeechDisplay() {
        if (this.speechDisplay) {
            this.speechDisplay.classList.remove('active');
        }
        if (this.speechText) {
            this.speechText.textContent = 'Listening...';
        }
    }

    updateStatus(text, state) {
        if (!this.statusIndicator) return;

        const statusText = this.statusIndicator.querySelector('.status-text');
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        
        if (statusText) {
            statusText.textContent = text;
        }
        
        if (statusDot) {
            // Reset classes
            statusDot.className = 'status-dot';
            
            // Apply state-specific styling
            switch (state) {
                case 'listening':
                    statusDot.style.background = '#ef4444';
                    break;
                case 'processing':
                    statusDot.style.background = '#f59e0b';
                    break;
                case 'speaking':
                    statusDot.style.background = '#06b6d4';
                    break;
                default:
                    statusDot.style.background = '#10b981';
            }
        }
    }

    showSettings() {
        console.log('Showing settings panel...');
        
        if (this.settingsModal) {
            this.settingsModal.classList.remove('hidden');
            this.settingsModal.style.display = 'flex';
            this.loadSettingsToUI();
            
            // Trigger slide animation
            setTimeout(() => {
                const drawer = this.settingsModal.querySelector('.settings-drawer');
                if (drawer) {
                    drawer.style.transform = 'translateX(0)';
                }
            }, 10);
        }
    }

    hideSettings() {
        console.log('Hiding settings panel...');
        
        if (this.settingsModal) {
            const drawer = this.settingsModal.querySelector('.settings-drawer');
            if (drawer) {
                drawer.style.transform = 'translateX(100%)';
            }
            
            setTimeout(() => {
                this.settingsModal.classList.add('hidden');
                this.settingsModal.style.display = 'none';
            }, 300);
        }
    }

    loadSettingsToUI() {
        if (this.voiceSelect) this.voiceSelect.value = this.settings.voiceId;
        if (this.speechSpeed) this.speechSpeed.value = this.settings.speechSpeed;
        if (this.volumeControl) this.volumeControl.value = this.settings.volume;
        if (this.apiKeyInput) this.apiKeyInput.value = this.settings.apiKey;
        if (this.continuousListening) this.continuousListening.checked = this.settings.continuousListening;
        
        // Update display values
        const speedValue = document.getElementById('speed-value');
        const volumeValue = document.getElementById('volume-value');
        
        if (speedValue) speedValue.textContent = `${this.settings.speechSpeed}x`;
        if (volumeValue) volumeValue.textContent = `${Math.round(this.settings.volume * 100)}%`;
    }

    saveSettings() {
        this.settings = {
            voiceId: this.voiceSelect ? this.voiceSelect.value : this.settings.voiceId,
            speechSpeed: this.speechSpeed ? parseFloat(this.speechSpeed.value) : this.settings.speechSpeed,
            volume: this.volumeControl ? parseFloat(this.volumeControl.value) : this.settings.volume,
            apiKey: this.apiKeyInput ? this.apiKeyInput.value : this.settings.apiKey,
            continuousListening: this.continuousListening ? this.continuousListening.checked : this.settings.continuousListening
        };
        
        localStorage.setItem('professionalVoiceAssistantSettings', JSON.stringify(this.settings));
        this.showSuccess('Settings saved successfully!');
    }

    loadSettings() {
        const saved = localStorage.getItem('professionalVoiceAssistantSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }

    testVoice() {
        const testText = "Hello! This is a test of your selected voice settings. Your AI assistant is working perfectly.";
        this.speakText(testText);
    }

    clearConversation() {
        if (!this.conversationArea) return;

        // Add fade out animation
        this.conversationArea.style.opacity = '0';
        
        setTimeout(() => {
            this.conversationArea.innerHTML = `
                <div class="welcome-message">
                    <div class="message-bubble ai-message">
                        <div class="message-avatar">
                            <div class="avatar-icon">🤖</div>
                        </div>
                        <div class="message-content">
                            <div class="message-text">
                                <p>Hello! I'm your professional AI voice assistant. Use the microphone below or select a quick action to get started.</p>
                            </div>
                            <div class="message-time">Just now</div>
                        </div>
                    </div>
                </div>
            `;
            this.conversationHistory = [];
            this.conversationArea.style.opacity = '1';
        }, 300);
    }

    showError(message) {
        this.showNotification(message, 'error', '⚠️');
    }

    showSuccess(message) {
        this.showNotification(message, 'success', '✅');
    }

    showNotification(message, type, icon) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
        }
        if (this.toastIcon) {
            this.toastIcon.textContent = icon;
        }
        if (this.errorToast) {
            const toastContent = this.errorToast.querySelector('.toast-content');
            if (toastContent) {
                // Apply different styling based on type
                if (type === 'success') {
                    toastContent.style.borderLeftColor = '#10b981';
                } else if (type === 'error') {
                    toastContent.style.borderLeftColor = '#ef4444';
                }
            }
            
            this.errorToast.classList.remove('hidden');
            this.errorToast.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.hideNotification();
            }, 5000);
        }
    }

    hideNotification() {
        if (this.errorToast) {
            this.errorToast.style.opacity = '0';
            setTimeout(() => {
                this.errorToast.classList.add('hidden');
                this.errorToast.style.display = 'none';
                this.errorToast.style.opacity = '1';
            }, 300);
        }
    }
}

// Initialize the Professional Voice Assistant
document.addEventListener('DOMContentLoaded', () => {
    console.log('Professional AI Voice Assistant initializing...');
    try {
        window.professionalVoiceAssistant = new ProfessionalVoiceAssistant();
    } catch (error) {
        console.error('Error initializing Professional Voice Assistant:', error);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.professionalVoiceAssistant) {
        window.professionalVoiceAssistant.stopListening();
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', () => {
    if (window.professionalVoiceAssistant && window.professionalVoiceAssistant.currentAudio) {
        window.professionalVoiceAssistant.currentAudio.pause();
    }
});

// Add global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.professionalVoiceAssistant) {
        window.professionalVoiceAssistant.showError('An unexpected error occurred. Please refresh the page.');
    }
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
    if (window.professionalVoiceAssistant) {
        window.professionalVoiceAssistant.showError('A system error occurred. Please try again.');
    }
});