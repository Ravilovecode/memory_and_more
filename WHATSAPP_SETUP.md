# WhatsApp Integration Setup

## Overview
The website now includes WhatsApp sharing functionality for all product buttons. When users click on the "Buy Now" or "Order on WhatsApp" buttons, it will automatically open WhatsApp with a pre-filled message containing product details.

## Configuration

### Setting Up Your WhatsApp Number

1. **Main Page (index.html)**: Edit `script.js`
2. **Categories Page (categories.html)**: Edit `categories.js`

In both files, find the `WHATSAPP_CONFIG` object at the top and update it:

```javascript
const WHATSAPP_CONFIG = {
    ownerNumber: '+919876543210', // Replace with your actual WhatsApp number
    businessName: 'Memory & More'  // Your business name
};
```

### WhatsApp Number Format
- Include the country code (e.g., +91 for India)
- Example formats:
  - `+919876543210` (India)
  - `+1234567890` (US)
  - `+447123456789` (UK)

## How It Works

### User Experience
1. User clicks on "Buy Now" or "Order on WhatsApp" button
2. Button shows "Sending..." feedback
3. WhatsApp opens in a new tab/window with pre-filled message
4. Message includes:
   - Product name
   - Product description
   - Price information
   - Product image URL
   - Request for more details

### Message Template
```
Hi! I'm interested in this product from Memory & More:

🏷️ Product: [Product Name]
📝 Description: [Product Description]
💰 Price: [Current Price] (was [Original Price])
🖼️ Product Image: [Image URL]

Please provide more details about availability and ordering process.
```

## Features

### Main Page (index.html)
- **Button Text**: "Buy Now" with WhatsApp icon
- **Button Class**: `.buy-now-btn`
- **Functionality**: Extracts product data from card structure

### Categories Page (categories.html)
- **Button Text**: "Order on WhatsApp" with WhatsApp icon  
- **Button Class**: `.add-to-cart-btn`
- **Functionality**: Extracts product data from card structure

### Technical Details
- Uses `window.open()` to launch WhatsApp Web/App
- URL encodes message content for proper formatting
- Handles both discounted and regular pricing
- Includes error handling for missing product information
- Provides visual feedback during the sharing process

## Testing
1. Update the WhatsApp number in the configuration
2. Open the website in a browser
3. Click on any "Buy Now" or "Order on WhatsApp" button
4. Verify that WhatsApp opens with the correct message and your number

## Troubleshooting
- **WhatsApp doesn't open**: Check if the phone number format is correct
- **Message appears garbled**: Ensure product data structure matches expected format
- **Button doesn't respond**: Check browser console for JavaScript errors

## Customization
You can modify the message template by editing the `shareOnWhatsApp` function in either `script.js` or `categories.js`.
