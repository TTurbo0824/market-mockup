import { useStores } from '../../../../stores/Context';
import styled from 'styled-components';
import { ModalBackdrop } from '../../../../components/Modal';
import { CloseBnt } from '../../../Signin';
import { Colors, priceToString } from '../../../../components/utils/_var';
import { Transaction } from '../../../../interface/Admin';
import axiosInstance from '../../../../components/utils/axiosInstance';

const TransModalView = styled.div`
  position: relative;
  width: 20rem;
  height: 21.5rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  background-color: white;
  padding: 0.5rem 0.75rem;
  box-shadow: 10px 10px gray;
`;

const InfoContainer = styled.div`
  width: 100%;
  margin-bottom: 0.25rem;
  padding: 0.9rem;
  padding-top: 0.25rem;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: left;
  line-height: 1.6rem;
  :first-of-type {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  :last-of-type {
    color: ${Colors.blue};
    border-top: 1px solid ${Colors.borderColor};
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
`;

const BntContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5rem;
  justify-content: right;
`;

const CancelBnt = styled.button`
  background-color: ${Colors.blue};
  color: white;
  border: none;
  height: 2rem;
  margin: auto 0.25rem 1rem 0.25rem;
  :first-of-type {
    background-color: white;
    color: black;
    border: 1px solid ${Colors.borderColor};
  }
`;

type TransProp = {
  handleApprov: (id: number | null) => void;
  handleModal: () => void;
  trans: Transaction;
};

function TransModal({ handleModal, handleApprov, trans }: TransProp) {
  const { modalStore } = useStores();

  const handleCancelOrder = (type: string, orderId: number | null) => {
    axiosInstance
      .patch('/admin-order', { orderId, type })
      .then(() => {
        handleModal();
        handleApprov(orderId);
      })
      .catch((error) => {
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
          <OrderInfo>결제취소</OrderInfo>
          <OrderInfo>
            주문번호
            <div>
              {trans.paymentDate.slice(0, 10)}-{trans.uniqueId}
            </div>
          </OrderInfo>
          <OrderInfo>
            구매자<div>{trans.username}</div>
          </OrderInfo>
          <OrderInfo>
            결제일<div>{trans.paymentDate.slice(0, 10)}</div>
          </OrderInfo>
          <OrderInfo>
            결제금액<div>{priceToString(trans.paymentAmount)}</div>
          </OrderInfo>
          <OrderInfo>
            취소요청일<div>{trans.cancelRequestDate?.slice(0, 10)}</div>
          </OrderInfo>
          <OrderInfo>
            취소요청금액<div style={{ color: Colors.blue }}>{priceToString(trans.paymentAmount)}</div>
          </OrderInfo>
        </InfoContainer>
        <BntContainer>
          <CancelBnt onClick={() => handleCancelOrder('decline', trans.id)}>취소거절</CancelBnt>
          <CancelBnt onClick={() => handleCancelOrder('approv', trans.id)}>취소승인</CancelBnt>
        </BntContainer>
      </TransModalView>
    </ModalBackdrop>
  );
}

export default TransModal;
