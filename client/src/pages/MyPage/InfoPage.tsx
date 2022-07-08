import { useState } from 'react';
import { useStores } from '../../stores/Context';
import styled from 'styled-components';

const InfoWrapper = styled.div`
  width: 65rem;
  min-height: calc(100vh - 136px);
`;

function InfoPage() {
  const { userStore} = useStores();
  const userInfo = userStore.getUserInfo;
  console.log(userInfo);

  const [newInfo, setNewInfo] = useState({
    username: userInfo.username,
    password: ''
  })
  
  return (
  <InfoWrapper>

  </InfoWrapper>);
}

export default InfoPage;
