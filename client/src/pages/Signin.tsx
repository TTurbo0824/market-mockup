import { useState } from 'react';
import { useStores } from '../stores/Context';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { ModalBackdrop } from '../components/Modal';
import { Colors } from '../components/utils/_var';
import { sign } from 'crypto';
import axios from 'axios';
import { User } from '../stores/UserStore';

const SigninView = styled.div`
  position: relative;
  width: 16.5rem;
  height: 18rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  background-color: white;
  padding: 0.5rem 0.75rem;
  box-shadow: 10px 10px grey;
`;

const CloseBnt = styled.button`
  background-color: white;
  border: none;
  font-size: 1.25rem;
  margin-right: 0;
  margin-left: auto;
  /* background-color: lime; */
`;

const ModeContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

const ModeBnt = styled.button`
  padding: 0.2rem;
  width: 6rem;
  background-color: ${(props) => props.color};
  border: none;
  border: 1px solid ${Colors.blue};
  color: ${(props) => (props.color !== 'white' ? 'white' : Colors.blue)};
`;

const SigninInput = styled.input`
  width: 12rem;
  height: 1.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${Colors.borderColor};
`;

const SigninBnt = styled.button`
  background-color: ${Colors.blue};
  width: 12rem;
  height: 2rem;
  color: white;
  border: none;
  /* margin-top: .25rem; */
  padding: 0.25rem;
`;

type SigninProp = {
  handleSigninModal: () => void;
};

function Signin({ handleSigninModal }: SigninProp) {
  const { userStore } = useStores();
  const { cartStore } = useStores();

  const [mode, setMode] = useState('user');
  const [signinInfo, setSigninInfo] = useState({
    username: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setSigninInfo({ ...signinInfo, [key]: e.target.value });
  };

  const handleSignin = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/signin`, signinInfo, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res.data.accessToken;
        }
      })
      .then((token) => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/user-info`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            userStore.signIn(res.data.data);
            return res.data.data.token
          })
          .then((token) => {
            axios
              .post(`${process.env.REACT_APP_API_URL}/cart`,{newItems: cartStore.getItemQuant}, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              })
              .then((res) => {
                if (res.status === 200) {
                  cartStore.setUpCart(res.data.cartItems, res.data.cartQuant);
                  handleSigninModal();
                }
              });
          });
      })
      .catch((error) => {
        console.log(error);
        // if (error.response.data.message === 'please check your password and try again') {
        //   setErrorMsg('잘못된 비밀번호입니다');
        // }
      });
  };

  // console.log(signinInfo);

  return (
    <ModalBackdrop>
      <SigninView>
        <CloseBnt onClick={handleSigninModal}>✕</CloseBnt>
        <ModeContainer>
          <ModeBnt onClick={() => setMode('user')} color={mode === 'user' ? Colors.blue : 'white'}>
            일반회원
          </ModeBnt>
          <ModeBnt
            onClick={() => setMode('admin')}
            color={mode === 'admin' ? Colors.blue : 'white'}>
            관리자
          </ModeBnt>
        </ModeContainer>
        <SigninInput placeholder="아이디" onChange={(e) => handleInput(e, 'username')} />
        <SigninInput
          placeholder="비밀번호"
          type="password"
          onChange={(e) => handleInput(e, 'password')}
        />
        <SigninBnt onClick={handleSignin}>
          {mode === 'user' ? '로그인' : '관리자로 로그인'}
        </SigninBnt>
        {errorMsg}
      </SigninView>
    </ModalBackdrop>
  );
}

export default observer(Signin);
