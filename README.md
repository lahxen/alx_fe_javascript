# Dynamic Quote Generator with Web Storage

A comprehensive web application that demonstrates DOM manipulation, Web Storage (localStorage and sessionStorage), and JSON data handling. This project enhances a basic quote generator with persistent data storage and import/export functionality.

## Features

### Core Functionality
- **Dynamic Quote Display**: Show random quotes with smooth animations
- **Quote Management**: Add, view, and delete custom quotes
- **Responsive Design**: Works on desktop and mobile devices

### Web Storage Implementation
- **Local Storage**: Persists quotes across browser sessions
- **Session Storage**: Tracks the last viewed quote during the current session
- **Automatic Save**: Quotes are automatically saved when added or modified

### JSON Data Handling
- **Export Functionality**: Download quotes as a JSON file with timestamp
- **Import Functionality**: Upload and merge JSON quote files
- **Data Validation**: Ensures imported data is properly formatted
- **Duplicate Prevention**: Avoids importing duplicate quotes when merging

### Advanced Features
- **Storage Statistics**: Monitor data usage and quote count
- **Error Handling**: Robust error management with user feedback
- **Data Backup**: Complete backup and restore functionality
- **User Preferences**: Session-based preference tracking

## File Structure

```
dom-manipulation/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with responsive design
├── script.js           # JavaScript with full functionality
└── README.md           # Project documentation
```

## How to Use

### Basic Usage
1. Open `index.html` in a web browser
2. Click "Get Random Quote" to see random quotes
3. Use the form to add your own quotes
4. Quotes are automatically saved to local storage

### Data Management
1. **Export Quotes**: Click "Export Quotes (JSON)" to download your quotes
2. **Import Quotes**: Click "Import Quotes (JSON)" and select a JSON file
3. **Clear Data**: Use "Clear All Data" to reset everything

### Import/Export File Format
The application supports JSON files in this format:
```json
{
  "quotes": [
    {
      "text": "Your quote text here",
      "author": "Author Name",
      "id": "unique_id",
      "dateAdded": "2025-08-15T10:30:00.000Z"
    }
  ],
  "exportDate": "2025-08-15T10:30:00.000Z",
  "version": "1.0"
}
```

## Technical Implementation

### Local Storage Features
- Automatic saving on quote addition
- Data persistence across browser sessions
- Storage availability checking
- Size monitoring and statistics

### Session Storage Features
- Last viewed quote tracking
- Session-specific data management
- Automatic cleanup on browser close

### JSON Handling
- Blob creation for file downloads
- FileReader API for file uploads
- Data validation and error handling
- Flexible import formats support

### Error Handling
- Try-catch blocks for all storage operations
- User-friendly error messages
- Graceful degradation when storage unavailable
- Input validation for all user actions

## Browser Compatibility
- Modern browsers with ES6 support
- Local Storage and Session Storage support required
- File API support for import/export functionality

## Storage Limitations
- Local Storage: ~5-10MB depending on browser
- Session Storage: ~5-10MB depending on browser
- Automatic cleanup if storage quota exceeded

## Development Notes

### Key Classes and Methods
- `QuoteManager`: Main application class
- `saveToStorage()`: Saves quotes to localStorage
- `loadFromStorage()`: Loads quotes from localStorage
- `exportToJSON()`: Creates downloadable JSON file
- `importFromJSON()`: Processes uploaded JSON files

### Event Handling
- Form submission for adding quotes
- File input change for imports
- Button clicks for all actions
- Automatic UI updates on data changes

## Future Enhancements
- Categories and tags for quotes
- Search and filter functionality
- Quote sharing capabilities
- Cloud sync integration
- Bulk editing features

## License
This project is open source and available under the MIT License.
