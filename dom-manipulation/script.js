// 🎯 LEARNING DOM MANIPULATION - QUOTES MANAGEMENT SYSTEM

// Global variables (data storage)
let quotes = [];
let currentQuoteIndex = -1;

// 📚 Default quotes to start with - each quote has text and ca// 🎭 Show random quote (alias for getRandomQuote for compatibility)
function showRandomQuote() {
    getRandomQuote();
}

// 🖼️ Quote Display function - centralized quote display logic
function quoteDisplay(quote, context = "general") {
    if (!quote || typeof quote !== 'object') {
        console.error("❌ Invalid quote object passed to quoteDisplay");
        showMessage("Error: Invalid quote data", "error");
        return false;
    }
    
    // Validate quote structure
    if (!quote.text || !quote.author) {
        console.error("❌ Quote missing required fields (text, author)");
        showMessage("Error: Quote missing required information", "error");
        return false;
    }
    
    try {
        // Update main quote display elements
        const quoteElement = document.getElementById('currentQuote');
        const authorElement = document.getElementById('currentAuthor');
        const categoryElement = document.getElementById('currentCategory');
        
        if (quoteElement) {
            quoteElement.textContent = `"${quote.text}"`;
        }
        
        if (authorElement) {
            authorElement.textContent = `- ${quote.author}`;
        }
        
        // Show category if available and element exists
        if (quote.category && categoryElement) {
            categoryElement.textContent = `Category: ${quote.category}`;
            categoryElement.style.display = 'block';
        } else if (categoryElement) {
            categoryElement.style.display = 'none';
        }
        
        // Add visual effects for enhanced UX
        if (quoteElement) {
            quoteElement.style.opacity = '0';
            setTimeout(() => {
                quoteElement.style.transition = 'opacity 0.5s ease-in-out';
                quoteElement.style.opacity = '1';
            }, 100);
        }
        
        // Save to session storage for persistence
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
        sessionStorage.setItem('lastDisplayContext', context);
        
        // Log the display action
        console.log(`🖼️ Quote displayed (${context}):`, {
            text: quote.text.substring(0, 50) + "...",
            author: quote.author,
            category: quote.category || "uncategorized",
            context: context
        });
        
        // Update last action
        updateLastAction(`Displayed quote: ${context}`);
        
        return true;
        
    } catch (error) {
        console.error("❌ Error in quoteDisplay:", error);
        showMessage("Error displaying quote", "error");
        return false;
    }
}

// 🎯 Get random quote by category
function getRandomQuoteByCategory(category) {properties
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

// 🌐 SERVER SYNCHRONIZATION FUNCTIONALITY
// =====================================

// Global variable to store pending conflicts for manual resolution
let pendingConflicts = [];
let conflictHistory = [];

// Server configuration for JSONPlaceholder simulation
const SERVER_CONFIG = {
    BASE_URL: 'https://jsonplaceholder.typicode.com',
    ENDPOINTS: {
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments'
    },
    SYNC_INTERVAL: 15000, // 15 seconds for more frequent sync
    TIMEOUT: 10000, // 10 seconds
    MAX_QUOTES_FROM_SERVER: 5, // Limit server quotes for demo
    SYNC_CHECK_INTERVAL: 5000 // Check for sync every 5 seconds
};

// Global sync state
let serverSyncState = {
    isOnline: navigator.onLine,
    lastSyncTime: null,
    lastServerDataHash: null, // Track server data changes
    syncInterval: null,
    syncCheckInterval: null, // For periodic sync checks
    pendingChanges: [],
    conflictResolutionStrategy: 'server-wins', // Default to server-wins as requested
    isSyncing: false,
    serverDataCache: [], // Cache server data for comparison
    syncStats: {
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        conflictsResolved: 0,
        quotesFromServer: 0,
        quotesToServer: 0
    }
};

// 🌐 Initialize server synchronization
function initializeServerSync() {
    console.log("🌐 Initializing server synchronization...");
    
    // Check online status
    updateOnlineStatus();
    
    // Set up online/offline event listeners
    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);
    
    // Load conflict resolution strategy from storage (default to server-wins for Step 2)
    const savedStrategy = localStorage.getItem('conflictResolution') || 'server-wins';
    serverSyncState.conflictResolution = savedStrategy;
    const strategySelect = document.getElementById('conflictStrategy');
    if (strategySelect) {
        strategySelect.value = savedStrategy;
    }
    
    console.log(`🌐 Using conflict resolution strategy: ${savedStrategy} (Step 2: server data takes precedence)`);
    
    // Start periodic sync if online
    if (serverSyncState.isOnline) {
        startPeriodicSync();
        startDataSyncChecking(); // New: Continuous data checking
    }
    
    // Load server data on first run
    fetchDataFromServer();
    
    console.log("✅ Server sync initialized with enhanced data syncing");
}

