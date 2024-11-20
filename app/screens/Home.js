import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {Camera} from 'react-native-vision-camera';
import {Alert, Linking, Platform} from 'react-native';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../components/firebaseConfig.js';

const HomeView = styled.View`
  flex: 1;
`;

const TitleView = styled.View`
  width: 100%;
  flex: 1;
  margin-top: 40%;
`;

const BottomView = styled.View`
  width: 100%;
  flex: 1;
`;

const TitleText = styled.Text`
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  color: #42a0f9;
`;

const ButtonView = styled.TouchableOpacity`
  margin: 0 auto;
  width: 70%;
  height: 50px;
  border-radius: 15px;
  background-color: #42a0f9;
  position: absolute;
  left: 15%;
  bottom: 100px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
  font-size: 20px;
`;

function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    initializeApp(firebaseConfig); // Firebase 초기화
  }, []);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        let cameraPermission = await Camera.getCameraPermissionStatus();

        // Android와 iOS 권한 상태 확인
        if (
          cameraPermission === 'authorized' ||
          cameraPermission === 'granted'
        ) {
          console.log('카메라 권한이 부여되었습니다.');
        } else if (
          cameraPermission === 'not-determined' ||
          cameraPermission === 'denied'
        ) {
          console.log('카메라 권한이 부여되지 않았습니다. 요청을 시작합니다.');
          const newCameraPermission = await Camera.requestCameraPermission();

          if (
            newCameraPermission === 'authorized' ||
            newCameraPermission === 'granted'
          ) {
            console.log('카메라 권한이 부여되었습니다.');
          } else {
            console.log('카메라 권한이 거부되었습니다.');
            Alert.alert(
              '권한 필요',
              '카메라 권한이 거부되었습니다. 권한 없이는 앱을 사용할 수 없습니다.',
              [{text: '확인'}],
            );
          }
        } else {
          console.log(`예상치 못한 권한 상태: ${cameraPermission}`);
        }
      } catch (error) {
        console.error('권한 확인 중 오류 발생:', error);
      }
    };

    checkPermission();
  }, []);

  return (
    <HomeView>
      <TitleView>
        <TitleText>VisionVoice</TitleText>
      </TitleView>
      <BottomView>
        <ButtonView onPress={() => navigation.navigate('Track')}>
          <ButtonText>시작하기</ButtonText>
        </ButtonView>
      </BottomView>
    </HomeView>
  );
}

export default Home;
