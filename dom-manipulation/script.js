// 🎯 LEARNING DOM MANIPULATION - QUOTES MANAGEMENT SYSTEM

// Global variables (data storage)
let quotes = [];
let currentQuoteIndex = -1;

// 📚 Default quotes to start with - each quote has text and category properties
const defaultQuotes = [
    { 
        text: "The only way to do great work is to love what you do.", 
        author: "Steve Jobs",
        category: "motivation",
        id: "default_1"
    },
    { 
        text: "Innovation distinguishes between a leader and a follower.", 
        author: "Steve Jobs",
        category: "innovation",
        id: "default_2"
    },
    { 
        text: "Life is what happens while you're making other plans.", 
        author: "John Lennon",
        category: "life",
        id: "default_3"
    },
    { 
        text: "The future belongs to those who believe in their dreams.", 
        author: "Eleanor Roosevelt",
        category: "dreams",
        id: "default_4"
    },
    { 
        text: "Focus on the light during dark moments.", 
        author: "Aristotle",
        category: "wisdom",
        id: "default_5"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "courage",
        id: "default_6"
    },
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
        category: "action",
        id: "default_7"
    }
];

// 🔍 Function to check quotes array existence and structure
function checkQuotesArrayStructure() {
    console.log("🔍 Checking quotes array structure...");
    
    // Check if quotes array exists
    if (!Array.isArray(quotes)) {
        console.error("❌ Quotes array does not exist or is not an array");
        return false;
    }
    
    console.log(`✅ Quotes array exists with ${quotes.length} quotes`);
    
    // Check if quotes have required properties
    const validQuotes = quotes.filter(quote => {
        const hasText = quote.hasOwnProperty('text') && typeof quote.text === 'string';
        const hasCategory = quote.hasOwnProperty('category') && typeof quote.category === 'string';
        return hasText && hasCategory;
    });
    
    console.log(`✅ ${validQuotes.length} quotes have both 'text' and 'category' properties`);
    
    if (validQuotes.length !== quotes.length) {
        console.warn(`⚠️ ${quotes.length - validQuotes.length} quotes are missing required properties`);
    }
    
    // Display structure summary
    console.log("📊 Quotes structure summary:");
    quotes.forEach((quote, index) => {
        console.log(`Quote ${index + 1}:`, {
            hasText: quote.hasOwnProperty('text'),
            hasCategory: quote.hasOwnProperty('category'),
            hasAuthor: quote.hasOwnProperty('author'),
            text: quote.text ? quote.text.substring(0, 30) + "..." : "Missing",
            category: quote.category || "Missing"
        });
    });
    
    return validQuotes.length === quotes.length;
}

// 🚀 Initialize the app when page loads
window.onload = function() {
    console.log("🚀 Initializing Quote Generator...");
    loadQuotesFromStorage();
    updateDisplay();
    
    // Check quotes array structure
    checkQuotesArrayStructure();
    
    showMessage("Welcome! App loaded successfully.", "success");
    console.log("✅ Quote Generator initialized successfully");
};

// 🎲 Get a random quote and display it
function getRandomQuote() {
    if (quotes.length === 0) {
        showMessage("No quotes available! Add some quotes first.", "error");
        return;
    }

    // DOM Manipulation: Select random quote
    currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[currentQuoteIndex];

    // DOM Manipulation: Update the display elements
    document.getElementById('currentQuote').textContent = `"${selectedQuote.text}"`;
    document.getElementById('currentAuthor').textContent = `- ${selectedQuote.author}`;
    
    // Show category if available
    if (selectedQuote.category) {
        const categoryElement = document.getElementById('currentCategory');
        if (categoryElement) {
            categoryElement.textContent = `Category: ${selectedQuote.category}`;
        }
    }
    
    // Save to session storage (temporary storage for this session)
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(selectedQuote));
    updateLastAction("Showed random quote");
    
    console.log("🎲 Random quote displayed:", selectedQuote);
}

// � Show random quote (alias for getRandomQuote for compatibility)
function showRandomQuote() {
    getRandomQuote();
}

