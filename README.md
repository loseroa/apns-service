# APNS Live Activity Push Notification Service

A web interface for sending Live Activity push notifications to iOS devices. This tool helps developers test and manage Live Activity push notifications without writing additional code.

## Features

- Send Live Activity push notifications
- Support for Start, Update, and End activities
- Secure authentication using .p8 certificates
- JSON content state validation
- Form data persistence
- Responsive design

## Prerequisites

- Node.js 16.x or later
- Apple Developer Account
- APNS Authentication Key (.p8 file)
- iOS app configured for Live Activities

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create a `.env` file in the root directory:
```env
# Optional: Set development mode
NODE_ENV=development

# Optional: Set custom port
PORT=3000
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. **Authentication Key**: Upload your .p8 file obtained from Apple Developer portal
2. **Team ID**: Your Apple Developer Team ID (found in Developer portal)
3. **Key ID**: The ID of your APNS authentication key
4. **Bundle ID**: Your iOS app's bundle identifier
5. **Push Token**: The device token for Live Activity
6. **Priority**: Select notification priority (5 for medium, 10 for high)
7. **Action Type**: Choose between Start, Update, or End activity
8. **Content State**: Enter the JSON payload for your Live Activity

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
