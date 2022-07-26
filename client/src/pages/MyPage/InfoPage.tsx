import { useState } from 'react';
import { useStores } from '../../stores/Context';
import styled from 'styled-components';
import { Colors } from '../../components/utils/_var';
import { ErrorMsg } from '../Signin';
import { TitleDiv } from './HistoryPage';
import axiosInstance from '../../components/utils/axiosInstance';

const InfoWrapper = styled.div`
  width: 60rem;
  min-height: calc(100vh - 136px);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
`;

const InfoContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 15% 6% 1fr;
  margin-bottom: 1.25rem;
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid ${Colors.borderColor};
  border-top: 1px solid ${Colors.borderColor};
  div {
    margin: 1rem 0;
  }
`;

const Divider = styled.div`
  margin: 1rem 0;
  height: 1.5rem;
  border-left: 1px solid ${Colors.mediumGray};
`;

const UserInput = styled.input`
  width: 13.25rem;
  height: fit-content;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const UserBnt = styled.button`
  width: 5.5rem;
  height: 2.25rem;
  margin: 0 0.25rem;
  background-color: white;
  border: 1px solid ${Colors.blue};
  color: ${Colors.blue};
  :first-of-type {
    border-color: ${Colors.blue};
    background-color: ${Colors.blue};
    color: white;
  }
`;

function InfoPage() {
  const { userStore, modalStore } = useStores();
  const userInfo = userStore.getUserInfo;

  const [newInfo, setNewInfo] = useState({
    password: '',
    passwordRetype: '',
  });
  const [checkPassword, setCheckPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (key === 'password') isValidPassword(e);
    setNewInfo({ ...newInfo, [key]: e.target.value });
  };

  const isValidPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,12}$/;
    if (e.target.value.length < 8 || e.target.value.length > 12) {
      setCheckPassword('length');
    } else if (!regExp.test(e.target.value)) {
      setCheckPassword('fail');
    } else {
      setCheckPassword('ok');
    }
  };

  const handleEditInfo = () => {
    if (!newInfo.password || !newInfo.passwordRetype) {
      setErrorMsg('모든 항목을 입력해 주세요.');
    } else if (checkPassword === 'length') {
      setErrorMsg('비밀번호는 8-12자입니다.');
    } else if (checkPassword === 'fail') {
      setErrorMsg('비밀번호 형식을 확인해주세요.');
    } else if (newInfo.password !== newInfo.passwordRetype) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
    } else {
      axiosInstance
        .patch('/user-info', { password: newInfo.password })
        .then(() => {
          modalStore.openModal('회원정보가 수정되었습니다.');
          setNewInfo({
            password: '',
            passwordRetype: '',
          });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
          } else modalStore.openModal(error.response.data.message);
        });
    }
  };

  const handleWithdrawal = () => {
    modalStore.openModal('탈퇴하시겠습니까?');
  };

  return (
    <InfoWrapper>
      <TitleDiv>회원 정보</TitleDiv>
      <InfoContainer>
        <div>이름</div>
        <Divider />
        <div>{userInfo.name}</div>
        <div>아이디</div>
        <Divider />
        <div>{userInfo.username}</div>
        <div>비밀번호</div>
        <Divider />
        <div>
          <UserInput
            onChange={(e) => handleInput(e, 'password')}
            type='password'
            value={newInfo.password}
            placeholder='비밀번호 (영문, 숫자 포함 8-12자)'
          />
        </div>
        <div>비밀번호 확인 </div>
        <Divider />
        <div>
          <UserInput
            onChange={(e) => handleInput(e, 'passwordRetype')}
            value={newInfo.passwordRetype}
            type='password'
          />
        </div>
      </InfoContainer>
      <ButtonContainer>
        <UserBnt onClick={handleEditInfo}>정보수정</UserBnt>
        <UserBnt onClick={handleWithdrawal}>회원탈퇴</UserBnt>
        <ErrorMsg style={{ marginTop: '.75rem' }}>{errorMsg}</ErrorMsg>
      </ButtonContainer>
    </InfoWrapper>
  );
}

export default InfoPage;