// �🎯 Get random quote by category
function getRandomQuoteByCategory(category) {
    const categoryQuotes = quotes.filter(quote => 
        quote.category && quote.category.toLowerCase() === category.toLowerCase()
    );
    
    if (categoryQuotes.length === 0) {
        showMessage(`No quotes found in category: ${category}`, "error");
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    const selectedQuote = categoryQuotes[randomIndex];
    
    // Update display
    document.getElementById('currentQuote').textContent = `"${selectedQuote.text}"`;
    document.getElementById('currentAuthor').textContent = `- ${selectedQuote.author}`;
    
    // Show category
    const categoryElement = document.getElementById('currentCategory');
    if (categoryElement) {
        categoryElement.textContent = `Category: ${selectedQuote.category}`;
    }
    
    updateLastAction(`Showed ${category} quote`);
    console.log(`🎯 Category quote displayed (${category}):`, selectedQuote);
}

// 🔨 Create the add quote form dynamically
function createAddQuoteForm() {
    // Check if form already exists
    if (document.getElementById('addQuoteForm')) {
        console.log("Add quote form already exists");
        return;
    }

    // Create the form container
    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteForm';
    formContainer.className = 'add-quote hidden';
    
    // Create form HTML content
    formContainer.innerHTML = `
        <h3>Add Your Own Quote</h3>
        <div class="form-group">
            <label for="quoteText">Quote:</label>
            <textarea id="quoteText" placeholder="Enter your quote here..."></textarea>
        </div>
        <div class="form-group">
            <label for="quoteAuthor">Author:</label>
            <input type="text" id="quoteAuthor" placeholder="Enter author name">
        </div>
        <div class="form-group">
            <label for="quoteCategory">Category:</label>
            <input type="text" id="quoteCategory" placeholder="Enter category (e.g., motivation, wisdom, life)">
        </div>
        <button onclick="addQuote()">✅ Save Quote</button>
        <button onclick="hideAddForm()">❌ Cancel</button>
    `;
    
    // Find a good place to insert the form (after controls section)
    const container = document.querySelector('.container');
    const controls = document.querySelector('.controls');
    
    if (container && controls) {
        // Insert after controls section
        container.insertBefore(formContainer, controls.nextSibling);
    } else {
        // Fallback: append to body
        document.body.appendChild(formContainer);
    }
    
    console.log("✅ Add quote form created dynamically");
    updateLastAction("Created add quote form");
}

// ➕ Show the add quote form
function showAddForm() {
    // Ensure form exists first
    createAddQuoteForm();
    
    // DOM Manipulation: Show hidden form
    document.getElementById('addQuoteForm').style.display = 'block';
    document.getElementById('quoteText').focus(); // Focus on first input
}

// ❌ Hide the add quote form
function hideAddForm() {
    // DOM Manipulation: Hide form and clear inputs
    document.getElementById('addQuoteForm').style.display = 'none';
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteAuthor').value = '';
    document.getElementById('quoteCategory').value = '';
}

// ✅ Add a new quote
function addQuote() {
    // DOM Manipulation: Get values from input elements
    const quoteText = document.getElementById('quoteText').value.trim();
    const quoteAuthor = document.getElementById('quoteAuthor').value.trim();
    const quoteCategory = document.getElementById('quoteCategory').value.trim();

    // Validation
    if (!quoteText || !quoteAuthor) {
        showMessage("Please fill in both quote and author fields!", "error");
        return;
    }
    
    if (!quoteCategory) {
        showMessage("Please specify a category for the quote!", "error");
        return;
    }

    // Create new quote object with required properties
    const newQuote = {
        text: quoteText,
        author: quoteAuthor,
        category: quoteCategory.toLowerCase(),
        id: Date.now(), // Simple ID generation
        dateAdded: new Date().toISOString()
    };

    // Add to quotes array
    quotes.push(newQuote);
    
    // Save to localStorage (persistent storage)
    saveQuotesToStorage();
    
    // Update the display
    updateDisplay();
    hideAddForm();
    
    showMessage(`Quote by ${quoteAuthor} added successfully in category: ${quoteCategory}!`, "success");
    updateLastAction("Added new quote");
    
    console.log("✅ New quote added:", newQuote);
    
    // Re-check structure after adding
    checkQuotesArrayStructure();
}

// 🗑️ Clear all quotes
function clearAllQuotes() {
    if (confirm("Are you sure you want to delete all quotes?")) {
        quotes = [];
        localStorage.removeItem('quotesData');
        sessionStorage.removeItem('lastViewedQuote');
        
        // DOM Manipulation: Reset display
        document.getElementById('currentQuote').textContent = '"Click \'Get Random Quote\' to start!"';
        document.getElementById('currentAuthor').textContent = '- Quote Generator';
        
        // Clear category if exists
        const categoryElement = document.getElementById('currentCategory');
        if (categoryElement) {
            categoryElement.textContent = '';
        }
        
        updateDisplay();
        showMessage("All quotes cleared!", "success");
        updateLastAction("Cleared all quotes");
        
        console.log("🗑️ All quotes cleared");
    }
}

// 💾 Export quotes to JSON file
function exportQuotes() {
    if (quotes.length === 0) {
        showMessage("No quotes to export!", "error");
        return;
    }

    // Create JSON data
    const exportData = {
        quotes: quotes,
        exportDate: new Date().toISOString(),
        totalQuotes: quotes.length,
        categories: getUniqueCategories()
    };

    // Create downloadable file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // DOM Manipulation: Create invisible download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `my-quotes-${new Date().toISOString().split('T')[0]}.json`;
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    showMessage(`Exported ${quotes.length} quotes successfully!`, "success");
    updateLastAction("Exported quotes");
    
    console.log("💾 Quotes exported:", exportData);
}

// 📁 Import quotes from JSON file
function importQuotes(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.json')) {
        showMessage("Please select a JSON file!", "error");
        return;
    }

    // Read the file
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Extract quotes from different formats
            let importedQuotes = [];
            if (importedData.quotes && Array.isArray(importedData.quotes)) {
                importedQuotes = importedData.quotes;
            } else if (Array.isArray(importedData)) {
                importedQuotes = importedData;
            }

            if (importedQuotes.length === 0) {
                showMessage("No valid quotes found in file!", "error");
                return;
            }

            // Ensure imported quotes have required properties
            importedQuotes = importedQuotes.map(quote => ({
                ...quote,
                category: quote.category || 'uncategorized', // Add default category if missing
                id: quote.id || Date.now() + Math.random() // Ensure unique ID
            }));

            // Add imported quotes
            const oldCount = quotes.length;
            quotes.push(...importedQuotes);
            
            saveQuotesToStorage();
            updateDisplay();
            
            showMessage(`Imported ${importedQuotes.length} quotes! Total: ${quotes.length}`, "success");
            updateLastAction(`Imported ${importedQuotes.length} quotes`);
            
            console.log("📁 Quotes imported:", importedQuotes);
            
            // Check structure after import
            checkQuotesArrayStructure();
            
        } catch (error) {
            showMessage("Error reading file: " + error.message, "error");
            console.error("❌ Import error:", error);
        }
    };

    fileReader.readAsText(file);
    // Clear the input
    event.target.value = '';
}

