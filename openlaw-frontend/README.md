# OpenLaw AI - React Frontend

This is the React frontend for the OpenLaw AI application, converted from the original HTML/CSS/JavaScript implementation.

## Features

- **Modern React Architecture**: Built with functional components and hooks
- **Real-time Chat Interface**: Interactive AI chat with file upload support
- **Attorney Directory**: Browse and connect with legal professionals
- **Practice Areas**: Explore different legal specialties
- **Responsive Design**: Works on desktop and mobile devices
- **Bootstrap Integration**: Modern UI components and styling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Flask backend running on `http://localhost:8000`

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Header.js              # Navigation header
│   ├── HeroSection.js         # Main landing section with search
│   ├── ChatModal.js           # Main chat interface
│   ├── AttorneyDirectory.js   # Attorney listing
│   ├── PracticeAreas.js       # Legal practice areas
│   ├── HowItWorks.js          # Process explanation
│   ├── Comparison.js          # OpenLaw vs traditional
│   └── FAQ.js                 # Frequently asked questions
├── App.js                     # Main application component
├── App.css                    # Styles (converted from landing.css)
└── index.js                   # Application entry point
```

## Key Components

### ChatModal.js
The main chat interface that handles:
- Real-time messaging with AI
- File uploads (PDF, DOCX)
- Lawyer search and matching
- Conversation flow management
- Geolocation-based lawyer search

### HeroSection.js
The landing page hero section with:
- Search functionality
- Suggestion buttons
- Integration with chat modal

## API Integration

The frontend communicates with the Flask backend via:
- **Search API**: `POST /search` - Main chat and search functionality
- **File Upload**: `POST /upload` - Document processing
- **Document Generation**: `POST /generate-document` - Legal document creation

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables

The app uses a proxy configuration in `package.json` to forward API requests to the Flask backend at `http://localhost:8000`.

## Styling

The application uses:
- **Bootstrap 5** for responsive layout and components
- **Bootstrap Icons** for iconography
- **Custom CSS** converted from the original `landing.css`
- **Google Fonts** (Inter) for typography

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Serve the build folder:**
   The `build` folder contains the production-ready files that can be served by any web server.

## Troubleshooting

### Common Issues

1. **API Connection Error**: Ensure the Flask backend is running on port 8000
2. **CORS Issues**: The proxy configuration should handle this automatically
3. **File Upload Issues**: Check that the backend supports the file types you're uploading

### Development Tips

- Use React Developer Tools for debugging
- Check the browser console for any JavaScript errors
- Monitor network requests in the browser's Network tab

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the OpenLaw AI platform.
