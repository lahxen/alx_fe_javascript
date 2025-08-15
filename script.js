// Dynamic Quote Generator with Web Storage and JSON Handling
class QuoteManager {
    constructor() {
        this.quotes = [];
        this.currentQuoteIndex = -1;
        this.storageKey = 'quoteGeneratorData';
        this.sessionKey = 'lastViewedQuote';
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
        this.loadSessionData();
    }

    // Local Storage Functions
    saveToStorage() {
        try {
            const data = {
                quotes: this.quotes,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.updateQuoteCount();
        } catch (error) {
            this.showMessage('Error saving to storage: ' + error.message, 'error');
        }
    }

    loadFromStorage() {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            if (storedData) {
                const data = JSON.parse(storedData);
                this.quotes = data.quotes || [];
                this.showMessage(`Loaded ${this.quotes.length} quotes from storage`, 'info');
            } else {
                // Initialize with default quotes if no data exists
                this.initializeDefaultQuotes();
            }
        } catch (error) {
            this.showMessage('Error loading from storage: ' + error.message, 'error');
            this.initializeDefaultQuotes();
        }
    }

    // Session Storage Functions
    saveToSession(quoteData) {
        try {
            sessionStorage.setItem(this.sessionKey, JSON.stringify({
                quote: quoteData,
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.warn('Session storage not available:', error);
        }
    }

    loadSessionData() {
        try {
            const sessionData = sessionStorage.getItem(this.sessionKey);
            if (sessionData) {
                const data = JSON.parse(sessionData);
                const lastViewed = new Date(data.timestamp).toLocaleString();
                document.getElementById('lastViewed').textContent = lastViewed;
            }
        } catch (error) {
            console.warn('Error loading session data:', error);
        }
    }

    initializeDefaultQuotes() {
        this.quotes = [
            {
                text: "The only way to do great work is to love what you do.",
                author: "Steve Jobs",
                id: this.generateId()
            },
            {
                text: "Innovation distinguishes between a leader and a follower.",
                author: "Steve Jobs",
                id: this.generateId()
            },
            {
                text: "Life is what happens to you while you're busy making other plans.",
                author: "John Lennon",
                id: this.generateId()
            },
            {
                text: "The future belongs to those who believe in the beauty of their dreams.",
                author: "Eleanor Roosevelt",
                id: this.generateId()
            },
            {
                text: "It is during our darkest moments that we must focus to see the light.",
                author: "Aristotle",
                id: this.generateId()
            }
        ];
        this.saveToStorage();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    setupEventListeners() {
        // Random quote button
        document.getElementById('randomQuoteBtn').addEventListener('click', () => {
            this.displayRandomQuote();
        });

        // Add quote form
        document.getElementById('quoteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewQuote();
        });

        // Export functionality
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToJSON();
        });

        // Import functionality
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importFromJSON(e);
        });

