import styled from 'styled-components';
import { useStores } from '../stores/Context';
import axiosInstance from './utils/axiosInstance';

export const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  height: 100vh;
`;

const ModalView = styled.div`
  box-sizing: border-box;
  background-color: white;
  position: relative;
  text-align: center;
  color: gray;
  width: 15.75rem;
  height: 9.25rem;
  padding-top: 1.2rem;
  box-shadow: 8px 8px grey;
  font-size: 1rem;
  width: 16.5rem;
  box-shadow: 10px 10px grey;
`;

const Content = styled.div`
  color: black;
  margin: 1.3rem auto 1rem;
  padding: auto 0.3rem;
  font-size: 1rem;
  white-space: pre-line;
`;

const ModalBnt = styled.button`
  margin-left: 0.3rem;
  margin-right: 0.3rem;
`;

export type ModalProps = {
  handleModal: () => void;
  handleSigninModal: () => void;
};

function Modal({ handleModal, handleSigninModal }: ModalProps) {
  const { modalStore } = useStores();
  const { cartStore } = useStores();
  const { userStore } = useStores();
  const token = userStore.getUserInfo.token;

  const message = modalStore.modalInfo.message;

  const goToCart = () => {
    handleModal();
    window.location.replace('/cart');
  };

  const goToMain = () => {
    handleModal();
    window.location.replace('/');
  };

  const handleDelete = () => {
    const idToDelete = [];
    if (message === '개별삭제') {
      cartStore.removeFromCart(cartStore.toBeDeleted[0]);
      idToDelete.push(cartStore.toBeDeleted[0]);
    } else if (message.includes('확인')) {
      const itemId = Number(message.split('_')[1]);
      cartStore.removeFromCart(itemId);
      idToDelete.push(itemId);
    } else {
      cartStore.removeBulk(cartStore.toBeDeleted);
      idToDelete.push(...cartStore.toBeDeleted);
    }

    if (token) {
      axiosInstance.delete('/cart-item', { data: { itemId: idToDelete } }).catch((error) => {
        if (error.response.status === 401) {
          modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        }
      });
    }

    handleModal();
    window.location.reload();
  };

  const openSigninModal = () => {
    handleSigninModal();
    handleModal();
  };

  const signout = () => {
    localStorage.clear();
    window.location.replace('/');
  };

  return (
    <ModalBackdrop>
      <ModalView>
        {message.includes('삭제') ? (
          <>
            <Content>아이템을 삭제하시겠습니까?</Content>
            <ModalBnt onClick={handleDelete}>삭제</ModalBnt>
            <ModalBnt onClick={handleModal}>취소</ModalBnt>
          </>
        ) : message === '장바구니가 비어있습니다.' ? (
          <>
            <Content>{message}</Content>
            <ModalBnt onClick={goToMain}>메인으로 이동</ModalBnt>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
          </>
        ) : message.includes('로그인') || message.includes('회원가입') ? (
          <>
            <Content>{message}</Content>
            <ModalBnt onClick={openSigninModal}>로그인</ModalBnt>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
          </>
        ) : message.includes('미사용으로') ? (
          <>
            <Content>{message}</Content>
            <ModalBnt onClick={signout}>확인</ModalBnt>
          </>
        ) : message.includes('로그아웃') ? (
          <>
            <Content>{message}</Content>
            <ModalBnt onClick={signout}>로그아웃</ModalBnt>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
          </>
        ) : message.includes('추가') ? (
          <>
            <Content>{message}</Content>
            <ModalBnt onClick={goToCart}>장바구니로 이동</ModalBnt>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
          </>
        ) : (
          <>
            <Content>{message}</Content>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
          </>
        )}
      </ModalView>
    </ModalBackdrop>
  );
}

export default Modal;
