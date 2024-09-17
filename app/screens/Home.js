import React from 'react';
import styled from 'styled-components/native';

const HomeView = styled.View`
  flex: 1;
  background-color: #42a0f9;
`;

const TitleView = styled.View`
  width: 100%;
  margin-top: 30%;
`;

const TitleText = styled.Text`
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  color: white;
`;

function Home() {
  return (
    <HomeView>
      <TitleView>
        <TitleText>비전캐스트</TitleText>
      </TitleView>
    </HomeView>
  );
}

export default Home;
