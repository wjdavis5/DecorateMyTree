# 🎄 Holiday Tree Decorator

A beautiful Progressive Web Application that allows users to create stunning 3D holiday trees and share them with friends and family for collaborative decorating. The app supports multiple holiday traditions including Christmas, Hanukkah, and Kwanzaa ornaments.

![Holiday Tree](https://img.shields.io/badge/status-production--ready-green)
![Angular](https://img.shields.io/badge/angular-18.2-red)
![Three.js](https://img.shields.io/badge/three.js-0.159-blue)
![Firebase](https://img.shields.io/badge/firebase-10.7-orange)

## ✨ Features

### Core Features
- **Interactive 3D Trees**: Create stunning 3D holiday trees with realistic graphics and lighting
- **Collaborative Decorating**: Share your tree with friends and family via a unique link
- **Multi-Tradition Support**: Ornaments for Christmas, Hanukkah, and Kwanzaa celebrations
- **Personal Messages**: Attach heartfelt messages to each ornament
- **Real-time Updates**: See new decorations appear instantly using Firebase
- **PWA Support**: Works offline and can be installed on any device

### Visual Enhancements
- **Enhanced Graphics**: 
  - Realistic tree materials with varied green tones
  - Shadow support for depth and realism
  - Colorful string lights wrapped around the tree
  - Golden star tree topper with emissive glow
  - Improved lighting with ambient, directional, fill, and rim lights
  
- **Beautiful UI**:
  - Professional landing page with feature showcase
  - Gradient-based color scheme throughout
  - Smooth animations and transitions
  - Mobile-responsive design
  - Material Design components

### User Experience
- **Ornament Gallery**: View all ornaments and messages in a beautiful scrollable list
- **Social Sharing**: Share via Email, Twitter, Facebook, or WhatsApp
- **Help & Guidance**: Contextual help for first-time users
- **Statistics**: Track ornament count and contributor numbers
- **Loading States**: Smooth loading indicators throughout the app

## Prerequisites

- Node.js (v18 or later)
- Angular CLI (v17)
- Firebase account
- Cloudflare account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd holiday-tree-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Firestore Database
   - Copy your Firebase configuration to `src/app/services/tree.service.ts`

4. Configure Cloudflare:
   - Create a Cloudflare Workers account
   - Update `wrangler.toml` with your account details
   - Install Wrangler CLI: `npm install -g wrangler`

## Development

Run the development server:
```bash
npm start
```

## Building

Build for production:
```bash
npm run build:prod
```

## Testing

The application has comprehensive test coverage with unit tests and E2E tests.

Run unit tests:
```bash
npm run test:unit
```

Run E2E tests with Playwright:
```bash
npm run test:e2e
```

Run all tests:
```bash
npm run test:all
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

This will:
1. Build the Angular application for production
2. Deploy the built assets and Worker script to Cloudflare

The Worker script (`worker.js`) handles:
- Serving static assets with proper caching headers
- SPA routing support (redirects to index.html for non-file paths)
- Security headers (X-Frame-Options, CSP, etc.)
- Asset optimization and caching strategies

## 🏗️ Architecture

### Frontend
- **Angular 18**: Modern framework with standalone components
- **Three.js**: 3D graphics rendering with WebGL
- **Angular Material**: Beautiful, accessible UI components
- **RxJS**: Reactive programming for data streams

### Backend & Services
- **Firebase Firestore**: Real-time NoSQL database
- **Firebase Auth**: Authentication with multiple providers
- **Firebase App Check**: Security and abuse prevention

### Hosting & Deployment
- **Cloudflare Workers**: Edge computing for fast global delivery
- **Service Worker**: PWA features for offline functionality

### Key Technologies
```
Frontend:
├── Angular 18.2 (TypeScript)
├── Three.js 0.159 (3D Graphics)
├── Angular Material 18.2 (UI)
├── OrbitControls (Camera Control)
└── RxJS 7.8 (Reactive Programming)

Backend:
├── Firebase 10.7
│   ├── Firestore (Database)
│   ├── Authentication
│   └── App Check
└── Cloudflare Workers (Hosting)

Development:
├── TypeScript 5.5
├── Angular CLI 18.2
└── Wrangler (Deployment)
```

## 📖 Usage Guide

### Creating a Tree

1. Visit the home page and click "Create Your Tree"
2. Sign in using email or phone authentication
3. Your tree will be created with a unique link
4. Share the link with friends and family

### Decorating a Tree

1. Click on a shared tree link
2. Click "Add Ornament" to choose from available ornaments
3. Select an ornament from Christmas, Hanukkah, or Kwanzaa traditions
4. Click on the tree where you'd like to place the ornament
5. Add a personal message (optional)
6. Submit to add your decoration

### Viewing Decorations

- Click "Gallery" to see all ornaments and messages
- View statistics: total ornaments and number of contributors
- See who added each ornament and when

### Sharing Your Tree

1. Click the "Share" button
2. Copy the link or use social sharing buttons
3. Share via Email, Twitter, Facebook, or WhatsApp

## 🎨 Design Highlights

- **Gradient Themes**: Beautiful gradients throughout the interface
- **Material Icons**: Comprehensive icon set for visual clarity
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Following Material Design accessibility guidelines
- **Performance**: Optimized 3D rendering with efficient shadow mapping

## 🔧 Technical Improvements

### Graphics & Rendering
- MeshStandardMaterial for realistic surfaces
- PBR (Physically Based Rendering) for ornaments
- Multi-light setup (ambient, directional, fill, rim)
- Shadow mapping with PCFSoftShadowMap
- Emissive materials for glowing effects

### User Experience
- Loading states with spinners
- Error handling and notifications
- Contextual help text
- Pulsing animations for guidance
- Smooth transitions throughout

### Code Quality
- TypeScript strict mode
- Standalone components (Angular best practice)
- Modular service architecture
- Clean separation of concerns
- Comprehensive type definitions

## 🚀 Performance Optimization

- Three.js scene optimization
- Efficient geometry reuse
- Shadow map resolution tuning
- Asset loading strategies
- PWA caching for offline support

## 🔒 Security

- Firebase App Check for abuse prevention
- ReCAPTCHA v3 integration
- Secure authentication flows
- Environment-based configuration
- Firestore security rules

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow Angular style guide
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure build passes before submitting PR

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Three.js community for 3D graphics capabilities
- Firebase for real-time backend infrastructure
- Material Design for UI/UX guidelines
- All contributors and holiday spirit enthusiasts! 🎄✨
