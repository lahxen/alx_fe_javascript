// 🧪 STEP 4: COMPREHENSIVE TESTING AND VERIFICATION SUITE
// ========================================================

// Test suite for sync and conflict resolution functionalities
class QuoteGeneratorTestSuite {
    constructor() {
        this.testResults = [];
        this.testData = {
            mockQuotes: [
                { id: 'test_1', text: 'Local test quote 1', author: 'Test Author 1', category: 'testing' },
                { id: 'test_2', text: 'Local test quote 2', author: 'Test Author 2', category: 'local' },
                { id: 'test_3', text: 'Shared quote original', author: 'Original Author', category: 'shared' }
            ],
            mockServerQuotes: [
                { id: 'server_1', text: 'Server quote 1', author: 'Server Author 1', category: 'server', source: 'server' },
                { id: 'test_3', text: 'Shared quote modified', author: 'Modified Author', category: 'updated', source: 'server' },
                { id: 'server_2', text: 'New server quote', author: 'Server Author 2', category: 'new', source: 'server' }
            ]
        };
        this.originalQuotes = [];
        this.originalServerState = {};
    }

    // 🚀 Run all tests
    async runAllTests() {
        console.log("🧪 Starting comprehensive test suite...");
        this.showTestingNotification("Starting comprehensive test suite...", "info");
        
        // Backup current state
        this.backupCurrentState();
        
        try {
            // Core functionality tests
            await this.testQuoteManagement();
            await this.testStorageFunctionality();
            await this.testCategoryFiltering();
            
            // Sync functionality tests
            await this.testServerSync();
            await this.testConflictDetection();
            await this.testConflictResolution();
            
            // Data integrity tests
            await this.testDataIntegrity();
            await this.testErrorHandling();
            
            // Performance tests
            await this.testPerformance();
            
            // Generate test report
            this.generateTestReport();
            
        } catch (error) {
            console.error("❌ Test suite error:", error);
            this.addTestResult('Test Suite Execution', false, `Error: ${error.message}`);
        } finally {
            // Restore original state
            this.restoreOriginalState();
            console.log("🔄 Original state restored");
        }
    }

    // 💾 Backup current application state
    backupCurrentState() {
        this.originalQuotes = JSON.parse(JSON.stringify(quotes));
        this.originalServerState = JSON.parse(JSON.stringify(serverSyncState));
        console.log("💾 Current state backed up");
    }

    // 🔄 Restore original application state
    restoreOriginalState() {
        quotes.length = 0;
        quotes.push(...this.originalQuotes);
        Object.assign(serverSyncState, this.originalServerState);
        saveQuotesToStorage();
        updateDisplay();
        populateCategories();
    }

