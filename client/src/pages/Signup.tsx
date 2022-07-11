import { useState } from 'react';
import { useStores } from '../stores/Context';
import { ModalBackdrop } from '../components/Modal';
import {
  SigninView,
  ErrorMsg,
  UserInput,
  SigninBnt,
  CloseBnt,
  SignupDiv,
  SignupSpan,
  SignupBnt,
} from './Signin';
import styled from 'styled-components';
import axiosInstance from '../components/utils/axiosInstance';

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1.25rem;
`;

type SignupProp = {
  handleSigninModal: () => void;
  handleSignupModal: () => void;
};

function Signup({ handleSignupModal, handleSigninModal }: SignupProp) {
  const { modalStore } = useStores();

  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
  });

  const [checkUsername, setCheckUsername] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [checkRetypePassword, setCheckRetypePassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regExpSpec = /[a-zA-Z0-9]/;

    console.log(e.target.value.length);
    if (!regExpSpec.test(e.target.value)) {
      setCheckUsername('fail');
    } else if (e.target.value.search(/\s/) !== -1) {
      setCheckUsername('space');
    } else if (e.target.value.length < 4 || e.target.value.length > 8) {
      setCheckUsername('length');
    } else {
      setCheckUsername('ok');
    }
  };

  const isValidPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,12}$/;
    if (e.target.value.length < 8 || e.target.value.length > 12) {
      setCheckPassword('length');
    } else if (regExp.test(e.target.value)) {
      setCheckPassword('ok');
    } else {
      setCheckPassword('fail');
    }
  };

  const handleCheckPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== '' && e.target.value === userInfo.password) {
      setCheckRetypePassword(true);
    } else {
      setCheckRetypePassword(false);
    }
  };

  const handleInputValue = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [key]: e.target.value });
  };

  const inputCheck = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputValue(key)(e);
    if (key === 'username') {
      isValidUsername(e);
    }

    if (key === 'password') {
      isValidPassword(e);
    }
  };

  // console.log(checkUsername, checkPassword, checkRetypePassword);
  // console.log(userInfo.username, userInfo.password);

  const handleSignup = () => {
    if (!userInfo.username || !userInfo.password) {
      setErrorMsg('모든 항목을 입력해 주세요.');
    } else if (!checkRetypePassword) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
    } else if (checkPassword === 'length') {
      setErrorMsg('비밀번호는 8-12자입니다.');
    } else if (checkPassword === 'fail') {
      setErrorMsg('비밀번호 형식을 확인해주세요.');
    } else if (checkUsername === 'length') {
      setErrorMsg('아이디는 4-8자입니다.');
    } else if (checkUsername === 'fail') {
      setErrorMsg('아이디 형식을 확인해주세요.');
    } else if (checkUsername === 'space') {
      setErrorMsg('아이디는 공백을 포함하면 안됩니다.');
    } else {
      axiosInstance
        .post('/signup', userInfo)
        .then(() => {
          handleSignupModal();
          modalStore.openModal('회원가입을 축하합니다.');
        })
        .catch((error) => {
          if (error.response.status === 409) {
            setErrorMsg('이미 가입된 아이디입니다.');
          } else if (error.response.status === 417) {
            setErrorMsg('모든 항목을 입력해 주세요.');
          } else {
            handleSignupModal();
            modalStore.openModal(error.response.data.message);
          }
        });
    }
  };

  const handleSignin = () => {
    handleSignupModal();
    handleSigninModal();
  };

  return (
    <ModalBackdrop>
      <SigninView>
        <CloseBnt onClick={handleSignupModal}>✕</CloseBnt>
        <InputContainer>
          <UserInput onChange={inputCheck('username')} placeholder='아이디 (영문, 숫자 4-8자)' />
          <UserInput
            onChange={inputCheck('password')}
            placeholder='비밀번호 (영문, 숫자 포함 8-12자)'
            type='password'
          />
          <UserInput onChange={handleCheckPassword} placeholder='비밀번호 확인' type='password' />
        </InputContainer>
        <SigninBnt onClick={handleSignup}>회원가입</SigninBnt>
        <SignupDiv>
          <SignupSpan>이미 회원이신가요?</SignupSpan>
          <SignupBnt onClick={handleSignin}>로그인</SignupBnt>
        </SignupDiv>
        <ErrorMsg>{errorMsg}</ErrorMsg>
      </SigninView>
    </ModalBackdrop>
  );
}

export default Signup;
