import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

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

  const onPressBtn = () => {
    navigation.navigate('Track');
  };
  return (
    <HomeView>
      <TitleView>
        <TitleText>비전캐스트</TitleText>
      </TitleView>
      <BottomView>
        <ButtonView onPress={() => onPressBtn()}>
          <ButtonText>시작하기</ButtonText>
        </ButtonView>
      </BottomView>
    </HomeView>
  );
}

export default Home;
