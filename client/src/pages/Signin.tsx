import styled from 'styled-components';
import { observer } from 'mobx-react';
import { ModalBackdrop } from '../components/Modal';
import { useStores } from '../stores/Context';

const SigninView = styled.div`
  box-sizing: border-box;
  background-color: white;
  position: relative;
  text-align: center;
  color: gray;
  width: 15.75rem;
  height: 18rem;
  padding-top: 1.2rem;
  box-shadow: 8px 8px grey;
  font-size: 1rem;
  width: 16.5rem;
  box-shadow: 10px 10px grey;
`;

type SigninProp = {
  handleSigninModal: () => void;
};

function Signin({ handleSigninModal }: SigninProp) {
  const { userStore } = useStores();

  const normalUser = {
    isAdmin: false,
    token: 'access_token',
    id: 0,
    userName: 'testuser',
    password: '1234',
    userStatus: '정상',
    signupDate: '2022.06.01',
    dormantDate: null
  };

  const admin = {
    isAdmin: true,
    token: 'access_token',
    id: 0,
    userName: 'testuser',
    password: '1234',
    userStatus: '정상',
    signupDate: '2022.06.01',
    dormantDate: null
  };

  const handleSignin = (type: string) => {
    if (type === 'user') userStore.signIn(normalUser);
    else userStore.signIn(admin);

    window.location.reload();
  };

  return (
    <ModalBackdrop>
      <SigninView>
        signin
        <button onClick={handleSigninModal}>닫기</button>
        <button onClick={() => handleSignin('user')}>로그인</button>
        <button onClick={() => handleSignin('admin')}>관리자로 로그인</button>
      </SigninView>
    </ModalBackdrop>
  );
}

export default observer(Signin);
