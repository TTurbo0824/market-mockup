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

export const HistoryContainer = styled.div`
  width: 100%;
  height: fit-content;
  border: 1px solid ${Colors.borderColor};
  margin-bottom: 1rem;
  padding: 0.75rem;
  :last-of-type {
    margin-bottom: 2rem;
  }
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const OrderInfo = styled.div`
  margin-bottom: 0.75rem;
`;

export const TotalPrice = styled.div`
  text-align: right;
`;

const EmptyContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const DetailBnt = styled.button`
  border: 1px solid ${Colors.borderColor};
  background-color: white;
`;

function HistoryPage() {
  const { itemStore } = useStores();
  const { modalStore } = useStores();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await axiosInstance.get('/order').then((result) => {
          itemStore.importPaidList(result.data.data);
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
        paidList.reverse().map((el, idx) => (
          <HistoryContainer key={idx}>
            <TopContainer>
              <OrderInfo>
                {el.date} {el.status}
              </OrderInfo>
              <DetailBnt onClick={() => toDetailPage(el.id)}>상세내역보기</DetailBnt>
            </TopContainer>
            {el.items.length <= 1 ? (
              <div>{el.items[0].itemName}</div>
            ) : (
              <div>
                {el.items[0].itemName} <span style={{ color: Colors.blue }}>외 {el.items.length - 1}건</span>
              </div>
            )}
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
