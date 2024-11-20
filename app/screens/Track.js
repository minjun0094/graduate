import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {Platform, ActivityIndicator} from 'react-native';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {useTranslator} from 'react-native-translator';
import Tts from 'react-native-tts';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

const MainView = styled.View`
  flex: 1;
`;

const CameraView = styled(Camera)`
  flex: 1;
`;

const ProgressBarContainer = styled.View`
  position: absolute;
  bottom: 50px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const StartBtn = styled.TouchableOpacity`
  position: absolute;
  width: 90px;
  height: 90px;
  left: 40%;
  border-radius: 50px;
  border-color: ${({disabled}) => (disabled ? 'gray' : 'white')};
  border-width: 10px;
  bottom: 50px;
  justify-content: center;
  align-items: center;
`;

function Track() {
  const device = useCameraDevice('back'); //사용 카메라 디바이스 정의

  const cameraRef = useRef(null);
  const {translate} = useTranslator(); // useTranslator 훅 사용
  const [translatedCaption, setTranslatedCaption] = useState(''); // 번역된 캡션 상태
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // 버튼 상태 관리
  const [isProcessing, setIsProcessing] = useState(false); // 프로세스 상태

  useEffect(() => {
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-progress', event =>
      console.log('progress', event),
    );
    Tts.addEventListener('tts-finish', () => {
      console.log('TTS finished');
      setIsProcessing(false);
      setIsButtonDisabled(false); // TTS가 끝나면 버튼 활성화
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
    Tts.setDefaultLanguage('ko-KR'); // 한국어 설정
    Tts.setDefaultRate(0.5); // 음성 속도 설정
  }, []);

  const uploadToFirebase = async fileUri => {
    const fileName = 'uploads/' + Date.now() + '.jpg'; // 고유 파일명
    const isIOS = Platform.OS === 'ios';

    try {
      if (isIOS) {
        // iOS: 기존 방식 사용
        const storageInstance = getStorage();
        const fileRef = ref(storageInstance, fileName);

        const response = await fetch(fileUri);
        const blob = await response.blob();

        const snapshot = await uploadBytes(fileRef, blob);
        console.log('Uploaded a blob or file (iOS):', snapshot);

        const downloadURL = await getDownloadURL(fileRef);
        console.log('File available at (iOS):', downloadURL);

        // 가져온 URL로 Hugging Face API에 전송
        await sendToHuggingFace(downloadURL);
      } else {
        const storageRef = storage().ref(fileName);
        const data = await RNFS.readFile(fileUri, 'base64');
        await storageRef.putString(data, 'base64');
        // Reference to Firebase Storage

        // Get the file's download URL
        const fileUrl = await storageRef.getDownloadURL();
        console.log('File uploaded successfully! URL:', fileUrl);

        await sendToHuggingFace(fileUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const sendToHuggingFace = async imageUrl => {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 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', // Hugging Face API 토큰
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({inputs: imageUrl}), // Firebase Storage의 이미지 URL
      },
    );
    console.log(response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    const generatedCaption = result[0]?.generated_text || '';
    console.log('Generated caption:', generatedCaption);

    // 캡션을 한국어로 번역
    translateCaptionToKorean(generatedCaption);
  };

  const translateCaptionToKorean = async caption => {
    try {
      const translated = await translate('en', 'ko', caption); // 영어 캡션을 한국어로 번역
      console.log('Translated caption:', translated);
      setTranslatedCaption(translated); // 번역된 결과를 상태에 저장

      // 번역된 텍스트를 음성으로 읽기
      Tts.speak(translated);
    } catch (error) {
      console.error('Error translating caption:', error);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true); // 프로세스 시작
        setIsButtonDisabled(true); // 버튼 비활성화
        const photo = await cameraRef.current.takePhoto({
          quality: 0.5,
        });
        console.log('Photo taken:', photo);
        await uploadToFirebase(photo.path); // Firebase에 업로드
      } catch (error) {
        console.error('Error taking photo:', error);
        setIsButtonDisabled(false); // 에러 발생 시 버튼 활성화
        setIsProcessing(false); // 에러 발생 시 프로세스 종료
      }
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(takePhoto, 10000); // 10초마다 사진 촬영

  //   return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  // }, []);

  return (
    <MainView>
      <CameraView
        ref={cameraRef}
        device={device}
        isActive={true}
        photo={true}
      />
      {/* <StartBtn> */}

      <ProgressBarContainer>
        {isProcessing ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <StartBtn
            disabled={isButtonDisabled}
            onPress={() => {
              takePhoto();
            }}
          />
        )}
      </ProgressBarContainer>
    </MainView>
  );
}

export default Track;
