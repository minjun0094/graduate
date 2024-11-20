import {Platform} from 'react-native';

// firebaseConfig.js
const firebaseConfig = {
  apiKey: 'AIzaSyA6voDY4xpesVKT-Z-C3YhZTlFUDqUJBnE',
  authDomain: 'visionvoice-e2afc.firebaseapp.com',
  projectId: 'visionvoice-e2afc',
  storageBucket: 'visionvoice-e2afc.appspot.com',
  messagingSenderId: '665721181572',
  appId:
    Platform.OS === 'android'
      ? '1:665721181572:android:3c3aaef93b0bda031fb9d1' // Android 앱 ID 입력
      : '1:665721181572:ios:5e8ab644f842e0fb1fb9d1',
};

export default firebaseConfig;