// 📡 Fetch data from server (simulate with JSONPlaceholder)
async function fetchDataFromServer() {
    if (serverSyncState.isSyncing || !serverSyncState.isOnline) {
        console.log("⏸️ Sync skipped: already syncing or offline");
        return;
    }
    
    serverSyncState.isSyncing = true;
    updateSyncStatus("Fetching from server...");
    
    try {
        console.log("📡 Fetching data from server...");
        
        // Simulate fetching quotes data using JSONPlaceholder posts
        const response = await fetch(`${SERVER_CONFIG.BASE_URL}${SERVER_CONFIG.ENDPOINTS.POSTS}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(SERVER_CONFIG.TIMEOUT)
        });
        
        if (!response.ok) {
            throw new Error(`Server response: ${response.status}`);
        }
        
        const serverPosts = await response.json();
        
        // Transform JSONPlaceholder posts into quote format
        const serverQuotes = serverPosts.slice(0, 3).map((post, index) => ({
            text: post.title,
            author: `Server User ${post.userId}`,
            category: index === 0 ? 'server' : index === 1 ? 'remote' : 'api',
            id: `server_${post.id}`,
            serverId: post.id,
            lastModified: new Date().toISOString(),
            source: 'server'
        }));
        
        console.log("📡 Server data received:", serverQuotes);
        
        // Handle potential conflicts and merge data
        await handleDataConflicts(serverQuotes);
        
        serverSyncState.lastSyncTime = new Date().toISOString();
        updateSyncStatus("Sync completed");
        
        console.log("✅ Server sync completed successfully");
        
    } catch (error) {
        console.error("❌ Server sync failed:", error);
        updateSyncStatus(`Sync failed: ${error.message}`);
        showMessage(`Server sync failed: ${error.message}`, "error");
    } finally {
        serverSyncState.isSyncing = false;
    }
}

// � Fetch quotes specifically from server (alias for fetchDataFromServer)
async function fetchQuotesFromServer() {
    console.log("📥 Fetching quotes from server...");
    return await fetchDataFromServer();
}

// �📤 Send data to server (simulate with JSONPlaceholder)
async function sendDataToServer(quote) {
    if (!serverSyncState.isOnline) {
        // Queue for later sync
        serverSyncState.pendingChanges.push({
            action: 'create',
            data: quote,
            timestamp: new Date().toISOString()
        });
        console.log("📋 Change queued for later sync:", quote);
        return;
    }
    
    try {
        console.log("📤 Sending data to server...", quote);
        
        // Simulate posting to server using JSONPlaceholder
        const response = await fetch(`${SERVER_CONFIG.BASE_URL}${SERVER_CONFIG.ENDPOINTS.POSTS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: quote.text,
                body: `Author: ${quote.author}, Category: ${quote.category}`,
                userId: 1
            }),
            signal: AbortSignal.timeout(SERVER_CONFIG.TIMEOUT)
        });
        
        if (!response.ok) {
            throw new Error(`Server response: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("✅ Data sent to server successfully:", result);
        
        // Update quote with server ID
        quote.serverId = result.id;
        quote.lastModified = new Date().toISOString();
        
        updateSyncStatus("Data synced to server");
        
    } catch (error) {
        console.error("❌ Failed to send data to server:", error);
        
        // Queue for retry
        serverSyncState.pendingChanges.push({
            action: 'create',
            data: quote,
            timestamp: new Date().toISOString()
        });
        
        updateSyncStatus(`Upload failed: ${error.message}`);
    }
}

// ⚖️ Handle data conflicts between local and server
async function handleDataConflicts(serverQuotes) {
    console.log("⚖️ Checking for data conflicts...");
    
    const localQuotes = quotes.filter(q => q.source !== 'server');
    const conflictsDetected = [];
    let mergeStrategy = serverSyncState.conflictResolution;
    
    // Generate server data hash for change detection
    const serverDataHash = generateDataHash(serverQuotes);
    const hasServerDataChanged = serverSyncState.lastServerDataHash !== serverDataHash;
    
    if (hasServerDataChanged) {
        console.log("🔄 Server data has changed since last sync");
        serverSyncState.lastServerDataHash = serverDataHash;
        serverSyncState.syncStats.dataChangesDetected++;
    }
    
    // Store server data in cache
    serverSyncState.serverDataCache = serverQuotes;
    
    // Check for conflicts (same ID but different content)
    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(q => q.id === serverQuote.id || q.serverId === serverQuote.serverId);
        
        if (localQuote && (
            localQuote.text !== serverQuote.text ||
            localQuote.author !== serverQuote.author ||
            localQuote.category !== serverQuote.category
        )) {
            conflictsDetected.push({
                local: localQuote,
                server: serverQuote,
                type: 'content_conflict'
            });
        }
    });
    
    if (conflictsDetected.length > 0) {
        console.log(`⚠️ ${conflictsDetected.length} conflicts detected`);
        serverSyncState.syncStats.conflictsDetected += conflictsDetected.length;
        await resolveConflicts(conflictsDetected);
    }
    
    // Merge server quotes
    const mergedQuotes = await mergeServerData(serverQuotes);
    
    // Update local storage
    saveQuotesToStorage();
    
    // Refresh display
    populateCategories();
    updateDisplay();
    
    console.log("✅ Data conflicts resolved and merged");
}

// 🔄 Start continuous data sync checking
function startDataSyncChecking() {
    if (serverSyncState.dataCheckInterval) {
        clearInterval(serverSyncState.dataCheckInterval);
    }
    
    serverSyncState.dataCheckInterval = setInterval(async () => {
        if (serverSyncState.isOnline && !serverSyncState.isSyncing) {
            console.log("🔍 Checking for server data changes...");
            await checkServerDataChanges();
        }
    }, SERVER_CONFIG.SYNC_CHECK_INTERVAL);
    
    console.log(`🔄 Started data sync checking every ${SERVER_CONFIG.SYNC_CHECK_INTERVAL / 1000} seconds`);
}

// 🔍 Check for server data changes without full sync
async function checkServerDataChanges() {
    try {
        const response = await fetch(`${SERVER_CONFIG.BASE_URL}${SERVER_CONFIG.ENDPOINTS.POSTS}`, {
            method: 'HEAD', // Just check headers
            signal: AbortSignal.timeout(5000) // Shorter timeout for checks
        });
        
        if (response.ok) {
            // Perform a quick data check
            const quickResponse = await fetch(`${SERVER_CONFIG.BASE_URL}${SERVER_CONFIG.ENDPOINTS.POSTS}?_limit=1`, {
                signal: AbortSignal.timeout(5000)
            });
            
            if (quickResponse.ok) {
                const quickData = await quickResponse.json();
                const quickHash = generateDataHash(quickData);
                
                // Compare with stored hash to detect changes
                if (serverSyncState.lastQuickHash && serverSyncState.lastQuickHash !== quickHash) {
                    console.log("🔄 Server data changed - triggering sync...");
                    await fetchDataFromServer();
                }
                
                serverSyncState.lastQuickHash = quickHash;
            }
        }
    } catch (error) {
        console.log("🔍 Quick server check failed:", error.message);
        // Don't show error to user for background checks
    }
}

// 🔢 Generate hash for data comparison
function generateDataHash(data) {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    
    for (let i = 0; i < dataString.length; i++) {
        const char = dataString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString();
}

// 🔧 Resolve conflicts based on strategy
async function resolveConflicts(conflicts) {
    console.log(`🔧 Resolving ${conflicts.length} conflicts using strategy: ${serverSyncState.conflictResolution}`);
    
    conflicts.forEach(conflict => {
        const { local, server } = conflict;
        
        switch (serverSyncState.conflictResolution) {
            case 'client-wins':
                console.log("📱 Client wins - keeping local version");
                // Keep local version, mark server quote with different ID
                server.id = `${server.id}_server_copy`;
                serverSyncState.syncStats.clientWins++;
                break;
                
            case 'server-wins':
                console.log("🌐 Server wins - accepting server version");
                // Replace local with server version (Step 2 requirement)
                const localIndex = quotes.findIndex(q => q.id === local.id);
                if (localIndex !== -1) {
                    quotes[localIndex] = { 
                        ...server, 
                        id: local.id, // Keep original local ID
                        lastModified: new Date().toISOString(),
                        resolvedConflict: true
                    };
                    console.log(`🌐 Server data takes precedence for quote: ${server.text.substring(0, 30)}...`);
                }
                serverSyncState.syncStats.serverWins++;
                break;
                
            case 'merge':
                console.log("🔀 Merging versions");
                // Create merged version with timestamp suffix
                const mergedQuote = {
                    ...local,
                    text: `${local.text} [Merged with: ${server.text}]`,
                    lastModified: new Date().toISOString(),
                    mergedFrom: [local.id, server.id],
                    resolvedConflict: true
                };
                
                const mergeIndex = quotes.findIndex(q => q.id === local.id);
                if (mergeIndex !== -1) {
                    quotes[mergeIndex] = mergedQuote;
                }
                serverSyncState.syncStats.merged++;
                break;
        }
    });
    
    updateSyncStatus(`Resolved ${conflicts.length} conflicts using ${serverSyncState.conflictResolution} strategy`);
}

// 🔀 Merge server data with local data
async function mergeServerData(serverQuotes) {
    console.log("🔀 Merging server data with local data...");
    
    serverQuotes.forEach(serverQuote => {
        const existingQuoteIndex = quotes.findIndex(q => 
            q.id === serverQuote.id || 
            q.serverId === serverQuote.serverId ||
            (q.text === serverQuote.text && q.author === serverQuote.author)
        );
        
        if (existingQuoteIndex === -1) {
            // New quote from server - add it
            quotes.push(serverQuote);
            console.log("➕ Added new quote from server:", serverQuote.text.substring(0, 30) + "...");
        } else {
            // Quote exists - update timestamp
            quotes[existingQuoteIndex].lastModified = new Date().toISOString();
            console.log("🔄 Updated existing quote from server");
        }
    });
    
    return quotes;
}

// 📊 Update sync status display
function updateSyncStatus(status) {
    const statusElement = document.getElementById('syncStatus');
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.style.color = status.includes('failed') || status.includes('error') ? '#dc3545' : '#28a745';
    }
    
    updateLastAction(`Sync: ${status}`);
    console.log(`📊 Sync status: ${status}`);
}

// 🌐 Handle online event
function handleOnlineEvent() {
    console.log("🌐 Connection restored - going online");
    serverSyncState.isOnline = true;
    updateSyncStatus("Online - sync active");
    
    // Resume periodic sync
    startPeriodicSync();
    
    // Process pending changes
    processPendingChanges();
    
    showMessage("Connection restored! Syncing data...", "success");
}

// 📵 Handle offline event
function handleOfflineEvent() {
    console.log("📵 Connection lost - going offline");
    serverSyncState.isOnline = false;
    updateSyncStatus("Offline - changes queued");
    
    // Stop periodic sync
    stopPeriodicSync();
    
    showMessage("You're offline. Changes will sync when connection is restored.", "error");
}

// ⏰ Start periodic synchronization
function startPeriodicSync() {
    if (serverSyncState.syncInterval) {
        clearInterval(serverSyncState.syncInterval);
    }
    
    serverSyncState.syncInterval = setInterval(() => {
        console.log("⏰ Periodic sync triggered");
        fetchDataFromServer();
    }, SERVER_CONFIG.SYNC_INTERVAL);
    
    console.log(`⏰ Periodic sync started (${SERVER_CONFIG.SYNC_INTERVAL}ms interval)`);
}

// ⏹️ Stop periodic synchronization
function stopPeriodicSync() {
    if (serverSyncState.syncInterval) {
        clearInterval(serverSyncState.syncInterval);
        serverSyncState.syncInterval = null;
        console.log("⏹️ Periodic sync stopped");
    }
}

// 📋 Process pending changes when back online
async function processPendingChanges() {
    if (serverSyncState.pendingChanges.length === 0) {
        console.log("📋 No pending changes to process");
        return;
    }
    
    console.log(`📋 Processing ${serverSyncState.pendingChanges.length} pending changes...`);
    
    for (const change of serverSyncState.pendingChanges) {
        try {
            await sendDataToServer(change.data);
        } catch (error) {
            console.error("❌ Failed to process pending change:", error);
        }
    }
    
    // Clear processed changes
    serverSyncState.pendingChanges = [];
    console.log("✅ All pending changes processed");
}

// 📡 Update online status
function updateOnlineStatus() {
    serverSyncState.isOnline = navigator.onLine;
    const status = serverSyncState.isOnline ? "Online" : "Offline";
    updateSyncStatus(status);
    console.log(`📡 Network status: ${status}`);
}

// 🔄 Manual sync trigger
function triggerManualSync() {
    console.log("🔄 Manual sync triggered by user");
    updateSyncStatus("Manual sync in progress...");
    fetchDataFromServer();
}

// ⚙️ Change conflict resolution strategy
function setConflictResolutionStrategy(strategy) {
    if (['client-wins', 'server-wins', 'merge'].includes(strategy)) {
        serverSyncState.conflictResolution = strategy;
        localStorage.setItem('conflictResolution', strategy);
        console.log(`⚙️ Conflict resolution strategy set to: ${strategy}`);
        showMessage(`Conflict resolution set to: ${strategy}`, "success");
    } else {
        console.error("❌ Invalid conflict resolution strategy:", strategy);
    }
}

// 📊 Display sync statistics
function displaySyncStatistics() {
    const statsDiv = document.getElementById('syncStats');
    if (!statsDiv) return;
    
    // Update statistics display
    const totalSyncsEl = document.getElementById('totalSyncs');
    const conflictsCountEl = document.getElementById('conflictsCount');
    const serverWinsCountEl = document.getElementById('serverWinsCount');
    const dataChangesCountEl = document.getElementById('dataChangesCount');
    
    if (totalSyncsEl) totalSyncsEl.textContent = serverSyncState.syncStats.totalSyncs;
    if (conflictsCountEl) conflictsCountEl.textContent = serverSyncState.syncStats.conflictsDetected;
    if (serverWinsCountEl) serverWinsCountEl.textContent = serverSyncState.syncStats.serverWins;
    if (dataChangesCountEl) dataChangesCountEl.textContent = serverSyncState.syncStats.dataChangesDetected;
    
    // Toggle visibility
    if (statsDiv.classList.contains('hidden')) {
        statsDiv.classList.remove('hidden');
        console.log("📊 Displaying sync statistics");
    } else {
        statsDiv.classList.add('hidden');
        console.log("📊 Hiding sync statistics");
    }
}
}

// 🚀 Initialize the app when page loads
window.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Initializing Quote Generator with Step 3 conflict resolution...");
    loadQuotesFromStorage();
    updateDisplay();
    
    // Check quotes array structure
    checkQuotesArrayStructure();
    
    // Populate category dropdown
    populateCategories();
    
    // Load conflict history from localStorage
    const savedHistory = localStorage.getItem('conflictHistory');
    if (savedHistory) {
        try {
            conflictHistory = JSON.parse(savedHistory);
            console.log(`📋 Loaded ${conflictHistory.length} conflict history items`);
        } catch (error) {
            console.error("❌ Error loading conflict history:", error);
            conflictHistory = [];
        }
    }
    
    // Initialize server synchronization
    initializeServerSync();
    
    // Set up modern event listeners
    setupEventListeners();
    
    // Run initial smoke test to verify functionality
    setTimeout(async () => {
        console.log("🧪 Running initial smoke test...");
        const smokeTestPassed = await testSuite.runSmokeTests();
        
        if (smokeTestPassed) {
            showAdvancedNotification(
                "System Verification",
                "All essential functions verified ✅",
                "success",
                3000
            );
        } else {
            showAdvancedNotification(
                "System Warning",
                "Some functions may not be working correctly ⚠️",
                "warning",
                5000
            );
        }
    }, 2000);
    
    // Show welcome notification using new system
    showAdvancedNotification(
        "Welcome to Quote Generator!",
        "App loaded successfully with enhanced conflict resolution system.",
        "success",
        4000
    );
    
    console.log("✅ Quote Generator initialized successfully with Step 3 features");
});

// 🎯 Set up modern event listeners (alternative to inline onclick)
function setupEventListeners() {
    // Get buttons and add event listeners
    const randomQuoteBtn = document.querySelector('button[onclick*="getRandomQuote"]');
    const addQuoteBtn = document.querySelector('button[onclick*="showAddForm"]');
    const exportBtn = document.querySelector('button[onclick*="exportQuotes"]');
    const clearBtn = document.querySelector('button[onclick*="clearAllQuotes"]');
    
    // Add event listeners if buttons exist (as backup to inline handlers)
    if (randomQuoteBtn) {
        randomQuoteBtn.addEventListener('click', function(e) {
            console.log("🎲 Random quote button clicked via addEventListener");
            // onclick handler will still fire, but this demonstrates addEventListener
        });
    }
    
    if (addQuoteBtn) {
        addQuoteBtn.addEventListener('click', function(e) {
            console.log("➕ Add quote button clicked via addEventListener");
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
            console.log("💾 Export button clicked via addEventListener");
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            console.log("🗑️ Clear button clicked via addEventListener");
        });
    }
    
    // Add keyboard shortcuts using addEventListener
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + R for random quote
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            getRandomQuote();
            console.log("⌨️ Keyboard shortcut: Random quote (Ctrl+R)");
        }
        
        // Ctrl/Cmd + A for add quote
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            showAddForm();
            console.log("⌨️ Keyboard shortcut: Add quote (Ctrl+A)");
        }
        
        // Escape to hide form
        if (e.key === 'Escape') {
            const form = document.getElementById('addQuoteForm');
            if (form && form.style.display !== 'none') {
                hideAddForm();
                console.log("⌨️ Keyboard shortcut: Hide form (Escape)");
            }
        }
    });
    
    // Add window resize listener
    window.addEventListener('resize', function() {
        console.log("📱 Window resized, checking responsive layout");
        // Could add responsive adjustments here
    });
    
    console.log("🎯 Event listeners set up successfully");
}

// 🎲 Get a random quote and display it
function getRandomQuote() {
    if (quotes.length === 0) {
        showMessage("No quotes available! Add some quotes first.", "error");
        return;
    }

    // DOM Manipulation: Select random quote
    currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[currentQuoteIndex];

    // Use centralized quote display function
    const displaySuccess = quoteDisplay(selectedQuote, "random");
    
    if (displaySuccess) {
        updateLastAction("Showed random quote");
        console.log("🎲 Random quote selected and displayed");
    }
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
    
    // Use centralized quote display function
    const displaySuccess = quoteDisplay(selectedQuote, `category: ${category}`);
    
    if (displaySuccess) {
        updateLastAction(`Showed ${category} quote`);
        console.log(`🎯 Category quote selected and displayed (${category})`);
    }
}

// 🏷️ Populate categories dropdown dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // Extract unique categories from quotes
    const categories = [...new Set(quotes
        .filter(quote => quote.category && quote.category.trim() !== '')
        .map(quote => quote.category.toLowerCase())
    )].sort();
    
    // Clear existing options except "All Categories"
    const allOption = categoryFilter.querySelector('option[value="all"]');
    categoryFilter.innerHTML = '';
    categoryFilter.appendChild(allOption);
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
    
    // Restore last selected filter from localStorage
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter && categoryFilter.querySelector(`option[value="${lastFilter}"]`)) {
        categoryFilter.value = lastFilter;
        filterQuotes(); // Apply the saved filter
    }
    
    console.log(`🏷️ Populated ${categories.length} categories in dropdown`);
}

// 🔍 Filter quotes based on selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const filterStatus = document.getElementById('filterStatus');
    
    if (!categoryFilter) return;
    
    const selectedCategory = categoryFilter.value;
    
    // Save the selected filter to localStorage
    localStorage.setItem('lastCategoryFilter', selectedCategory);
    
    let filteredQuotes;
    
    if (selectedCategory === 'all') {
        filteredQuotes = quotes;
        filterStatus.textContent = `Showing all ${quotes.length} quotes`;
    } else {
        filteredQuotes = quotes.filter(quote => 
            quote.category && quote.category.toLowerCase() === selectedCategory.toLowerCase()
        );
        const categoryName = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        filterStatus.textContent = `Showing ${filteredQuotes.length} quotes in "${categoryName}"`;
    }
    
    // Update the displayed quotes list
    updateDisplayWithFilteredQuotes(filteredQuotes);
    
    console.log(`🔍 Filtered quotes: ${filteredQuotes.length} out of ${quotes.length} total`);
    updateLastAction(`Filtered by category: ${selectedCategory}`);
}

// 📋 Update display with filtered quotes
function updateDisplayWithFilteredQuotes(filteredQuotes) {
    const allQuotesDiv = document.getElementById('allQuotes');
    
    if (!allQuotesDiv) return;
    
    if (filteredQuotes.length === 0) {
        allQuotesDiv.innerHTML = '<p style="text-align: center; color: #666;">No quotes found for the selected category.</p>';
        return;
    }
    
    // Create HTML for filtered quotes
    let quotesHTML = '';
    filteredQuotes.forEach((quote, originalIndex) => {
        // Find original index in the full quotes array
        const realIndex = quotes.findIndex(q => q === quote);
        
        quotesHTML += `
            <div class="quote-item">
                <div class="quote-text">"${quote.text}"</div>
                <div class="quote-author">- ${quote.author}</div>
                <div class="quote-category">Category: ${quote.category || 'Uncategorized'}</div>
                <div class="quote-actions">
                    <button onclick="showSpecificQuote(${realIndex})" style="margin: 5px; padding: 5px 10px; font-size: 0.9rem;">Show This Quote</button>
                    <button onclick="deleteQuote(${realIndex})" style="margin: 5px; padding: 5px 10px; font-size: 0.9rem; background: #dc3545;">Delete</button>
                </div>
            </div>
        `;
    });
    
    allQuotesDiv.innerHTML = quotesHTML;
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

// 🎯 Example function: Create buttons with addEventListener (educational)
function createButtonWithEventListener(text, clickHandler, className = '') {
    // Create button element
    const button = document.createElement('button');
    button.textContent = text;
    
    // Add CSS class if provided
    if (className) {
        button.className = className;
    }
    
    // Use addEventListener instead of onclick
    button.addEventListener('click', function(event) {
        console.log(`🎯 Button "${text}" clicked via addEventListener`);
        
        // Call the provided handler function
        if (typeof clickHandler === 'function') {
            clickHandler(event);
        }
    });
    
    // Add hover effect with addEventListener
    button.addEventListener('mouseenter', function() {
        button.style.transform = 'scale(1.05)';
        console.log(`🐭 Mouse entered button: ${text}`);
    });
    
    button.addEventListener('mouseleave', function() {
        button.style.transform = 'scale(1)';
        console.log(`🐭 Mouse left button: ${text}`);
    });
    
    return button;
}

// 🎨 Create enhanced form with addEventListener
function createEnhancedAddForm() {
    // Check if enhanced form already exists
    if (document.getElementById('enhancedAddForm')) {
        console.log("Enhanced form already exists");
        return;
    }
    
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.id = 'enhancedAddForm';
    formContainer.className = 'add-quote hidden';
    
    // Create form title
    const title = document.createElement('h3');
    title.textContent = '✨ Enhanced Add Quote Form (with addEventListener)';
    formContainer.appendChild(title);
    
    // Create input elements with addEventListener
    const quoteInput = document.createElement('textarea');
    quoteInput.id = 'enhancedQuoteText';
    quoteInput.placeholder = 'Enter your quote here...';
    
    // Add real-time character count with addEventListener
    const charCount = document.createElement('div');
    charCount.style.fontSize = '0.9rem';
    charCount.style.color = '#666';
    charCount.textContent = '0 characters';
    
    quoteInput.addEventListener('input', function() {
        const length = quoteInput.value.length;
        charCount.textContent = `${length} characters`;
        charCount.style.color = length > 200 ? '#dc3545' : '#666';
    });
    
    // Create buttons with addEventListener
    const saveBtn = createButtonWithEventListener('💾 Save Quote', function() {
        console.log("Enhanced save button clicked!");
        // Could call addQuote() or enhanced version
    });
    
    const cancelBtn = createButtonWithEventListener('❌ Cancel', function() {
        formContainer.style.display = 'none';
    });
    
    // Append elements
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(charCount);
    formContainer.appendChild(saveBtn);
    formContainer.appendChild(cancelBtn);
    
    // Add to page
    const container = document.querySelector('.container');
    if (container) {
        container.appendChild(formContainer);
    }
    
    console.log("✨ Enhanced form with addEventListener created");
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
    
    // Update categories dropdown if new category was added
    populateCategories();
    
    // Update the display
    updateDisplay();
    hideAddForm();
    
    // Sync with server
    sendDataToServer(newQuote);
    
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
            
            // Update categories dropdown with potentially new categories
            populateCategories();
            
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

    // Check if there's an active filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && categoryFilter.value && categoryFilter.value !== 'all') {
        // Apply current filter instead of showing all quotes
        filterQuotes();
        return;
    }

    // Update all quotes display (no filter active)
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
    if (index < 0 || index >= quotes.length) {
        showMessage("Invalid quote index", "error");
        return;
    }
    
    const quote = quotes[index];
    
    // Use centralized quote display function
    const displaySuccess = quoteDisplay(quote, `specific: ${index}`);
    
    if (displaySuccess) {
        // Scroll to top to see the quote
        const quoteDisplayElement = document.querySelector('.quote-display');
        if (quoteDisplayElement) {
            quoteDisplayElement.scrollIntoView({ behavior: 'smooth' });
        }
        updateLastAction("Showed specific quote");
    }
}

// � Restore last viewed quote from session storage
function restoreLastViewedQuote() {
    try {
        const lastQuote = sessionStorage.getItem('lastViewedQuote');
        const lastContext = sessionStorage.getItem('lastDisplayContext');
        
        if (lastQuote) {
            const quote = JSON.parse(lastQuote);
            const context = lastContext || "restored";
            
            const displaySuccess = quoteDisplay(quote, `${context} (restored)`);
            
            if (displaySuccess) {
                console.log("🔄 Last viewed quote restored from session storage");
                updateLastAction("Restored last viewed quote");
                return true;
            }
        }
    } catch (error) {
        console.error("❌ Error restoring last viewed quote:", error);
    }
    
    return false;
}

// �🗑️ Delete a specific quote
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

// 📝 Enhanced showMessage function with new notification system
function showMessage(message, type = "info", useAdvanced = true) {
    // Use new advanced notification system if available
    if (useAdvanced && document.getElementById('notificationContainer')) {
        const typeMapping = {
            "error": "error",
            "success": "success", 
            "info": "info",
            "warning": "warning"
        };
        
        const title = type.charAt(0).toUpperCase() + type.slice(1);
        showAdvancedNotification(title, message, typeMapping[type] || "info");
        return;
    }
    
    // Fallback to original implementation
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

// Make server sync functions available globally
window.fetchQuotesFromServer = fetchQuotesFromServer;

// 🔔 STEP 3: CONFLICT RESOLUTION & NOTIFICATION SYSTEM
// ====================================================

// 🔔 Enhanced notification system with multiple types
function showAdvancedNotification(title, message, type = 'info', duration = 5000, actions = []) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const notificationId = Date.now().toString();
    notification.setAttribute('data-id', notificationId);
    
    let actionsHTML = '';
    if (actions.length > 0) {
        actionsHTML = `
            <div class="notification-actions">
                ${actions.map(action => 
                    `<button onclick="${action.callback}('${notificationId}')" class="notification-action-btn ${action.class || ''}">${action.text}</button>`
                ).join('')}
            </div>
        `;
    }
    
    notification.innerHTML = `
        <div class="notification-title">
            ${getNotificationIcon(type)} ${title}
            <button class="notification-close" onclick="closeNotification('${notificationId}')">×</button>
        </div>
        <div class="notification-body">${message}</div>
        ${actionsHTML}
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after duration (unless it's a conflict notification)
    if (type !== 'conflict' && duration > 0) {
        setTimeout(() => closeNotification(notificationId), duration);
    }
    
    console.log(`🔔 Notification shown: ${type} - ${title}`);
    return notificationId;
}

// 🎯 Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        conflict: '⚔️',
        sync: '🔄'
    };
    return icons[type] || 'ℹ️';
}

