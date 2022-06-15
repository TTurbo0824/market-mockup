import styled from 'styled-components';

const ModalBackdrop = styled.div`
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
  margin: auto auto 0;
  padding: auto 0.3rem;
  font-size: 1rem;
`;

export type ModalProps = {
  handleModal: (a: any) => void;
  message: string
};

function Modal({handleModal, message}: ModalProps) {
  const goToCart = () => {
    window.location.replace('/cart');
  };

  return (
    <ModalBackdrop>
      <ModalView>
        <Content>{message}</Content>
        <button onClick={goToCart}>장바구니로 이동</button>
        <button onClick={() => handleModal(false)}>닫기</button>
      </ModalView>
    </ModalBackdrop>
  );
}

export default Modal;
