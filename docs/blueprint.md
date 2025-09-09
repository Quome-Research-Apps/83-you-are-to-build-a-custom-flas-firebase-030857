# **App Name**: FlashForge

## Core Features:

- Card Creation: Create flashcards with 'Front' and 'Back' text areas to input terms and definitions.
- Deck Management: Store the current deck in the web browser's local storage and restore on each new session.
- Card Listing & Editing: A simple list/table view of all cards, each with a 'Delete' button. Persist all actions on the current deck to local storage.
- Study Mode Toggle: A dedicated 'Study' button that initializes the study mode view for learning the deck.
- Card Flipping: Implement 'flip' functionality to reveal the back of the card, aiding recall.
- Card Navigation: Navigate between flashcards with 'Next' and 'Previous' buttons within study mode.
- Content assist (prototype): When creating the text of a card, this tool will use the currently input string from either the `frontText` or `backText` property as a query and generate other useful associated information to augment the created flashcard, which the user can then approve and integrate directly into their text.

## Style Guidelines:

- Primary color: Sky blue (#87CEEB) for a calm, focused learning environment.
- Background color: Light gray (#F0F0F0), a desaturated version of sky blue, creating a clean backdrop.
- Accent color: Soft yellow (#F0E68C), analogous to sky blue, to highlight key elements and actions.
- Font: 'PT Sans' sans-serif font for clarity, to be used both for headlines and body text.
- Use simple, clear icons for actions like 'delete', 'flip', and 'next' to facilitate easy interaction.
- Maintain a clear separation between the card creation section and the study section to prevent user confusion.
- Subtle animations when flipping cards to simulate the action of physically turning a flashcard.