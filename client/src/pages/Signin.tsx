import { useState } from 'react';
import { useStores } from '../stores/Context';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { ModalBackdrop } from '../components/Modal';
import { Colors } from '../components/utils/_var';
import axios from 'axios';

export const SigninView = styled.div`
  position: relative;
  width: 16.5rem;
  height: 18rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  background-color: white;
  padding: 0.5rem 0.75rem;
  box-shadow: 10px 10px gray;
`;

export const CloseBnt = styled.button`
  background-color: white;
  border: none;
  font-size: 1.25rem;
  margin-right: 0;
  margin-left: auto;
`;

const ModeContainer = styled.div`
  width: 100%;
  text-align: center;
  margin: 1rem auto;
`;

const ModeBnt = styled.button`
  padding: 0.2rem;
  width: 6.5rem;
  background-color: ${(props) => props.color};
  border: none;
  border: 1px solid ${Colors.blue};
  color: ${(props) => (props.color !== 'white' ? 'white' : Colors.blue)};
`;

export const UserInput = styled.input`
  width: 13rem;
  height: 1.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${Colors.borderColor};
`;

export const SigninBnt = styled.button`
  background-color: ${Colors.blue};
  width: 13rem;
  height: 2rem;
  color: white;
  border: none;
  padding: 0.25rem;
`;

export const ErrorMsg = styled.div`
  font-size: 0.95rem;
  margin-top: 0.5rem;
  color: red;
  opacity: 90%;
`;

export const SignupDiv = styled.div`
  display: flex;
  justify-content: center;
  color: ${Colors.mediumGray};
  width: 12rem;
  margin-top: 0.25rem;
`;

export const SignupSpan = styled.span`
  font-size: 0.85rem;
`;

export const SignupBnt = styled.button`
  font-size: 0.85rem;
  border: none;
  background-color: white;
  text-decoration: underline;
  color: ${Colors.mediumGray};
  :hover {
    color: ${Colors.blue};
  }
`;

type SigninProp = {
  handleSigninModal: () => void;
  handleSignupModal: () => void;
};

function Signin({ handleSigninModal, handleSignupModal }: SigninProp) {
  const { userStore, cartStore, modalStore, itemStore } = useStores();

  const baseURL = process.env.REACT_APP_API_URL;
  const [mode, setMode] = useState('user');
  const [signinInfo, setSigninInfo] = useState({
    username: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setSigninInfo({ ...signinInfo, [key]: e.target.value });
  };

  const handleAdminSignin = () => {
    if (!signinInfo.username || !signinInfo.password) {
      setErrorMsg('모든 항목을 입력해 주세요.');
    } else {
      axios
        .post(
          `${baseURL}/signin`,
          { ...signinInfo, type: 'admin' },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            userStore.signIn(res.data.userInfo);
            return res.data.accessToken;
          }
        })
        .then((token) => {
          axios
            .get(`${baseURL}/admin-items`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
            .then((res) => {
              itemStore.importItemList(res.data.data);
              handleSigninModal();
              window.location.replace('/admin/items');
            });
        })
        .catch((error) => {
          if (error.response.data.message === 'not an administrator') {
            setErrorMsg('등록된 관리자가 아닙니다.');
          } else if (error.response.data.message === 'please check your password and try again') {
            setErrorMsg('잘못된 비밀번호입니다.');
          } else if (error.response.data.message === 'Invalid user') {
            setErrorMsg('가입된 아이디가 아닙니다.');
          } else {
            handleSigninModal();
            modalStore.openModal(error.response.data.message);
          }
        });
    }
  };

  const handleSignin = () => {
    if (!signinInfo.username || !signinInfo.password) {
      setErrorMsg('모든 항목을 입력해 주세요.');
    } else {
      axios
        .post(
          `${baseURL}/signin`,
          { ...signinInfo, type: 'user' },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        )
        .then((res) => {
          if (res.status === 200) {
            userStore.signIn(res.data.userInfo);
            return res.data.accessToken;
          }
        })
        .then((token) => {
          axios
            .post(
              `${baseURL}/cart`,
              { newItems: cartStore.getItemQuant },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              },
            )
            .then((res) => {
              if (res.status === 200) {
                cartStore.setUpCart(res.data.cartItems, res.data.cartQuant);
                handleSigninModal();
                window.location.replace('/');
              }
            });
        })
        .catch((error) => {
          if (error.response.data.message === 'not a normal user') {
            setErrorMsg('관리자 로그인을 이용해주세요.');
          } else if (error.response.data.message === 'please check your password and try again') {
            setErrorMsg('잘못된 비밀번호입니다.');
          } else if (error.response.data.message === 'Invalid user') {
            setErrorMsg('가입된 아이디가 아닙니다.');
          } else {
            handleSigninModal();
            modalStore.openModal(error.response.data.message);
          }
        });
    }
  };

  const handleSignup = () => {
    handleSignupModal();
    handleSigninModal();
  };

  return (
    <ModalBackdrop>
      <SigninView>
        <CloseBnt onClick={handleSigninModal}>✕</CloseBnt>
        <ModeContainer>
          <ModeBnt
            onClick={() => {
              setMode('user');
              setErrorMsg('');
            }}
            color={mode === 'user' ? Colors.blue : 'white'}
          >
            일반회원
          </ModeBnt>
          <ModeBnt
            onClick={() => {
              setMode('admin');
              setErrorMsg('');
            }}
            color={mode === 'admin' ? Colors.blue : 'white'}
          >
            관리자
          </ModeBnt>
        </ModeContainer>
        <UserInput placeholder='아이디' onChange={(e) => handleInput(e, 'username')} />
        <UserInput placeholder='비밀번호' type='password' onChange={(e) => handleInput(e, 'password')} />
        <SigninBnt onClick={mode === 'user' ? handleSignin : handleAdminSignin}>
          {mode === 'user' ? '로그인' : '관리자로 로그인'}
        </SigninBnt>
        {mode === 'user' ? (
          <SignupDiv>
            <SignupSpan>계정이 없으신가요?</SignupSpan>
            <SignupBnt onClick={handleSignup}>회원가입</SignupBnt>
          </SignupDiv>
        ) : null}
        <ErrorMsg>{errorMsg}</ErrorMsg>
      </SigninView>
    </ModalBackdrop>
  );
}

export default observer(Signin);
