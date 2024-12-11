# Holiday Tree App

A Progressive Web Application that allows users to create and share 3D holiday trees that can be decorated by friends and family. The app supports multiple holiday traditions including Christmas, Hanukkah, and Kwanzaa ornaments.

## Features

- Create a 3D Christmas tree that can be viewed from any angle
- Share your tree with a unique link
- Decorators can add ornaments from different holiday traditions
- Each ornament can include a personal message
- Full PWA support for offline functionality
- Real-time updates using Firebase
- Deployed on Cloudflare Workers

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

## Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Architecture

- Angular 17 with standalone components
- Three.js for 3D rendering
- Firebase Firestore for data storage
- Angular Material for UI components
- PWA features using @angular/service-worker
- Cloudflare Workers for hosting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
