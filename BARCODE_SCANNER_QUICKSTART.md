# Barcode Scanner - Quick Start Guide

## For Users

### How to Use

1. **Open the app** and navigate to the Daily view
2. **Click "Scan Barcode"** button (purple button with camera icon)
3. **Allow camera access** when prompted (first time only)
4. **Point camera** at product barcode
5. **Wait for detection** - happens automatically
6. **Review product** details in the FoodLogger modal
7. **Adjust quantity** if needed
8. **Click "Add to Log"** to save

### Tips for Best Results

- Ensure good lighting
- Hold camera steady
- Keep barcode centered in the scanning area
- Try different angles if barcode isn't detected
- Make sure barcode is clean and not damaged

### What Barcodes Are Supported?

The scanner works with all common product barcodes:
- UPC codes (North America)
- EAN codes (International)
- Most grocery store products
- Packaged foods and beverages

### What If My Product Isn't Found?

If a barcode isn't in the database:
1. An error message will appear
2. You can try scanning another product
3. Or close the scanner and use "Search Foods" or "Add Custom Food"

## For Developers

### Running the App

```bash
# Install dependencies (first time)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Testing the Feature

1. **Local Testing**: Use `npm run dev` and access via `http://localhost:5173`
   - Note: Camera may not work on HTTP (browser security)
   - Use port forwarding or ngrok for mobile testing

2. **Production Testing**: Deploy to Netlify (HTTPS enabled)
   - Camera will work properly
   - Test on actual mobile devices

3. **Test Barcodes**: Try these popular products
   - 3017620422003 - Nutella
   - 5449000000996 - Coca-Cola
   - 4902430583916 - Kit Kat

### Key Files

- `/src/components/BarcodeScanner.jsx` - Scanner component
- `/src/utils/api.js` - API integration (lookupFoodByBarcode function)
- `/src/App.jsx` - Main integration

### Dependencies

```json
{
  "html5-qrcode": "^2.3.8"
}
```

### Environment Requirements

- Modern browser with camera support
- HTTPS connection (required for camera access)
- Camera permissions granted

## Troubleshooting

### Camera not working?
- Check you're on HTTPS
- Check browser permissions
- Ensure camera not in use by another app
- Try refreshing the page

### Barcode not scanning?
- Improve lighting
- Clean camera lens
- Try different angle
- Ensure barcode is not damaged

### "Product not found" error?
- Product may not be in Open Food Facts database
- Try manual search instead
- Consider adding product to Open Food Facts

## Architecture Decision

**Why html5-qrcode?**
- Cross-platform compatibility
- No API key required
- Active maintenance
- Multiple barcode format support
- Better browser support than native Barcode Detection API

**Why Open Food Facts?**
- Free API with no rate limits
- 2.8+ million products
- Comprehensive nutrition data
- USDA FoodData Central doesn't support barcode lookup
- Community-driven and accurate

## Next Steps

The feature is production-ready! You can:
1. Deploy to Netlify/production
2. Test with real users
3. Gather feedback
4. Consider enhancements (see BARCODE_SCANNER_DOCS.md)

## Support

For issues or questions:
- Check BARCODE_SCANNER_DOCS.md for detailed documentation
- Review browser console for error messages
- Ensure all prerequisites are met (HTTPS, permissions, etc.)