        // Clear storage
        document.getElementById('clearStorageBtn').addEventListener('click', () => {
            this.clearAllData();
        });
    }

    displayRandomQuote() {
        if (this.quotes.length === 0) {
            this.showMessage('No quotes available. Add some quotes first!', 'info');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        const quote = this.quotes[randomIndex];
        this.currentQuoteIndex = randomIndex;

        document.getElementById('currentQuote').textContent = `"${quote.text}"`;
        document.getElementById('currentAuthor').textContent = `- ${quote.author}`;

        // Save to session storage
        this.saveToSession(quote);
        this.loadSessionData();

        // Add animation
        const quoteCard = document.querySelector('.quote-card');
        quoteCard.classList.remove('fade-in');
        setTimeout(() => quoteCard.classList.add('fade-in'), 10);
    }

    addNewQuote() {
        const quoteText = document.getElementById('quoteText').value.trim();
        const quoteAuthor = document.getElementById('quoteAuthor').value.trim();

        if (!quoteText || !quoteAuthor) {
            this.showMessage('Please fill in both quote and author fields', 'error');
            return;
        }

        const newQuote = {
            text: quoteText,
            author: quoteAuthor,
            id: this.generateId(),
            dateAdded: new Date().toISOString()
        };

        this.quotes.push(newQuote);
        this.saveToStorage();
        this.updateUI();

        // Clear form
        document.getElementById('quoteForm').reset();
        
        this.showMessage('Quote added successfully!', 'success');
    }

    updateUI() {
        this.updateQuoteCount();
        this.displayAllQuotes();
    }

    updateQuoteCount() {
        document.getElementById('quoteCount').textContent = this.quotes.length;
    }

    displayAllQuotes() {
        const quotesList = document.getElementById('quotesList');
        
        if (this.quotes.length === 0) {
            quotesList.innerHTML = `
                <div class="empty-state">
                    <i>📝</i>
                    <p>No quotes yet. Add your first quote to get started!</p>
                </div>
            `;
            return;
        }

        quotesList.innerHTML = this.quotes.map(quote => `
            <div class="quote-item" data-id="${quote.id}">
                <div class="quote-item-text">"${quote.text}"</div>
                <div class="quote-item-author">- ${quote.author}</div>
                <div class="quote-item-actions">
                    <button class="btn btn-primary btn-small" onclick="quoteManager.displaySpecificQuote('${quote.id}')">
                        Show Quote
                    </button>
                    <button class="btn btn-danger btn-small" onclick="quoteManager.deleteQuote('${quote.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    displaySpecificQuote(quoteId) {
        const quote = this.quotes.find(q => q.id === quoteId);
        if (quote) {
            document.getElementById('currentQuote').textContent = `"${quote.text}"`;
            document.getElementById('currentAuthor').textContent = `- ${quote.author}`;
            
            // Save to session storage
            this.saveToSession(quote);
            this.loadSessionData();

            // Scroll to quote display
            document.querySelector('.quote-display').scrollIntoView({ behavior: 'smooth' });
        }
    }

    deleteQuote(quoteId) {
        if (confirm('Are you sure you want to delete this quote?')) {
            this.quotes = this.quotes.filter(q => q.id !== quoteId);
            this.saveToStorage();
            this.updateUI();
            this.showMessage('Quote deleted successfully', 'info');
        }
    }

    // JSON Export Functionality
    exportToJSON() {
        try {
            const dataToExport = {
                quotes: this.quotes,
                exportDate: new Date().toISOString(),
                version: "1.0"
            };

            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `quotes-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            URL.revokeObjectURL(url);
            
            this.showMessage(`Exported ${this.quotes.length} quotes successfully!`, 'success');
        } catch (error) {
            this.showMessage('Error exporting quotes: ' + error.message, 'error');
        }
    }

    // JSON Import Functionality
    importFromJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            this.showMessage('Please select a valid JSON file', 'error');
            return;
        }

        const fileReader = new FileReader();
        
        fileReader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate imported data
                if (!this.validateImportedData(importedData)) {
                    this.showMessage('Invalid file format. Please select a valid quotes backup file.', 'error');
                    return;
                }

                // Extract quotes from different possible formats
                let importedQuotes = [];
                if (importedData.quotes && Array.isArray(importedData.quotes)) {
                    importedQuotes = importedData.quotes;
                } else if (Array.isArray(importedData)) {
                    importedQuotes = importedData;
                } else {
                    this.showMessage('No valid quotes found in the file', 'error');
                    return;
                }

                // Add IDs to quotes that don't have them
                importedQuotes = importedQuotes.map(quote => ({
                    ...quote,
                    id: quote.id || this.generateId(),
                    dateAdded: quote.dateAdded || new Date().toISOString()
                }));

                // Ask user about merge strategy
                const shouldMerge = confirm(
                    `Found ${importedQuotes.length} quotes in the file.\n\n` +
                    `Click OK to ADD these quotes to your existing ${this.quotes.length} quotes,\n` +
                    `or Cancel to REPLACE all existing quotes.`
                );

                if (shouldMerge) {
                    // Merge quotes, avoiding duplicates
                    const existingTexts = new Set(this.quotes.map(q => q.text.toLowerCase()));
                    const newQuotes = importedQuotes.filter(quote => 
                        !existingTexts.has(quote.text.toLowerCase())
                    );
                    
                    this.quotes.push(...newQuotes);
                    this.showMessage(
                        `Successfully imported ${newQuotes.length} new quotes! ` +
                        `(${importedQuotes.length - newQuotes.length} duplicates skipped)`,
                        'success'
                    );
                } else {
                    // Replace all quotes
                    this.quotes = importedQuotes;
                    this.showMessage(`Successfully replaced all quotes with ${importedQuotes.length} imported quotes!`, 'success');
                }

                this.saveToStorage();
                this.updateUI();

            } catch (error) {
                this.showMessage('Error reading file: ' + error.message, 'error');
            }
        };

        fileReader.onerror = () => {
            this.showMessage('Error reading file', 'error');
        };

        fileReader.readAsText(file);
        
        // Clear the input
        event.target.value = '';
    }

    validateImportedData(data) {
        // Check if data has quotes array or is an array itself
        const quotesToCheck = data.quotes || (Array.isArray(data) ? data : null);
        
        if (!quotesToCheck || !Array.isArray(quotesToCheck)) {
            return false;
        }

        // Check if quotes have required properties
        return quotesToCheck.every(quote => 
            quote && 
            typeof quote === 'object' && 
            typeof quote.text === 'string' && 
            typeof quote.author === 'string'
        );
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete all quotes? This action cannot be undone.')) {
            this.quotes = [];
            localStorage.removeItem(this.storageKey);
            sessionStorage.removeItem(this.sessionKey);
            
            this.updateUI();
            
            // Reset quote display
            document.getElementById('currentQuote').textContent = '"Click \'Get Random Quote\' to start exploring wisdom!"';
            document.getElementById('currentAuthor').textContent = '- Quote Generator';
            document.getElementById('lastViewed').textContent = 'None';
            
            this.showMessage('All data cleared successfully', 'info');
        }
    }

    showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;

        // Insert at the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Utility method to check storage availability
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Get storage usage statistics
    getStorageStats() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const size = data ? new Blob([data]).size : 0;
            return {
                quotesCount: this.quotes.length,
                storageSize: size,
                storageSizeKB: (size / 1024).toFixed(2)
            };
        } catch (error) {
            return null;
        }
    }
}

// Initialize the Quote Manager when the page loads
let quoteManager;

document.addEventListener('DOMContentLoaded', () => {
    quoteManager = new QuoteManager();
    
    // Optional: Display storage stats in console
    console.log('Quote Generator Loaded');
    console.log('Storage Stats:', quoteManager.getStorageStats());
    
    // Check if storage is available
    if (!quoteManager.checkStorageAvailability()) {
        quoteManager.showMessage('Local storage is not available. Data will not persist across sessions.', 'error');
    }
});

// Export the QuoteManager class for potential external use
window.QuoteManager = QuoteManager;
