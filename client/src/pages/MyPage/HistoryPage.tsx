import { useState, useEffect } from 'react';
import { useStores } from '../../stores/Context';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Colors, priceToString } from '../../components/utils/_var';
import Loading from '../../components/Loading';
import MainBnt from '../../components/MainBnt';
import { Indicator } from '../../components/EmptyCart';
import axiosInstance from '../../components/utils/axiosInstance';

const HistoryWrapper = styled.div`
  width: 60rem;
  min-height: calc(100vh - 136px);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
`;

export const TitleDiv = styled.div`
  width: 100%;
  margin-top: 1.25rem;
  margin-bottom: 1rem;
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
`;

const HistoryContainer = styled.div`
  width: 100%;
  height: fit-content;
  border: 1px solid ${Colors.borderColor};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem;
  :last-of-type {
    margin-bottom: 2rem;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OrderInfo = styled.div`
  margin-bottom: 0.75rem;
`;

const ItemContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-areas: 'img itemname' 'img price';
  grid-template-columns: 5.5rem 1fr;
  margin: 0.5rem;
  padding: 0.5rem;
`;

const ItemImg = styled.img`
  grid-area: img;
  width: 4rem;
`;

const ItemName = styled.div`
  grid-area: itemname;
`;

const TotalPrice = styled.div`
  grid-area: price;
`;

const EmptyContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const RightContainer = styled.div`
  margin: auto 0.75rem;
`;

const DetailBnt = styled.button`
  border: 1px solid ${Colors.borderColor};
  background-color: white;
  padding: 0.25rem 0.75rem;
`;

function HistoryPage() {
  const navigate = useNavigate();
  const { itemStore, modalStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await axiosInstance.get('/order').then((res) => {
          itemStore.importPaidList(res.data.data);
          setIsLoading(false);
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('404')) {
            itemStore.importPaidList([]);
            setIsLoading(false);
          } else modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        }
      }
    };
    fetchData();
  }, []);

  const paidList = itemStore.getPaidList;

  const toDetailPage = (orderId: number) => {
    navigate(`/history/id=${orderId}`);
  };

  return (
    <HistoryWrapper>
      <TitleDiv>주문 내역</TitleDiv>
      {isLoading ? (
        <Loading />
      ) : paidList && paidList.length !== 0 ? (
        paidList.map((el, idx) => (
          <HistoryContainer key={idx}>
            <LeftContainer>
              <TopContainer>
                <OrderInfo>
                  {el.date} · {el.status}
                </OrderInfo>
              </TopContainer>
              <ItemContainer>
                <ItemImg src={`/images/items/${el.items[0].img}`} />
                {el.items.length <= 1 ? (
                  <ItemName>{el.items[0].itemName}</ItemName>
                ) : (
                  <ItemName>
                    {el.items[0].itemName}
                    <span style={{ color: Colors.blue }}> 외 {el.items.length - 1}건</span>
                  </ItemName>
                )}
                <TotalPrice>총 결제금액: {priceToString(el.totalPrice)}</TotalPrice>
              </ItemContainer>
            </LeftContainer>
            <RightContainer>
              <DetailBnt onClick={() => toDetailPage(el.id)}>상세내역보기</DetailBnt>
            </RightContainer>
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
