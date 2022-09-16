import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStores } from '../../stores/Context';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { PaidItem } from '../../interface/Item';
import { Colors, priceToString } from '../../components/utils/_var';
import Loading from '../../components/Loading';
import axiosInstance from '../../components/utils/axiosInstance';

interface InfoProp {
  alignContent: string;
}

const DetailWrapper = styled.div`
  width: 60rem;
  min-height: calc(100vh - 136px);
  margin: 0 auto;
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const OrderStatus = styled.div`
  width: 100%;
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${Colors.black};
  display: flex;
  justify-content: space-between;
`;

const OrderBnt = styled.button`
  background-color: ${Colors.blue};
  border: none;
  height: 95%;
  font-size: 0.95rem;
  color: white;
`;

const OrderInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  border-bottom: 1px solid ${Colors.mediumGray};
  padding: 0.75rem 0;
  margin-bottom: 1rem;
  margin-bottom: 0.5rem;
`;

const OrderSpan = styled.span`
  display: inline-block;
  width: 6.5rem;
`;

const OrderInfo = styled.div`
  width: 100%;
  width: 20rem;
  margin-bottom: 0.25rem;
`;

const ItemContainer = styled.div`
  display: grid;
  grid-template-areas: 'img itemName' 'img bottom';
  grid-template-columns: 5.75rem 1fr;
  grid-template-rows: 2rem 1fr;
  width: 100%;
  margin: 0.25rem 0;
  padding: 1rem 0.75rem;
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

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: ${(props: InfoProp) => props.alignContent};
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const HalfContainer = styled.div`
  width: 29.5rem;
  padding: 1.5rem;
  border: 1px solid ${Colors.borderColor};
`;

const Title = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

const FieldDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  line-height: 2rem;
  :last-of-type {
    border-top: 1px solid ${Colors.borderColor};
    margin-top: 0.5rem;
  }
`;

const SelDiv = styled.div`
  select {
    cursor: pointer;
    margin-right: 0.5rem;
    height: 95%;
  }
`;

interface OrderInterface {
  id: number;
  uniqueId: string;
  status: string;
  date: string;
  totalPrice: number;
  items: PaidItem[];
  cancelRequestDate: string;
  cancelDate: string;
}

function TransDetail() {
  const { modalStore } = useStores();
  const { id } = useParams();
  const orderId = Number(id?.split('=')[1]);
  const status = ['취소거절', '취소승인'];

  const userOrder: OrderInterface = {
    id: 0,
    uniqueId: '',
    status: '',
    date: '',
    totalPrice: 0,
    items: [],
    cancelRequestDate: '',
    cancelDate: '',
  };

  const [curOrder, setCurOrder] = useState(userOrder);
  const [userInfo, setUserInfo] = useState({ name: '', username: '' });
  const [orderStat, setOrderStat] = useState(status[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await axiosInstance.get(`/admin-order/order=${orderId}`).then((res) => {
          setUserInfo(res.data.data.userInfo);
          setCurOrder(res.data.data.orderInfo);
          setIsLoading(false);
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('404')) {
            setIsLoading(false);
            window.location.replace('/error');
          } else modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        }
      }
    };
    fetchData();
  }, []);

  const payInfo: { [key: string]: string | null } = {
    상품금액: priceToString(curOrder.totalPrice),
    배송비: '0원',
    할인금액: '-0원',
    '총 결제금액': priceToString(curOrder.totalPrice),
  };

  const payProp = Object.getOwnPropertyNames(payInfo);

  const handleRefundInfo = () => {
    if (curOrder.status === '결제취소') {
      const refundInfo: { [key: string]: string | null } = {
        환불요청금액: priceToString(curOrder.totalPrice),
        상품금액: priceToString(curOrder.totalPrice),
        '반품 처리 비용': '0원',
        '최종 환불금액': priceToString(curOrder.totalPrice),
      };

      const refundProp = Object.getOwnPropertyNames(refundInfo);

      return (
        <HalfContainer>
          <Title>환불안내</Title>
          {refundProp.map((refund, idx) => (
            <FieldDiv key={idx}>
              <div>{refund}</div>
              <div>{refundInfo[refund]}</div>
            </FieldDiv>
          ))}
        </HalfContainer>
      );
    } else return null;
  };

  const handleCancelProp = () => {
    return curOrder.status === '취소요청' || curOrder.status === '취소거절' ? (
      <OrderInfo>
        <OrderSpan> 취소요청일</OrderSpan>
        {curOrder.cancelRequestDate?.slice(0, 10)}
      </OrderInfo>
    ) : (
      <OrderInfo>
        <OrderSpan>결제취소일</OrderSpan>
        {curOrder.cancelDate}
      </OrderInfo>
    );
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tempStat = e.target.value === '취소승인' ? '결제취소' : '취소거절';
    setOrderStat(tempStat);
  };

  const handleCancelOrder = () => {
    const type = orderStat === '결제취소' ? 'approv' : 'decline';

    axiosInstance
      .patch('/admin-order', { orderId, type })
      .then(() => setCurOrder({ ...curOrder, status: orderStat }))
      .catch((error) => {
        if (error.response.status === 401) {
          modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        } else {
          modalStore.openModal(error.response.data.message);
        }
      });
  };

  const handleOrderStat = () => {
    if (curOrder.status === '취소요청') {
      return (
        <OrderStatus>
          {curOrder.status}
          <SelDiv>
            <select onChange={(e) => handleSelect(e)}>
              {status.map((el, idx) => (
                <option value={el} key={idx}>
                  {el}
                </option>
              ))}
            </select>
            <OrderBnt onClick={handleCancelOrder}>확인</OrderBnt>
          </SelDiv>
        </OrderStatus>
      );
    } else return <OrderStatus>{curOrder.status}</OrderStatus>;
  };

  return (
    <DetailWrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {handleOrderStat()}
          <OrderInfoContainer>
            <div>
              <OrderInfo>
                <OrderSpan>주문번호</OrderSpan>
                {curOrder.date}-{curOrder.uniqueId}
              </OrderInfo>
              <OrderInfo>
                <OrderSpan>주문자</OrderSpan>
                {`${userInfo.name} (${userInfo.username})`}
              </OrderInfo>
              <OrderInfo>
                <OrderSpan>결제일</OrderSpan>
                {curOrder.date}
              </OrderInfo>
              {curOrder.status !== '결제완료' ? handleCancelProp() : null}
            </div>
          </OrderInfoContainer>
          {curOrder.items.map((item, idx) => (
            <ItemContainer key={idx}>
              <ItemImg src={`/images/items/${item.img}`} />
              <ItemName>{item.itemName}</ItemName>
              <BottomRow>
                <ItemQuantity>구매수량: {item.quantity}</ItemQuantity>|
                <ItemPrice>{priceToString(item.price)}</ItemPrice>
              </BottomRow>
            </ItemContainer>
          ))}
          <InfoContainer alignContent={curOrder.status !== '결제취소' ? 'right' : 'space-between'}>
            <HalfContainer>
              <Title>결제정보</Title>
              {payProp.map((pay, idx) => (
                <FieldDiv key={idx}>
                  <div>{pay}</div>
                  <div>{payInfo[pay]}</div>
                </FieldDiv>
              ))}
            </HalfContainer>
            {handleRefundInfo()}
          </InfoContainer>
        </>
      )}
    </DetailWrapper>
  );
}

export default observer(TransDetail);