// 💾 Save quotes to localStorage (persistent storage)
function saveQuotesToStorage() {
    try {
        const dataToSave = {
            quotes: quotes,
            lastSaved: new Date().toISOString(),
            version: "1.0"
        };
        localStorage.setItem('quotesData', JSON.stringify(dataToSave));
        console.log("💾 Quotes saved to localStorage");
    } catch (error) {
        showMessage("Error saving to storage: " + error.message, "error");
        console.error("❌ Save error:", error);
    }
}

// 📁 Load quotes from localStorage
function loadQuotesFromStorage() {
    try {
        const savedData = localStorage.getItem('quotesData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            quotes = parsedData.quotes || [];
            console.log(`📁 Loaded ${quotes.length} quotes from localStorage`);
        } else {
            // First time - load default quotes
            quotes = [...defaultQuotes];
            saveQuotesToStorage();
            console.log("📚 Loaded default quotes (first time)");
        }
    } catch (error) {
        console.error("❌ Error loading from storage:", error);
        quotes = [...defaultQuotes]; // Fallback to defaults
    }
}

// 🔄 Update all displays (DOM manipulation)
function updateDisplay() {
    // Update quote count
    document.getElementById('quoteCount').textContent = quotes.length;

    // Update categories display
    updateCategoriesDisplay();

    // Update all quotes display
    const allQuotesDiv = document.getElementById('allQuotes');
    
    if (quotes.length === 0) {
        allQuotesDiv.innerHTML = '<p style="text-align: center; color: #666;">No quotes yet. Add your first quote!</p>';
        return;
    }

    // DOM Manipulation: Create HTML for all quotes
    let quotesHTML = '';
    quotes.forEach((quote, index) => {
        quotesHTML += `
            <div class="quote-item">
                <div class="quote-text">"${quote.text}"</div>
                <div class="quote-author">- ${quote.author}</div>
                <div class="quote-category">Category: ${quote.category || 'uncategorized'}</div>
                <div class="quote-actions">
                    <button onclick="showSpecificQuote(${index})" style="margin-top: 10px; padding: 5px 10px; font-size: 0.9rem;">Show This Quote</button>
                    <button onclick="deleteQuote(${index})" style="margin-top: 10px; padding: 5px 10px; font-size: 0.9rem; background: #dc3545;">Delete</button>
                </div>
            </div>
        `;
    });
    
    allQuotesDiv.innerHTML = quotesHTML;
}

