# Rectangle App 🟦

An interactive rectangle drawing application with real-time validation and dynamic resizing.

## 🚀 Features

- SVG-based rectangle with drag-to-resize functionality
- Real-time perimeter calculation
- Backend validation with visual feedback
- Responsive design
- Modern glass-morphism UI

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- SVG manipulation

### Backend
- .NET 8.0
- Minimal API
- JSON file storage

## 🏃‍♂️ Running the Application

### Backend Setup
```bash
cd Backend
dotnet run
```
The backend will start at http://localhost:5000

### Frontend Setup
```bash
cd ClientApp
npm install
npm start
```
The frontend will start at http://localhost:3000

## 🎯 Business Rules

- Rectangle width cannot exceed height
- Minimum dimensions: 50x50 pixels
- Validation takes 10 seconds (simulated backend processing)
- Users can continue resizing during validation

## 🔧 Development Notes

- Backend stores dimensions in `rectangle-config.json`
- Frontend handles offline mode gracefully
- Real-time visual feedback during resizing
- Responsive layout for all screen sizes

## 🧪 Project Structure
```
RectangleApp/
├── Backend/
│   ├── Program.cs          # Minimal API endpoints
│   ├── appsettings.json    # Configuration
│   └── Properties/
│       └── launchSettings.json
└── ClientApp/
    ├── src/
    │   ├── components/
    │   │   └── Rectangle.tsx
    │   ├── App.tsx
    │   └── index.tsx
    └── public/
        └── index.html
```

## 📝 Requirements

- Node.js 16+
- .NET 8.0 SDK
- Modern web browser with SVG support

## 👤 Author
hega4444
January 31, 2025 