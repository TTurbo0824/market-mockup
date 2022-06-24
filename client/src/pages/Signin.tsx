import styled from 'styled-components';
import { observer } from 'mobx-react';
import { ModalBackdrop } from '../components/Modal';

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
  handleSignin: () => void;
};

function Signin({ handleSignin }: SigninProp) {
  return (
    <ModalBackdrop>
      <SigninView>
        signin
        <button onClick={handleSignin}>닫기</button>
        <button>로그인</button>
        <button>회원가입</button>
      </SigninView>
    </ModalBackdrop>
  );
}

export default observer(Signin);
