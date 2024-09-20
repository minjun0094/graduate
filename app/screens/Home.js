import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {Camera} from 'react-native-vision-camera';
import {Linking} from 'react-native';
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
        const cameraPermission = await Camera.getCameraPermissionStatus();
        console.log(cameraPermission);
        if (cameraPermission === 'granted') {
          // 카메라 권한이 있을 때 실행할 로직
          console.log('카메라 권한이 부여되었습니다.');
        } else if (cameraPermission === 'not-determined') {
          // 아직 권한 요청을 하지 않은 상태로 새롭게 권한 요청하기
          const newCameraPermission = await Camera.requestCameraPermission();
          if (newCameraPermission === 'authorized') {
            // 카메라 권한이 있을 때 실행할 로직
            console.log('카메라 권한이 부여되었습니다.');
          } else if (newCameraPermission === 'denied') {
            // 권한 요청을 했지만 거부됐을 때 실행할 로직
            // ex) 설정으로 이동, 권한이 없으면 카메라 실행할 수 없다는 알림창 등등
            console.log('카메라 권한이 거부되었습니다. 설정으로 이동합니다.');
            await Linking.openSettings();
          }
        } else if (cameraPermission === 'denied') {
          // 권한 요청을 했지만 거부됐을 때 실행할 로직
          // ex) 설정으로 이동, 권한이 없으면 카메라 실행할 수 없다는 알림창 등등
          console.log('카메라 권한이 거부되었습니다. 설정으로 이동합니다.');
          await Linking.openSettings();
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
