# Toonify Mobile App

A React Native mobile application that transforms images into animated videos using AI technology. Built with Expo and React Native.

## Features

- **Image to Video Conversion**: Upload images and convert them into animated videos
- **User Authentication**: 
  - Email/Password login
  - Google Sign-In
  - Apple Sign-In
- **Secure Storage**: Securely store user credentials and tokens
- **Cross-Platform**: Works on both iOS and Android devices

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Studio (for Android development)
- Expo Go app on your physical device (for testing)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd toonify-v1/frontend-mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   API_URL=http://localhost:3000
   ```

## Running the App

### Development Mode

```
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with the Expo Go app on your physical device

### Building for Production

```
expo build:android
expo build:ios
```

## Project Structure

- `App.js` - Main application component
- `auth/` - Authentication related components and context
  - `AuthContext.js` - Authentication state management
  - `SignInScreen.js` - Sign in screen
  - `SignUpScreen.js` - Sign up screen
- `assets/` - Images, fonts, and other static assets

## Authentication Flow

The app uses a context-based authentication system:
1. User credentials are stored securely using `expo-secure-store`
2. Authentication tokens are managed in the `AuthContext`
3. API requests include the authentication token in headers

## Debugging

### View Logs

```
expo logs
```

### Developer Menu

- Shake your device or press:
  - iOS Simulator: `Cmd + D`
  - Android Simulator: `Cmd + M`

### Remote Debugging

1. Open the developer menu
2. Select "Debug Remote JS" to open Chrome DevTools
3. View console logs, network requests, and set breakpoints

### Error Handling

The app includes an Error Boundary component that catches and displays React errors on screen and logs them to the console.

## API Integration

The app communicates with a backend server for:
- User authentication
- Image processing
- Video generation

Make sure the backend server is running and accessible at the URL specified in your `.env` file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 