// ❌ Close notification
function closeNotification(notificationId) {
    const notification = document.querySelector(`[data-id="${notificationId}"]`);
    if (notification) {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }
}

// ⚔️ Show conflict detection notification with manual resolution option
function showConflictNotification(conflicts) {
    const conflictCount = conflicts.length;
    const actions = [
        {
            text: '🛠️ Resolve Manually',
            callback: 'openConflictModal',
            class: 'manual-resolve-btn'
        },
        {
            text: '🌐 Auto-Resolve (Server Wins)',
            callback: 'autoResolveConflicts',
            class: 'auto-resolve-btn'
        }
    ];
    
    const notificationId = showAdvancedNotification(
        'Data Conflicts Detected',
        `Found ${conflictCount} conflict${conflictCount > 1 ? 's' : ''} between local and server data. Choose how to resolve them.`,
        'conflict',
        0, // Don't auto-dismiss conflict notifications
        actions
    );
    
    // Store conflicts for manual resolution
    pendingConflicts = conflicts;
    
    return notificationId;
}

// 🛠️ Open conflict resolution modal
function openConflictModal(notificationId = null) {
    if (pendingConflicts.length === 0) {
        showAdvancedNotification('No Conflicts', 'No pending conflicts to resolve.', 'info');
        return;
    }
    
    const modal = document.getElementById('conflictModal');
    const conflictMessage = document.getElementById('conflictMessage');
    const localData = document.getElementById('localConflictData');
    const serverData = document.getElementById('serverConflictData');
    
    if (!modal) return;
    
    // Display first conflict (for simplicity, we'll handle one at a time)
    const conflict = pendingConflicts[0];
    
    conflictMessage.textContent = `Conflict ${pendingConflicts.length > 1 ? '1 of ' + pendingConflicts.length : ''}: Different versions detected`;
    
    localData.innerHTML = `
        <p><strong>Text:</strong> "${conflict.local.text}"</p>
        <p><strong>Author:</strong> ${conflict.local.author}</p>
        <p><strong>Category:</strong> ${conflict.local.category}</p>
        <p><strong>Last Modified:</strong> ${conflict.local.lastModified || 'Unknown'}</p>
    `;
    
    serverData.innerHTML = `
        <p><strong>Text:</strong> "${conflict.server.text}"</p>
        <p><strong>Author:</strong> ${conflict.server.author}</p>
        <p><strong>Category:</strong> ${conflict.server.category}</p>
        <p><strong>Source:</strong> Server</p>
    `;
    
    modal.classList.remove('hidden');
    
    // Close the notification if provided
    if (notificationId) {
        closeNotification(notificationId);
    }
    
    console.log("🛠️ Conflict resolution modal opened");
}

