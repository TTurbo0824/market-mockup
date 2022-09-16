import { useNavigate } from 'react-router-dom';
import { useStores } from '../stores/Context';
import styled from 'styled-components';
import { Colors } from './utils/_var';
import axiosInstance from './utils/axiosInstance';

interface modalProp {
  marginTop: string;
}

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
  padding-top: 1rem;
  padding-bottom: 1.75rem;
  box-shadow: 8px 8px grey;
  font-size: 1rem;
  width: 16.5rem;
  box-shadow: 10px 10px grey;
`;

const Content = styled.div`
  color: black;
  margin: 1.5rem auto 1rem;
  margin-top: ${(props: modalProp) => props.marginTop};
  padding: auto 0.3rem;
  font-size: 1rem;
  white-space: pre-line;
`;

const ModalBnt = styled.button`
  margin-right: 0.3rem;
  padding: 0.25rem 0.5rem;
  background-color: white;
  border: 1px solid ${Colors.blue};
  color: ${Colors.blue};
  border-radius: 5px;
  :nth-of-type(2) {
    margin-right: 0;
    margin-left: 0.3rem;
    background-color: ${Colors.blue};
    border: 1px solid ${Colors.blue};
    color: white;
    border-radius: 5px;
  }
`;

const LowStock = styled.div`
  font-size: 0.9rem;
  width: fit-content;
  margin: -0.5rem auto 0.75rem;
  color: ${Colors.mediumGray};
  padding: 0 1rem;
`;

export type ModalProps = {
  handleModal: () => void;
  handleSigninModal: () => void;
};

function Modal({ handleModal, handleSigninModal }: ModalProps) {
  const navigate = useNavigate();

  const { modalStore, cartStore, userStore, itemStore } = useStores();
  const token = userStore.getUserInfo.token;

  const message = modalStore.modalInfo.message;

  const goToCart = () => {
    handleModal();
    navigate('/cart');
  };

  const goToMain = () => {
    handleModal();
    navigate('/');
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
      axiosInstance
        .delete('/cart-item', { data: { itemId: idToDelete } })
        .then(() => {
          handleModal();
          window.location.reload();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
          } else modalStore.openModal(error.response.data.message);
        });
    } else {
      handleModal();
      window.location.reload();
    }
  };

  const openSigninModal = () => {
    handleSigninModal();
    handleModal();
  };

  const signout = () => {
    localStorage.clear();
    window.location.replace('/');
  };

  const handleWithdrawal = () => {
    axiosInstance
      .delete('/withdrawal')
      .then(() => {
        modalStore.openModal('회원탈퇴가 완료되었습니다.');
        localStorage.clear();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        } else {
          modalStore.openModal(error.response.data.message);
        }
      });
  };

  const handleCancelRequest = (orderId: number) => {
    const today = new Date();
    today.setHours(today.getHours() + 9);
    const cancelRequestDate = today.toISOString().replace('T', ' ').substring(0, 19);

    axiosInstance
      .patch('order', { orderId, cancelRequestDate })
      .then((res) => {
        if (res.status === 200) {
          itemStore.editPaidItemStatus(orderId, cancelRequestDate);
          handleModal();
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        } else {
          modalStore.openModal(error.response.data.message);
        }
      });
  };

  const handleLowStock = () => {
    let itemList: string | string[] = message.split('#')[1];

    return <LowStock>{itemList}</LowStock>;
  };

  return (
    <ModalBackdrop>
      <ModalView>
        {message.includes('삭제') ? (
          <>
            <Content marginTop='1.5rem'>상품을 삭제하시겠습니까?</Content>
            <ModalBnt onClick={handleModal}>취소</ModalBnt>
            <ModalBnt onClick={handleDelete}>삭제</ModalBnt>
          </>
        ) : message === '장바구니가 비어있습니다.' ? (
          <>
            <Content marginTop='1.5rem'>{message}</Content>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
            <ModalBnt onClick={goToMain}>메인으로 이동</ModalBnt>
          </>
        ) : message.includes('로그인') || message.includes('회원가입') ? (
          <>
            <Content marginTop='1rem'>{message}</Content>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
            <ModalBnt onClick={openSigninModal}>로그인</ModalBnt>
          </>
        ) : message.includes('미사용으로') ? (
          <>
            <Content marginTop='1rem'>{message}</Content>
            <ModalBnt onClick={signout}>확인</ModalBnt>
          </>
        ) : message.includes('로그아웃') ? (
          <>
            <Content marginTop='1.5rem'>{message}</Content>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
            <ModalBnt onClick={signout}>로그아웃</ModalBnt>
          </>
        ) : message.includes('추가') ? (
          <>
            <Content marginTop='1.5rem'>{message}</Content>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
            <ModalBnt onClick={goToCart}>장바구니로 이동</ModalBnt>
          </>
        ) : message === '탈퇴하시겠습니까?' ? (
          <>
            <Content marginTop='1.5rem'>{message}</Content>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
            <ModalBnt onClick={handleWithdrawal}>탈퇴하기</ModalBnt>
          </>
        ) : message === '회원탈퇴가 완료되었습니다.' ? (
          <>
            <Content marginTop='1.5rem'>{message}</Content>
            <ModalBnt
              onClick={() => {
                handleModal();
                navigate('/');
              }}
            >
              닫기
            </ModalBnt>
          </>
        ) : message.includes('취소요청하시겠습니까?') ? (
          <>
            <Content marginTop='1.5rem'>{message.split('#')[0]}</Content>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
            <ModalBnt onClick={() => handleCancelRequest(Number(message.split('#')[1]))}>요청하기</ModalBnt>
          </>
        ) : message.includes('결제되지 못한') ? (
          <>
            <Content marginTop='1rem'>{message.split('#')[0]}</Content>
            {handleLowStock()}
            <ModalBnt
              onClick={() => {
                modalStore.closeModal();
                window.location.reload();
              }}
            >
              확인
            </ModalBnt>
          </>
        ) : (
          <>
            <Content marginTop='1.5rem'>{message}</Content>
            <ModalBnt onClick={handleModal}>닫기</ModalBnt>
          </>
        )}
      </ModalView>
    </ModalBackdrop>
  );
}

export default Modal;
