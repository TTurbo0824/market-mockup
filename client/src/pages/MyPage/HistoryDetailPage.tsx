import { useParams } from 'react-router-dom';
import { useStores } from '../../stores/Context';
import styled from 'styled-components';
import axiosInstance from '../../components/utils/axiosInstance';
import { HistoryContainer, OrderInfo, TotalPrice } from './HistoryPage';
import { Colors, priceToString } from '../../components/utils/_var';

const DetailWrapper = styled.div`
  width: 65rem;
  min-height: calc(100vh - 136px);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
`;

const OrderStatus = styled.span`
  margin-left: 0.5rem;
`;

const ItemContainer = styled.div`
  display: grid;
  grid-template-areas: 'img itemName' 'img bottom';
  grid-template-columns: 5.75rem 1fr;
  grid-template-rows: 2rem 1fr;
  margin: 0.5rem;
  margin-bottom: 0;
  padding: 0.75rem;
  font-size: 0.9rem;
  :not(:nth-last-child(2)) {
    border-bottom: 1px solid ${Colors.lightGray};
  }
`;

const ItemImg = styled.img`
  grid-area: img;
  width: 4rem;
`;

const ItemName = styled.div`
  grid-area: itemName;
  height: fit-content;
`;

const BottomRow = styled.div`
  grid-area: bottom;
  display: flex;
  height: fit-content;
`;

const ItemQuantity = styled.div`
  margin-right: 0.2rem;
`;

const ItemPrice = styled.div`
  margin-left: 0.2rem;
`;

const CancelBnt = styled.button`
  background-color: ${Colors.blue};
  border: none;
  height: fit-content;
  font-size: 0.95rem;
  color: white;
`;

function HistoryDetail() {
  const { itemStore } = useStores();
  const { modalStore } = useStores();

  const { id } = useParams();
  const orderId = id?.split('=')[1];

  const paidList = itemStore.getPaidList;
  const curOrder = paidList.filter((order) => order.id === Number(orderId))[0];

  const handleCancelRequest = (orderId: number) => {
    axiosInstance
      .patch('order', { orderId })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        } else if (error.response.data.message === 'your quantity exceeds current stock') {
          modalStore.openModal('구매가능 수량을 초과하였습니다.');
        } else {
          modalStore.openModal(error.response.data.message);
        }
      });
  };

  return (
    <DetailWrapper>
      <HistoryContainer>
        <OrderInfo>
          {curOrder.date}-{curOrder.uniqueId}
          <OrderStatus>{curOrder.status}</OrderStatus>
        </OrderInfo>
        {curOrder.status === '결제완료' ? (
          <CancelBnt onClick={() => handleCancelRequest(curOrder.id)}>결제취소</CancelBnt>
        ) : null}
        {curOrder.items.map((item, idx) => (
          <ItemContainer key={idx}>
            <ItemImg src={`../images/items/${item.img}`} />
            <ItemName>{item.itemName}</ItemName>
            <BottomRow>
              <ItemQuantity>구매수량: {item.quantity}</ItemQuantity>|
              <ItemPrice>{priceToString(item.price)}원</ItemPrice>
            </BottomRow>
          </ItemContainer>
        ))}
        <TotalPrice>총 결제금액: {priceToString(curOrder.totalPrice)}원</TotalPrice>
      </HistoryContainer>
    </DetailWrapper>
  );
}

export default HistoryDetail;