// ❌ Close conflict modal
function closeConflictModal() {
    const modal = document.getElementById('conflictModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    console.log("❌ Conflict resolution modal closed");
}

// 🔧 Manual conflict resolution
function resolveConflictManually(resolution) {
    if (pendingConflicts.length === 0) {
        showAdvancedNotification('No Conflicts', 'No conflicts to resolve.', 'warning');
        return;
    }
    
    const conflict = pendingConflicts[0];
    let resolvedQuote;
    let resolutionMessage;
    
    switch (resolution) {
        case 'keep-local':
            resolvedQuote = conflict.local;
            resolutionMessage = 'Local version kept';
            console.log("📱 Manual resolution: Keeping local version");
            break;
            
        case 'accept-server':
            resolvedQuote = { ...conflict.server, id: conflict.local.id };
            resolutionMessage = 'Server version accepted';
            console.log("🌐 Manual resolution: Accepting server version");
            break;
            
        case 'merge-both':
            resolvedQuote = {
                ...conflict.local,
                text: `${conflict.local.text} [Merged with: ${conflict.server.text}]`,
                lastModified: new Date().toISOString(),
                mergedFrom: [conflict.local.id, conflict.server.id],
                manuallyResolved: true
            };
            resolutionMessage = 'Versions merged manually';
            console.log("🔀 Manual resolution: Merging both versions");
            break;
            
        default:
            console.error("❌ Invalid resolution type:", resolution);
            return;
    }
    
    // Apply the resolution
    const quoteIndex = quotes.findIndex(q => q.id === conflict.local.id);
    if (quoteIndex !== -1) {
        quotes[quoteIndex] = resolvedQuote;
    }
    
    // Add to conflict history
    addToConflictHistory(conflict, resolution, resolutionMessage);
    
    // Remove from pending conflicts
    pendingConflicts.shift();
    
    // Update storage and display
    saveQuotesToStorage();
    updateDisplay();
    populateCategories();
    
    // Show success notification
    showAdvancedNotification(
        'Conflict Resolved',
        `${resolutionMessage}. ${pendingConflicts.length} conflict${pendingConflicts.length !== 1 ? 's' : ''} remaining.`,
        'success'
    );
    
    // Close modal and handle remaining conflicts
    closeConflictModal();
    
    if (pendingConflicts.length > 0) {
        setTimeout(() => openConflictModal(), 500);
    } else {
        showAdvancedNotification('All Conflicts Resolved', 'All data conflicts have been successfully resolved.', 'success');
    }
}

// 🤖 Auto-resolve all conflicts using server-wins strategy
function autoResolveConflicts(notificationId = null) {
    if (pendingConflicts.length === 0) {
        showAdvancedNotification('No Conflicts', 'No conflicts to resolve.', 'warning');
        return;
    }
    
    const conflictCount = pendingConflicts.length;
    
    pendingConflicts.forEach(conflict => {
        // Apply server-wins resolution
        const quoteIndex = quotes.findIndex(q => q.id === conflict.local.id);
        if (quoteIndex !== -1) {
            quotes[quoteIndex] = { 
                ...conflict.server, 
                id: conflict.local.id,
                autoResolved: true,
                lastModified: new Date().toISOString()
            };
        }
        
        // Add to conflict history
        addToConflictHistory(conflict, 'server-wins', 'Auto-resolved (server wins)');
    });
    
    // Clear pending conflicts
    pendingConflicts = [];
    
    // Update storage and display
    saveQuotesToStorage();
    updateDisplay();
    populateCategories();
    
    // Update sync statistics
    serverSyncState.syncStats.serverWins += conflictCount;
    
    // Close notification and show success
    if (notificationId) {
        closeNotification(notificationId);
    }
    
    showAdvancedNotification(
        'Conflicts Auto-Resolved',
        `${conflictCount} conflict${conflictCount !== 1 ? 's' : ''} automatically resolved using server-wins strategy.`,
        'success'
    );
    
    console.log(`🤖 Auto-resolved ${conflictCount} conflicts using server-wins strategy`);
}

// 📋 Add conflict to history
function addToConflictHistory(conflict, resolution, message) {
    const historyItem = {
        timestamp: new Date().toISOString(),
        conflictType: conflict.type || 'content_conflict',
        resolution: resolution,
        message: message,
        localQuote: {
            text: conflict.local.text.substring(0, 50) + '...',
            author: conflict.local.author
        },
        serverQuote: {
            text: conflict.server.text.substring(0, 50) + '...',
            author: conflict.server.author
        }
    };
    
    conflictHistory.unshift(historyItem);
    
    // Keep only last 20 conflicts
    if (conflictHistory.length > 20) {
        conflictHistory = conflictHistory.slice(0, 20);
    }
    
    // Save to localStorage
    localStorage.setItem('conflictHistory', JSON.stringify(conflictHistory));
    
    console.log("📋 Added conflict to history:", historyItem);
}

// 📋 Toggle conflict history panel
function toggleConflictHistory() {
    const historyPanel = document.getElementById('conflictHistory');
    if (!historyPanel) return;
    
    if (historyPanel.classList.contains('hidden')) {
        // Load conflict history from storage
        const savedHistory = localStorage.getItem('conflictHistory');
        if (savedHistory) {
            conflictHistory = JSON.parse(savedHistory);
        }
        
        displayConflictHistory();
        historyPanel.classList.remove('hidden');
        
        const toggleBtn = historyPanel.querySelector('.toggle-btn');
        if (toggleBtn) toggleBtn.textContent = 'Hide';
        
        console.log("📋 Conflict history panel shown");
    } else {
        historyPanel.classList.add('hidden');
        
        const toggleBtn = historyPanel.querySelector('.toggle-btn');
        if (toggleBtn) toggleBtn.textContent = 'Show';
        
        console.log("📋 Conflict history panel hidden");
    }
}

// 📄 Display conflict history
function displayConflictHistory() {
    const historyList = document.getElementById('conflictHistoryList');
    if (!historyList) return;
    
    if (conflictHistory.length === 0) {
        historyList.innerHTML = '<p class="no-conflicts">No conflicts detected yet.</p>';
        return;
    }
    
    const historyHTML = conflictHistory.map((item, index) => `
        <div class="conflict-item">
            <div class="conflict-item-header">
                Conflict #${conflictHistory.length - index} - ${item.resolution.replace('-', ' ').toUpperCase()}
            </div>
            <div class="conflict-item-details">
                <strong>When:</strong> ${new Date(item.timestamp).toLocaleString()}<br>
                <strong>Resolution:</strong> ${item.message}<br>
                <strong>Local:</strong> "${item.localQuote.text}" by ${item.localQuote.author}<br>
                <strong>Server:</strong> "${item.serverQuote.text}" by ${item.serverQuote.author}
            </div>
        </div>
    `).join('');
    
    historyList.innerHTML = historyHTML;
}

// 🔄 Override the existing handleDataConflicts to use new notification system
async function handleDataConflictsWithNotifications(serverQuotes) {
    console.log("⚖️ Checking for data conflicts with notification support...");
    
    const localQuotes = quotes.filter(q => q.source !== 'server');
    const conflictsDetected = [];
    let mergeStrategy = serverSyncState.conflictResolution;
    
    // Generate server data hash for change detection
    const serverDataHash = generateDataHash(serverQuotes);
    const hasServerDataChanged = serverSyncState.lastServerDataHash !== serverDataHash;
    
    if (hasServerDataChanged) {
        console.log("🔄 Server data has changed since last sync");
        serverSyncState.lastServerDataHash = serverDataHash;
        serverSyncState.syncStats.dataChangesDetected++;
        
        // Show notification about server data changes
        showAdvancedNotification(
            'Server Data Updated',
            'New data detected on server. Checking for conflicts...',
            'sync',
            3000
        );
    }
    
    // Store server data in cache
    serverSyncState.serverDataCache = serverQuotes;
    
    // Check for conflicts (same ID but different content)
    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(q => q.id === serverQuote.id || q.serverId === serverQuote.serverId);
        
        if (localQuote && (
            localQuote.text !== serverQuote.text ||
            localQuote.author !== serverQuote.author ||
            localQuote.category !== serverQuote.category
        )) {
            conflictsDetected.push({
                local: localQuote,
                server: serverQuote,
                type: 'content_conflict'
            });
        }
    });
    
    if (conflictsDetected.length > 0) {
        console.log(`⚠️ ${conflictsDetected.length} conflicts detected`);
        serverSyncState.syncStats.conflictsDetected += conflictsDetected.length;
        
        // Show conflict notification with resolution options
        showConflictNotification(conflictsDetected);
        
        // If auto-resolution is enabled (server-wins), resolve automatically after a delay
        if (mergeStrategy === 'server-wins') {
            setTimeout(() => {
                if (pendingConflicts.length > 0) {
                    showAdvancedNotification(
                        'Auto-Resolving Conflicts',
                        'Using server-wins strategy as configured...',
                        'info',
                        2000
                    );
                    setTimeout(() => autoResolveConflicts(), 2000);
                }
            }, 3000);
        }
    } else {
        // No conflicts - show success notification
        showAdvancedNotification(
            'Sync Completed',
            'Data synchronized successfully with no conflicts.',
            'success',
            3000
        );
    }
    
    // Merge server quotes (non-conflicting ones)
    const mergedQuotes = await mergeServerData(serverQuotes);
    
    // Update local storage
    saveQuotesToStorage();
    
    // Refresh display
    populateCategories();
    updateDisplay();
    
    console.log("✅ Data conflicts handled with notifications");
}

