# Local Development

Use VS Code's Live Server extension to test the complete flow:

1. Right-click `index.html` in VS Code's file explorer
2. Select "Open with Live Server"

This will:
1. Start a local server (usually on port 5500)
2. Open your browser automatically
3. Enable CORS (needed for Met API requests)
4. Auto-reload when you make changes

## Testing the Complete Flow

1. Start at http://localhost:8000/index.html
   - Pick a topic and click Generate Map
   - Review the webhook response in the debug panel
   - Click "Proceed to Map" when ready

2. Test page: http://localhost:8000/itemSearch.html 
   - Direct testing of Met API object fetching
   - Enter object IDs manually or use presets
   - Click "Open in Map" to simulate the webhook flow

3. Results at http://localhost:8000/map.html
   - Displays fetched Met objects
   - Email or print your scavenger hunt

## Files

- `index.html` - Main entry point, calls webhook
- `itemSearch.html` - Test page for Met API
- `map.html` - Results display
- `assets/metObjects.js` - Met API utilities
- `styles.css` - Shared styles