import { useStores } from '../../stores/Context';
import styled from 'styled-components';
import { ModalBackdrop } from '../Modal';
import { CloseBnt } from '../../pages/Signin';
import axiosInstance from '../utils/axiosInstance';
import { Colors, priceToString } from '../utils/_var';
import { Transaction } from '../../stores/AdminStore';

const TransModalView = styled.div`
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

const InfoContainer = styled.div`
  width: 15rem;
  display: flex;
  flex-wrap: wrap;
`;

const OrderInfo = styled.div`
  text-align: left;
`;

const CancelBnt = styled.button`
  background-color: ${Colors.blue};
  color: white;
  border: none;
  width: 100%;
  height: 2rem;
  margin-bottom: 0.25rem;
  :last-of-type {
    background-color: white;
    color: black;
    border: 1px solid ${Colors.borderColor};
  }
`;

type TransProp = {
  handleModal: () => void;
  trans: Transaction;
};

function TransModal({ handleModal, trans }: TransProp) {
  const { modalStore } = useStores();
  const handleCancelOrder = (type: string, orderId: number | null) => {
    axiosInstance
      .patch('/admin-order', { orderId, type })
      .then(() => {
        handleModal();
      })
      .catch((error) => {
        // console.log(error)
        if (error.response.status === 401) {
          modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        } else {
          modalStore.openModal(error.response.data.message);
        }
      });
  };

  return (
    <ModalBackdrop>
      <TransModalView>
        <CloseBnt onClick={handleModal}>✕</CloseBnt>
        <InfoContainer>
          <OrderInfo>주문자: {trans.username}</OrderInfo>
          <OrderInfo>
            주문번호: {trans.paymentDate}-{trans.uniqueId}
          </OrderInfo>
          <OrderInfo>주문날짜: {trans.paymentDate}</OrderInfo>
          <OrderInfo>결제금액: {priceToString(trans.paymentAmount)}</OrderInfo>
        </InfoContainer>
        <CancelBnt onClick={() => handleCancelOrder('approv', trans.id)}>취소승인</CancelBnt>
        <CancelBnt onClick={() => handleCancelOrder('decline', trans.id)}>취소거절</CancelBnt>
      </TransModalView>
    </ModalBackdrop>
  );
}

export default TransModal;