// Replace the original handleDataConflicts function call
const originalHandleDataConflicts = handleDataConflicts;
handleDataConflicts = handleDataConflictsWithNotifications;

// 🧪 STEP 4: TESTING AND VERIFICATION UI CONTROLS
// ===============================================

// Toggle testing panel visibility
function toggleTestingPanel() {
    const panel = document.getElementById('testingContent');
    const toggleBtn = document.getElementById('testToggleBtn');
    
    if (!panel || !toggleBtn) return;
    
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        toggleBtn.textContent = 'Hide';
        console.log("🧪 Testing panel shown");
    } else {
        panel.classList.add('hidden');
        toggleBtn.textContent = 'Show';
        console.log("🧪 Testing panel hidden");
    }
}

// Show test report in UI
function showTestReport() {
    const report = getTestReport();
    const output = document.getElementById('testOutput');
    
    if (!output) return;
    
    if (!report) {
        output.textContent = "No test report available. Run tests first.";
        return;
    }
    
    const reportText = `TEST REPORT - ${new Date(report.timestamp).toLocaleString()}
===============================================
Total Tests: ${report.summary.totalTests}
Passed: ${report.summary.passedTests} (${report.summary.passRate})
Failed: ${report.summary.failedTests}

DETAILED RESULTS:
${report.results.map(r => `${r.passed ? '✅' : '❌'} ${r.name}: ${r.details}`).join('\n')}
===============================================`;
    
    output.textContent = reportText;
    
    // Update verification checklist based on test results
    updateVerificationChecklist(report);
    
    console.log("📊 Test report displayed");
}

