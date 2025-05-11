module.exports = function (api) {
    api.cache(true)
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              "better-auth/react": "./node_modules/better-auth/dist/client/react/index.cjs",
              "better-auth/client/plugins": "./node_modules/better-auth/dist/client/plugins/index.cjs",
              "@better-auth/expo/client": "./node_modules/@better-auth/expo/dist/client.cjs",
              '@': './',
            },
          },
        ],
        [
          '@tamagui/babel-plugin',
          {
            components: ['tamagui'],
            config: './tamagui.config.ts',
            logTimings: true,
            disableExtraction: process.env.EXPO_PUBLIC_NODE_ENV === 'development',
          },
        ],  
        // NOTE: this is only necessary if you are using reanimated for animations
        'react-native-reanimated/plugin',
      ],
    }
  }
  