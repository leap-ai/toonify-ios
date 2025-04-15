# Image-to-Video Generator Mobile App

This is a React Native mobile application for generating videos from images using AI. It works with the image-to-video backend to provide a seamless user experience.

## Features

- User authentication with JWT
- Image selection from device gallery
- Text prompt input for video generation
- Real-time status polling for generation progress
- Video playback of generated content
- Generation history with thumbnails

## Tech Stack

- [React Native](https://reactnative.dev/) - Cross-platform mobile app framework
- [Expo](https://expo.dev/) - Development platform for React Native (SDK 52.0.0)
- [Axios](https://axios-http.com/) - HTTP client for API requests
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) - Image selection from device
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) - Secure storage for authentication tokens
- [react-native-video](https://github.com/react-native-video/react-native-video) - Video playback component

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (SDK 52.0.0)

### Installation

1. Clone the repository
2. Navigate to the frontend-mobile directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Use the Expo Go app on your device to scan the QR code

### Troubleshooting

If you encounter the "EMFILE: too many open files" error:

1. Make sure you're using Node.js v16 or higher
2. Try running with the `--no-dev` flag:
   ```bash
   npx expo start --no-dev
   ```
3. If using a physical device, make sure your phone and computer are on the same network

## Usage

1. Login with the demo account
2. Select an image from your device
3. Enter a prompt describing the animation you want
4. Tap "Generate Video" to start the generation process
5. Wait for the generation to complete
6. View your generated video
7. Access your generation history at the bottom of the screen

## API Integration

The app communicates with the backend API running on `http://localhost:3000`. If you're running the app on a physical device, you'll need to update the `API_BASE` constant in `App.js` to point to your computer's IP address or use a service like ngrok to expose your local server.

## Development

The app is structured as a single-screen application with the following components:

- Authentication flow
- Image selection
- Prompt input
- Video generation
- Status polling
- Video playback
- History display

## License

MIT 