// Update verification checklist
function updateVerificationChecklist(report) {
    const checkItems = {
        'check-sync': ['Server Data Fetch', 'Sync State Update', 'Network Error Handling'],
        'check-conflicts': ['Conflict Detection', 'Manual Resolution Function', 'client-wins Resolution', 'server-wins Resolution', 'merge Resolution'],
        'check-data-integrity': ['Data Validation', 'ID Uniqueness', 'Data Structure'],
        'check-merge': ['Storage Save/Load', 'JSON Export'],
        'check-ui': ['Display Update Performance', 'Category Population Performance'],
        'check-storage': ['Storage Save', 'Storage Error Handling']
    };
    
    Object.keys(checkItems).forEach(checkId => {
        const element = document.getElementById(checkId);
        if (!element) return;
        
        const relatedTests = checkItems[checkId];
        const passedTests = report.results.filter(r => 
            relatedTests.some(test => r.name.includes(test)) && r.passed
        ).length;
        const totalTests = report.results.filter(r => 
            relatedTests.some(test => r.name.includes(test))
        ).length;
        
        const checkbox = element.querySelector('.checkbox');
        
        if (totalTests === 0) {
            // No related tests found
            checkbox.textContent = '⭕';
            element.classList.remove('passed', 'failed');
        } else if (passedTests === totalTests) {
            // All related tests passed
            checkbox.textContent = '✅';
            element.classList.remove('failed');
            element.classList.add('passed');
        } else {
            // Some tests failed
            checkbox.textContent = '❌';
            element.classList.remove('passed');
            element.classList.add('failed');
        }
    });
}