// 📊 Update categories display
function updateCategoriesDisplay() {
    const categories = getUniqueCategories();
    const categoriesElement = document.getElementById('categoriesList');
    
    if (categoriesElement && categories.length > 0) {
        categoriesElement.innerHTML = categories.map(category => 
            `<button onclick="getRandomQuoteByCategory('${category}')" class="category-btn">${category}</button>`
        ).join('');
    }
}

// 🏷️ Get unique categories from quotes
function getUniqueCategories() {
    const categories = quotes
        .map(quote => quote.category || 'uncategorized')
        .filter((category, index, arr) => arr.indexOf(category) === index)
        .sort();
    
    return categories;
}

// 👁️ Show a specific quote
function showSpecificQuote(index) {
    const quote = quotes[index];
    document.getElementById('currentQuote').textContent = `"${quote.text}"`;
    document.getElementById('currentAuthor').textContent = `- ${quote.author}`;
    
    // Show category if available
    const categoryElement = document.getElementById('currentCategory');
    if (categoryElement && quote.category) {
        categoryElement.textContent = `Category: ${quote.category}`;
    }
    
    // Scroll to top to see the quote
    document.querySelector('.quote-display').scrollIntoView({ behavior: 'smooth' });
    updateLastAction("Showed specific quote");
}

// 🗑️ Delete a specific quote
function deleteQuote(index) {
    const quote = quotes[index];
    if (confirm(`Delete quote by ${quote.author}?`)) {
        quotes.splice(index, 1);
        saveQuotesToStorage();
        updateDisplay();
        showMessage("Quote deleted!", "success");
        updateLastAction("Deleted quote");
        
        console.log("🗑️ Quote deleted:", quote);
        
        // Re-check structure after deletion
        checkQuotesArrayStructure();
    }
}

// 📝 Show messages to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.error, .success');
    existingMessages.forEach(msg => {
        if (msg.id !== 'storageInfo') {
            msg.remove();
        }
    });

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    messageDiv.style.margin = '10px 0';
    
    // DOM Manipulation: Insert message at top of container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.children[1]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// 📊 Update last action info
function updateLastAction(action) {
    document.getElementById('lastAction').textContent = action + ' at ' + new Date().toLocaleTimeString();
}

// 🔍 Debug function to inspect quotes array
function inspectQuotesArray() {
    console.log("🔍 === QUOTES ARRAY INSPECTION ===");
    console.log("Array length:", quotes.length);
    console.log("Array type:", typeof quotes);
    console.log("Is array:", Array.isArray(quotes));
    
    console.log("\n📋 All quotes with properties:");
    quotes.forEach((quote, index) => {
        console.log(`\nQuote ${index + 1}:`);
        console.log("  Text:", quote.text);
        console.log("  Author:", quote.author);
        console.log("  Category:", quote.category);
        console.log("  ID:", quote.id);
        console.log("  Has text property:", quote.hasOwnProperty('text'));
        console.log("  Has category property:", quote.hasOwnProperty('category'));
    });
    
    console.log("\n🏷️ Categories found:", getUniqueCategories());
    console.log("=== END INSPECTION ===");
}

// Make inspection function available globally
window.inspectQuotesArray = inspectQuotesArray;

// 🎯 LEARNING NOTES:
// This file demonstrates key DOM manipulation concepts:
// 1. document.getElementById() - Getting elements by ID
// 2. element.textContent - Changing text content
// 3. element.style.display - Showing/hiding elements
// 4. element.value - Getting/setting input values
// 5. element.innerHTML - Setting HTML content
// 6. document.createElement() - Creating new elements
// 7. element.appendChild() - Adding elements to DOM
// 8. localStorage/sessionStorage - Browser storage
// 9. Event handling with onclick
// 10. File API for reading uploaded files
// 11. Array methods for data manipulation
// 12. Object property checking and validation
