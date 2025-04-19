module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        'module-resolver',
        {
          alias: {
            "better-auth/react": "./node_modules/better-auth/dist/client/react/index.cjs",
            "better-auth/client/plugins": "./node_modules/better-auth/dist/client/plugins/index.cjs",
            "@better-auth/expo/client": "./node_modules/@better-auth/expo/dist/client.cjs",
          },
        },
      ]
    ],
  };
}; 