import React from 'react';
import styled from 'styled-components/native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  Templates,
  useFrameProcessor,
} from 'react-native-vision-camera';

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
`;

function Track() {
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, Templates.FrameProcessing);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    console.log(`Frame width: ${frame.width}, height: ${frame.height}`);
  }, []);

  return (
    <MainView>
      <CameraView
        device={device}
        isActive={true}
        format={format}
        frameProcessor={frameProcessor}
      />
      <StartBtn />
    </MainView>
  );
}

export default Track;
