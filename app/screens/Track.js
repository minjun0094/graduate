import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'; // Firebase storage import

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
      sendToHuggingFace(downloadURL);
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

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Generated caption:', result);
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

  useEffect(() => {
    const interval = setInterval(takePhoto, 10000); // 10초마다 사진 촬영

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  }, []);

  return (
    <MainView>
      <CameraView
        ref={cameraRef}
        device={device}
        isActive={true}
        photo={true}
      />
      <StartBtn>
        {/* <StartBtn
        onPress={() => {
          takePhoto();
        }}> */}
        {/* 버튼 클릭 시에도 사진 촬영 가능하게 할 수 있음 */}
      </StartBtn>
    </MainView>
  );
}

export default Track;