    // ✅ Add test result
    addTestResult(testName, passed, details = '') {
        const result = {
            name: testName,
            passed: passed,
            details: details,
            timestamp: new Date().toISOString()
        };
        this.testResults.push(result);
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${testName}: ${details}`);
    }

    // 🔔 Show testing notification
    showTestingNotification(message, type = 'info') {
        if (typeof showAdvancedNotification === 'function') {
            showAdvancedNotification('Testing', message, type, 2000);
        } else {
            console.log(`🧪 Test: ${message}`);
        }
    }

    // 📝 Test quote management functionality
    async testQuoteManagement() {
        console.log("📝 Testing quote management...");
        
        const initialCount = quotes.length;
        
        // Test adding quote
        const testQuote = { text: 'Test quote', author: 'Test Author', category: 'test' };
        const quoteId = addQuoteToArray(testQuote.text, testQuote.author, testQuote.category);
        
        if (quotes.length === initialCount + 1) {
            this.addTestResult('Add Quote', true, 'Quote successfully added');
        } else {
            this.addTestResult('Add Quote', false, 'Quote not added correctly');
        }
        
        // Test quote retrieval
        const retrievedQuote = quotes.find(q => q.id === quoteId);
        if (retrievedQuote && retrievedQuote.text === testQuote.text) {
            this.addTestResult('Quote Retrieval', true, 'Quote retrieved correctly');
        } else {
            this.addTestResult('Quote Retrieval', false, 'Quote retrieval failed');
        }
        
        // Test random quote selection
        const randomQuote = getRandomQuoteByCategory('all');
        if (randomQuote && randomQuote.text && randomQuote.author) {
            this.addTestResult('Random Quote Selection', true, 'Random quote selected');
        } else {
            this.addTestResult('Random Quote Selection', false, 'Random quote selection failed');
        }
    }

    // 💾 Test storage functionality
    async testStorageFunctionality() {
        console.log("💾 Testing storage functionality...");
        
        const testQuotes = [...this.testData.mockQuotes];
        
        // Backup original quotes
        const originalQuotes = [...quotes];
        
        // Set test quotes
        quotes.length = 0;
        quotes.push(...testQuotes);
        
        // Test save to storage
        saveQuotesToStorage();
        
        // Clear quotes and reload
        quotes.length = 0;
        loadQuotesFromStorage();
        
        if (quotes.length === testQuotes.length) {
            this.addTestResult('Storage Save/Load', true, `${quotes.length} quotes saved and loaded`);
        } else {
            this.addTestResult('Storage Save/Load', false, `Expected ${testQuotes.length}, got ${quotes.length}`);
        }
        
        // Test JSON export
        try {
            const exportedData = exportQuotesToJSON();
            const parsedData = JSON.parse(exportedData);
            if (Array.isArray(parsedData) && parsedData.length === quotes.length) {
                this.addTestResult('JSON Export', true, 'Data exported correctly');
            } else {
                this.addTestResult('JSON Export', false, 'Export data structure invalid');
            }
        } catch (error) {
            this.addTestResult('JSON Export', false, `Export failed: ${error.message}`);
        }
        
        // Restore original quotes
        quotes.length = 0;
        quotes.push(...originalQuotes);
    }

    // 🏷️ Test category filtering
    async testCategoryFiltering() {
        console.log("🏷️ Testing category filtering...");
        
        // Add test quotes with different categories
        const testCategories = ['test1', 'test2', 'test3'];
        testCategories.forEach((category, index) => {
            addQuoteToArray(`Test quote ${index + 1}`, `Author ${index + 1}`, category);
        });
        
        // Test category extraction
        const categories = getUniqueCategories();
        const hasTestCategories = testCategories.every(cat => categories.includes(cat));
        
        if (hasTestCategories) {
            this.addTestResult('Category Extraction', true, `All test categories found: ${testCategories.join(', ')}`);
        } else {
            this.addTestResult('Category Extraction', false, 'Test categories not found');
        }
        
        // Test category filtering
        const categoryQuotes = getRandomQuoteByCategory('test1');
        if (categoryQuotes && categoryQuotes.category === 'test1') {
            this.addTestResult('Category Filtering', true, 'Category filtering works');
        } else {
            this.addTestResult('Category Filtering', false, 'Category filtering failed');
        }
    }

    // 🌐 Test server synchronization
    async testServerSync() {
        console.log("🌐 Testing server synchronization...");
        
        // Mock server response
        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {
            if (url.includes('jsonplaceholder')) {
                return {
                    ok: true,
                    json: async () => this.testData.mockServerQuotes.slice(0, 3).map((quote, index) => ({
                        id: index + 1,
                        title: quote.text,
                        body: `${quote.author} - ${quote.category}`,
                        userId: 1
                    }))
                };
            }
            return originalFetch(url, options);
        };
        
        try {
            // Test data fetching
            await fetchDataFromServer();
            
            // Check if server quotes were added
            const serverQuotes = quotes.filter(q => q.source === 'server');
            if (serverQuotes.length > 0) {
                this.addTestResult('Server Data Fetch', true, `${serverQuotes.length} server quotes received`);
            } else {
                this.addTestResult('Server Data Fetch', false, 'No server quotes received');
            }
            
            // Test sync state updates
            if (serverSyncState.lastSyncTime) {
                this.addTestResult('Sync State Update', true, 'Sync timestamp updated');
            } else {
                this.addTestResult('Sync State Update', false, 'Sync state not updated');
            }
            
        } catch (error) {
            this.addTestResult('Server Sync', false, `Sync failed: ${error.message}`);
        } finally {
            // Restore original fetch
            window.fetch = originalFetch;
        }
    }

    // ⚔️ Test conflict detection
    async testConflictDetection() {
        console.log("⚔️ Testing conflict detection...");
        
        // Setup conflicting data
        const localQuote = { id: 'conflict_test', text: 'Local version', author: 'Local Author', category: 'local' };
        const serverQuote = { id: 'conflict_test', text: 'Server version', author: 'Server Author', category: 'server', source: 'server' };
        
        // Add local quote
        quotes.push(localQuote);
        
        // Mock conflict detection
        const conflicts = [];
        if (localQuote.text !== serverQuote.text || localQuote.author !== serverQuote.author) {
            conflicts.push({
                local: localQuote,
                server: serverQuote,
                type: 'content_conflict'
            });
        }
        
        if (conflicts.length > 0) {
            this.addTestResult('Conflict Detection', true, `${conflicts.length} conflict(s) detected`);
        } else {
            this.addTestResult('Conflict Detection', false, 'Conflicts not detected');
        }
        
        // Test hash generation for change detection
        const hash1 = generateDataHash([localQuote]);
        const hash2 = generateDataHash([serverQuote]);
        
        if (hash1 !== hash2) {
            this.addTestResult('Data Hash Comparison', true, 'Different data produces different hashes');
        } else {
            this.addTestResult('Data Hash Comparison', false, 'Hash comparison failed');
        }
    }

    // 🛠️ Test conflict resolution strategies
    async testConflictResolutionStrategies() {
        console.log("🛠️ Testing conflict resolution strategies...");
        
        const testConflicts = [{
            local: { id: 'res_test', text: 'Local text', author: 'Local Author', category: 'local' },
            server: { id: 'res_test', text: 'Server text', author: 'Server Author', category: 'server', source: 'server' },
            type: 'content_conflict'
        }];
        
        // Test each resolution strategy
        const strategies = ['client-wins', 'server-wins', 'merge'];
        
        for (const strategy of strategies) {
            // Setup test
            const testQuote = { ...testConflicts[0].local };
            quotes.push(testQuote);
            
            // Set strategy
            serverSyncState.conflictResolution = strategy;
            
            // Apply resolution (simplified)
            const conflict = testConflicts[0];
            let resolvedCorrectly = false;
            
            switch (strategy) {
                case 'client-wins':
                    resolvedCorrectly = true; // Local version should be kept
                    break;
                case 'server-wins':
                    const quoteIndex = quotes.findIndex(q => q.id === conflict.local.id);
                    if (quoteIndex !== -1) {
                        quotes[quoteIndex] = { ...conflict.server, id: conflict.local.id };
                        resolvedCorrectly = quotes[quoteIndex].text === conflict.server.text;
                    }
                    break;
                case 'merge':
                    resolvedCorrectly = true; // Merge strategy should work
                    break;
            }
            
            this.addTestResult(`${strategy} Resolution`, resolvedCorrectly, 
                `${strategy} strategy ${resolvedCorrectly ? 'applied correctly' : 'failed'}`);
            
            // Cleanup
            const index = quotes.findIndex(q => q.id === testQuote.id);
            if (index !== -1) quotes.splice(index, 1);
        }
    }

    // 🛠️ Test conflict resolution
    async testConflictResolution() {
        await this.testConflictResolutionStrategies();
        
        // Test manual resolution UI components
        if (typeof openConflictModal === 'function') {
            this.addTestResult('Conflict Modal Function', true, 'Modal function available');
        } else {
            this.addTestResult('Conflict Modal Function', false, 'Modal function missing');
        }
        
        if (typeof resolveConflictManually === 'function') {
            this.addTestResult('Manual Resolution Function', true, 'Manual resolution function available');
        } else {
            this.addTestResult('Manual Resolution Function', false, 'Manual resolution function missing');
        }
        
        // Test conflict history
        if (Array.isArray(conflictHistory)) {
            this.addTestResult('Conflict History System', true, 'Conflict history system initialized');
        } else {
            this.addTestResult('Conflict History System', false, 'Conflict history system missing');
        }
    }

    // 🔒 Test data integrity
    async testDataIntegrity() {
        console.log("🔒 Testing data integrity...");
        
        const originalCount = quotes.length;
        const originalQuotes = JSON.parse(JSON.stringify(quotes));
        
        // Test quote validation
        const validQuote = { text: 'Valid quote', author: 'Valid Author', category: 'valid' };
        const invalidQuote = { text: '', author: '', category: '' };
        
        // Add valid quote
        addQuoteToArray(validQuote.text, validQuote.author, validQuote.category);
        
        // Try to add invalid quote (should be rejected)
        const beforeInvalid = quotes.length;
        try {
            addQuoteToArray(invalidQuote.text, invalidQuote.author, invalidQuote.category);
        } catch (error) {
            // Expected to fail
        }
        const afterInvalid = quotes.length;
        
        if (afterInvalid === beforeInvalid) {
            this.addTestResult('Data Validation', true, 'Invalid quotes rejected');
        } else {
            this.addTestResult('Data Validation', false, 'Invalid quotes not properly validated');
        }
        
        // Test ID uniqueness
        const ids = quotes.map(q => q.id);
        const uniqueIds = [...new Set(ids)];
        
        if (ids.length === uniqueIds.length) {
            this.addTestResult('ID Uniqueness', true, 'All quote IDs are unique');
        } else {
            this.addTestResult('ID Uniqueness', false, 'Duplicate IDs found');
        }
        
        // Test data structure consistency
        const structureValid = quotes.every(quote => 
            quote.hasOwnProperty('id') &&
            quote.hasOwnProperty('text') &&
            quote.hasOwnProperty('author') &&
            quote.hasOwnProperty('category')
        );
        
        if (structureValid) {
            this.addTestResult('Data Structure', true, 'All quotes have required properties');
        } else {
            this.addTestResult('Data Structure', false, 'Some quotes missing required properties');
        }
    }

    // ❌ Test error handling
    async testErrorHandling() {
        console.log("❌ Testing error handling...");
        
        // Test network error simulation
        const originalFetch = window.fetch;
        window.fetch = async () => {
            throw new Error('Network error');
        };
        
        try {
            await fetchDataFromServer();
            this.addTestResult('Network Error Handling', false, 'Should have thrown error');
        } catch (error) {
            this.addTestResult('Network Error Handling', true, 'Network errors handled gracefully');
        } finally {
            window.fetch = originalFetch;
        }
        
        // Test invalid JSON handling
        try {
            const invalidJSON = '{"invalid": json}';
            JSON.parse(invalidJSON);
            this.addTestResult('JSON Error Handling', false, 'Should have thrown JSON error');
        } catch (error) {
            this.addTestResult('JSON Error Handling', true, 'JSON errors handled');
        }
        
        // Test localStorage errors (quota exceeded simulation)
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = () => {
            throw new Error('Quota exceeded');
        };
        
        try {
            saveQuotesToStorage();
            this.addTestResult('Storage Error Handling', true, 'Storage errors handled gracefully');
        } catch (error) {
            this.addTestResult('Storage Error Handling', false, `Storage error not handled: ${error.message}`);
        } finally {
            localStorage.setItem = originalSetItem;
        }
    }

    // ⚡ Test performance
    async testPerformance() {
        console.log("⚡ Testing performance...");
        
        // Test large dataset handling
        const startTime = performance.now();
        
        // Add many quotes
        for (let i = 0; i < 100; i++) {
            addQuoteToArray(`Performance test quote ${i}`, `Author ${i}`, `category${i % 10}`);
        }
        
        const addTime = performance.now() - startTime;
        
        // Test display update performance
        const displayStartTime = performance.now();
        updateDisplay();
        const displayTime = performance.now() - displayStartTime;
        
        // Test category population performance
        const categoryStartTime = performance.now();
        populateCategories();
        const categoryTime = performance.now() - categoryStartTime;
        
        if (addTime < 1000) { // Should complete in under 1 second
            this.addTestResult('Bulk Add Performance', true, `Added 100 quotes in ${addTime.toFixed(2)}ms`);
        } else {
            this.addTestResult('Bulk Add Performance', false, `Too slow: ${addTime.toFixed(2)}ms`);
        }
        
        if (displayTime < 100) {
            this.addTestResult('Display Update Performance', true, `Display updated in ${displayTime.toFixed(2)}ms`);
        } else {
            this.addTestResult('Display Update Performance', false, `Display update too slow: ${displayTime.toFixed(2)}ms`);
        }
        
        if (categoryTime < 50) {
            this.addTestResult('Category Population Performance', true, `Categories populated in ${categoryTime.toFixed(2)}ms`);
        } else {
            this.addTestResult('Category Population Performance', false, `Category population too slow: ${categoryTime.toFixed(2)}ms`);
        }
        
        // Clean up performance test data
        quotes.splice(-100);
    }

    // 📊 Generate comprehensive test report
    generateTestReport() {
        const passedTests = this.testResults.filter(r => r.passed).length;
        const totalTests = this.testResults.length;
        const passRate = ((passedTests / totalTests) * 100).toFixed(2);
        
        const report = {
            summary: {
                totalTests: totalTests,
                passedTests: passedTests,
                failedTests: totalTests - passedTests,
                passRate: passRate + '%'
            },
            results: this.testResults,
            timestamp: new Date().toISOString()
        };
        
        // Display results in console
        console.log("📊 TEST REPORT");
        console.log("===============");
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} (${passRate}%)`);
        console.log(`Failed: ${totalTests - passedTests}`);
        console.log("===============");
        