// Verify data integrity manually
function verifyDataIntegrity() {
    const output = document.getElementById('testOutput');
    if (!output) return;
    
    output.classList.add('test-running');
    output.textContent = "🔒 Verifying data integrity...\n";
    
    setTimeout(() => {
        let results = "DATA INTEGRITY VERIFICATION\n";
        results += "============================\n";
        
        // Check quote structure
        const structureValid = quotes.every(quote => 
            quote.hasOwnProperty('id') &&
            quote.hasOwnProperty('text') &&
            quote.hasOwnProperty('author') &&
            quote.hasOwnProperty('category')
        );
        results += `✓ Quote Structure: ${structureValid ? 'VALID' : 'INVALID'}\n`;
        
        // Check ID uniqueness
        const ids = quotes.map(q => q.id);
        const uniqueIds = [...new Set(ids)];
        const idsUnique = ids.length === uniqueIds.length;
        results += `✓ ID Uniqueness: ${idsUnique ? 'VALID' : 'INVALID'}\n`;
        
        // Check data consistency
        const validQuotes = quotes.filter(q => q.text && q.text.trim() && q.author && q.author.trim());
        const dataConsistent = validQuotes.length === quotes.length;
        results += `✓ Data Consistency: ${dataConsistent ? 'VALID' : 'INVALID'}\n`;
        
        // Check storage sync
        const storageData = localStorage.getItem('quotes');
        let storageSync = false;
        try {
            const parsedStorage = JSON.parse(storageData || '[]');
            storageSync = parsedStorage.length === quotes.length;
        } catch (error) {
            storageSync = false;
        }
        results += `✓ Storage Sync: ${storageSync ? 'SYNCED' : 'OUT OF SYNC'}\n`;
        
        // Overall assessment
        const allValid = structureValid && idsUnique && dataConsistent && storageSync;
        results += `\n🔒 OVERALL: ${allValid ? 'DATA INTEGRITY VERIFIED ✅' : 'DATA INTEGRITY ISSUES FOUND ❌'}\n`;
        
        output.textContent = results;
        output.classList.remove('test-running');
        
        // Show notification
        showAdvancedNotification(
            'Data Integrity Check',
            allValid ? 'All data integrity checks passed' : 'Data integrity issues detected',
            allValid ? 'success' : 'warning'
        );
        
        console.log("🔒 Data integrity verification completed");
    }, 1000);
}

