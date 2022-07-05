import { useState, useEffect } from 'react';
import { useStores } from '../../stores/Context';
import styled from 'styled-components';
import { Colors, priceToString } from '../../components/utils/_var';
import MainBnt from '../../components/MainBnt';
import { Indicator } from '../../components/EmptyCart';
import axiosInstance from '../../components/utils/axiosInstance';

const HistoryWrapper = styled.div`
  width: 65rem;
  min-height: calc(100vh - 136px);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
`;

const TitleDiv = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
  text-align: left;
`;

const HistoryContainer = styled.div`
  width: 100%;
  height: fit-content;
  border: 1px solid ${Colors.borderColor};
  margin-bottom: 1rem;
  padding: 0.75rem;
  :last-of-type {
    margin-bottom: 2rem;
  }
`;

const OrderDate = styled.div`
  margin-bottom: 0.75rem;
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

const TotalPrice = styled.div`
  text-align: right;
`;

const EmptyContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

function HistoryPage() {
  const { itemStore } = useStores();
  const { modalStore } = useStores();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await axiosInstance.get('/order').then((result) => {
          itemStore.importPaidList(result.data.data);
          setIsLoading(false);
        });
      } catch (error: any) {
        if (error.message.includes('404')) {
          itemStore.importPaidList([]);
          setIsLoading(false);
        } else modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
      }
    };
    fetchData();
  }, []);

  const paidList = itemStore.getPaidList;

  return (
    <HistoryWrapper>
      <TitleDiv>주문 내역</TitleDiv>
      {paidList && paidList.length !== 0 ? (
        paidList.reverse().map((el, idx) => (
          <HistoryContainer key={idx}>
            <OrderDate>{el.date} 결제 완료</OrderDate>
            {el.items.map((item, idx) => (
              <ItemContainer key={idx}>
                <ItemImg src={`../images/items/${item.img}`} />
                <ItemName>{item.itemName}</ItemName>
                <BottomRow>
                  <ItemQuantity>구매수량: {item.quantity}</ItemQuantity>|
                  <ItemPrice>{priceToString(item.price)}원</ItemPrice>
                </BottomRow>
              </ItemContainer>
            ))}
            <TotalPrice>총 결제금액: {priceToString(el.totalPrice)}원</TotalPrice>
          </HistoryContainer>
        ))
      ) : (
        <EmptyContainer>
          <Indicator>아직 주문한 내역이 없습니다.</Indicator>
          <MainBnt />
        </EmptyContainer>
      )}
    </HistoryWrapper>
  );
}

export default HistoryPage;