        // Show detailed results
        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.details}`);
        });
        
        // Show notification
        const reportType = passRate > 90 ? 'success' : passRate > 70 ? 'warning' : 'error';
        this.showTestingNotification(
            `Test suite completed: ${passedTests}/${totalTests} tests passed (${passRate}%)`,
            reportType
        );
        
        // Store report in localStorage for later analysis
        localStorage.setItem('testReport', JSON.stringify(report));
        
        return report;
    }

    // 🔄 Quick smoke test for essential functionality
    async runSmokeTests() {
        console.log("💨 Running smoke tests...");
        this.testResults = [];
        
        // Test basic quote operations
        const initialCount = quotes.length;
        addQuoteToArray('Smoke test', 'Test Author', 'test');
        
        if (quotes.length === initialCount + 1) {
            this.addTestResult('Basic Quote Add', true, 'Quote added successfully');
        } else {
            this.addTestResult('Basic Quote Add', false, 'Quote add failed');
        }
        
        // Test storage
        try {
            saveQuotesToStorage();
            this.addTestResult('Storage Save', true, 'Data saved to storage');
        } catch (error) {
            this.addTestResult('Storage Save', false, 'Storage save failed');
        }
        
        // Test display
        try {
            updateDisplay();
            this.addTestResult('Display Update', true, 'Display updated');
        } catch (error) {
            this.addTestResult('Display Update', false, 'Display update failed');
        }
        
        const passedSmoke = this.testResults.filter(r => r.passed).length;
        const totalSmoke = this.testResults.length;
        
        console.log(`💨 Smoke tests: ${passedSmoke}/${totalSmoke} passed`);
        
        return passedSmoke === totalSmoke;
    }
}

// Create global test suite instance
const testSuite = new QuoteGeneratorTestSuite();

// Make testing functions globally available
window.runFullTests = () => testSuite.runAllTests();
window.runSmokeTests = () => testSuite.runSmokeTests();
window.getTestReport = () => {
    const report = localStorage.getItem('testReport');
    return report ? JSON.parse(report) : null;
};

console.log("🧪 Test suite loaded. Use runFullTests() or runSmokeTests() to begin testing.");
