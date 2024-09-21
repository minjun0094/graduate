import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'; // Firebase storage import
import {useTranslator} from 'react-native-translator'; // 번역기 import
import {Text} from 'react-native'; // 번역 결과를 표시하기 위해 Text 컴포넌트 사용
import Tts from 'react-native-tts'; // TTS(Talk to Speech) import

const MainView = styled.View`
  flex: 1;
`;

const CameraView = styled(Camera)`
  flex: 1;
`;

const StartBtn = styled.TouchableOpacity`
  position: absolute;
  width: 90px;
  height: 90px;
  left: 40%;
  border-radius: 50px;
  border-color: white;
  border-width: 10px;
  bottom: 50px;
  justify-content: center;
  align-items: center;
`;

function Track() {
  const device = useCameraDevice('back');
  const cameraRef = useRef(null);
  const {translate} = useTranslator(); // useTranslator 훅 사용
  const [translatedCaption, setTranslatedCaption] = useState(''); // 번역된 캡션 상태

  useEffect(() => {
    Tts.setDefaultLanguage('ko-KR'); // 한국어 설정
    Tts.setDefaultRate(0.5); // 음성 속도 설정
  }, []);

  const uploadToFirebase = async fileUri => {
    const storage = getStorage();
    const fileRef = ref(storage, 'uploads/' + Date.now() + '.jpg'); // 고유 파일명으로 저장

    // 파일을 가져와서 Firebase Storage에 업로드
    const response = await fetch(fileUri);
    const blob = await response.blob();

    try {
      const snapshot = await uploadBytes(fileRef, blob);
      console.log('Uploaded a blob or file:', snapshot);

      // Firebase Storage에서 파일 URL 가져오기
      const downloadURL = await getDownloadURL(fileRef);
      console.log('File available at', downloadURL);

      // 가져온 URL로 Hugging Face API에 전송
      await sendToHuggingFace(downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const sendToHuggingFace = async imageUrl => {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning',
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
        const photo = await cameraRef.current.takePhoto({
          quality: 0.5,
        });
        console.log('Photo taken:', photo);
        await uploadToFirebase(photo.path); // Firebase에 업로드
      } catch (error) {
        console.error('Error taking photo:', error);
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
      {/* <Text>{translatedCaption}</Text> 번역된 텍스트 표시 */}
      {/* <StartBtn> */}
      <StartBtn
        onPress={() => {
          takePhoto();
        }}>
        {/* 버튼 클릭 시에도 사진 촬영 가능하게 할 수 있음 */}
      </StartBtn>
    </MainView>
  );
}

export default Track;