// Simulate conflict scenario for testing
function simulateConflictScenario() {
    const output = document.getElementById('testOutput');
    if (!output) return;
    
    output.classList.add('test-running');
    output.textContent = "⚔️ Simulating conflict scenario...\n";
    
    setTimeout(() => {
        // Create a conflict scenario
        const testQuote = {
            id: 'conflict_simulation',
            text: 'Original local quote for testing',
            author: 'Local Author',
            category: 'testing',
            lastModified: new Date().toISOString()
        };
        
        const serverQuote = {
            id: 'conflict_simulation',
            text: 'Modified server quote for testing',
            author: 'Server Author',
            category: 'updated',
            source: 'server',
            lastModified: new Date().toISOString()
        };
        
        // Add local quote
        quotes.push(testQuote);
        
        // Simulate conflict detection
        const conflicts = [{
            local: testQuote,
            server: serverQuote,
            type: 'content_conflict'
        }];
        
        // Show conflict notification
        showConflictNotification(conflicts);
        
        let results = "CONFLICT SIMULATION COMPLETED\n";
        results += "===============================\n";
        results += `Local Version: "${testQuote.text}" by ${testQuote.author}\n`;
        results += `Server Version: "${serverQuote.text}" by ${serverQuote.author}\n`;
        results += `Conflict Type: ${conflicts[0].type}\n`;
        results += `Status: Conflict notification shown\n`;
        results += `Pending Conflicts: ${pendingConflicts.length}\n`;
        results += "\n⚔️ Check the notification area for conflict resolution options!\n";
        
        output.textContent = results;
        output.classList.remove('test-running');
        
        console.log("⚔️ Conflict scenario simulated");
    }, 1500);
}

// Enhanced test runner that updates UI
async function runTestsWithUI(testType = 'full') {
    const output = document.getElementById('testOutput');
    if (!output) return;
    
    output.classList.add('test-running');
    output.textContent = `🧪 Running ${testType} tests...\nThis may take a few moments.\n\n`;
    
    try {
        let result;
        if (testType === 'smoke') {
            result = await runSmokeTests();
        } else {
            result = await runFullTests();
        }
        
        // Update UI with results
        setTimeout(() => {
            showTestReport();
            output.classList.remove('test-running');
        }, 500);
        
    } catch (error) {
        output.textContent = `❌ Test execution failed: ${error.message}`;
        output.classList.remove('test-running');
        console.error("Test execution error:", error);
    }
}

// Override global test functions to use UI
const originalRunFullTests = window.runFullTests;
const originalRunSmokeTests = window.runSmokeTests;

window.runFullTests = () => runTestsWithUI('full');
window.runSmokeTests = () => runTestsWithUI('smoke');

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
// 9. Event handling with onclick AND addEventListener
// 10. File API for reading uploaded files
// 11. Array methods for data manipulation
// 12. Object property checking and validation
// 13. Modern event handling with addEventListener
// 14. Keyboard shortcuts and event listeners
// 15. DOMContentLoaded vs window.onload
// 16. Event object and preventDefault()
// 17. Dynamic button creation with event listeners
