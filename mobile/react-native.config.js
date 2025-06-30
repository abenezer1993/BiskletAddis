module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          project: './ios/Bisklet.xcodeproj',
        },
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android',
          packageImportPath: 'import io.github.oblador.vectoricons.VectorIconsPackage;',
        },
      },
    },
  },
};