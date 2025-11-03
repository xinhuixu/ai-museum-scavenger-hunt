## Welcome to the AI Museum Scavenger Hunt, your personalized guide to exploring the vast collection of The Met! This tool creates a custom list of artworks based on your interests, turning your visit into a fun, focused scavenger hunt.

### Getting Started
#### 1. Choose a Topic of Interest

Select one of the pre-set buttons to choose your topic. OR, enter your own unique topic in the text box below. For example, you can type in "dragons, cats, space, myths".

Note: If you type a topic, it will override any button you may have clicked.

#### 2. Generate Your Map

Click the "Generate Map" button. The AI will curate a list of relevant artworks from the Met's collection—specifically from the artworks classified as "highlights".

#### 3. Review the Artworks

The generated map will display a list of artworks related to your topic (e.g., "Transportation Vehicles").

#### 4. Share and Print

You have three options for your map:

* Email to Myself: Send the list to your email.

* Print Map: Print the list to take with you (a full PDF map is coming soon).

* Generate Another Map: Start over with a new topic.

Enjoy exploring the museum through your personalized path!

-------------------------------

## Backend n8n Flow Preview

<img width="891" height="845" alt="image" src="https://github.com/user-attachments/assets/7b02c1e9-63cc-4864-a2af-3f7add0d933a" />

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
