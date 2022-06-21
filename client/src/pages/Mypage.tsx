import { useStores } from '../stores/Context';
import styled from 'styled-components';
import { Colors } from '../components/utils/_var';

const MypageWrapper = styled.div`
  width: 65rem;
  margin: 0 auto;
`;

const TitleDiv = styled.div`
  margin-bottom: .5rem;
`
const HistoryContainer = styled.div`
  border: 1px solid ${Colors.borderColor};
  margin-bottom: 1rem;
  padding: .75rem;
`;

const OrderDate = styled.div`
  margin-bottom: .75rem;
`;

const ItemContainer = styled.div`
  display: grid;
  grid-template-areas: 'img itemName' 'img bottom';
  grid-template-columns: 5.75rem 1fr;
  grid-template-rows: 2rem 1fr;
  margin: .5rem;
  margin-bottom: 0;
  padding: .75rem;
  font-size: .9rem;
  :not(:nth-last-child(2)) {
    border-bottom: 1px solid ${Colors.lightGray};
  }
`;

const Img = styled.img`
  grid-area: img;
  width: 4rem;
`;

const ItemName = styled.div`
  grid-area: itemName;
  height: fit-content;
`;

const BottomContainer = styled.div`
  grid-area: bottom;
  display: flex;
  height: fit-content;`;

const ItemQuantity = styled.div`
  margin-right: 0.2rem;
`;

const ItemPrice = styled.div`
  margin-left: 0.2rem;
`;

const TotalPrice = styled.div`
  text-align: right;
`

function Mypage() {
  const { itemStore } = useStores();

  const paidList = itemStore.getPaidList;

  return (
    <MypageWrapper>
      <TitleDiv>주문 내역</TitleDiv>
      {paidList.reverse().map((el, idx) => (
        <HistoryContainer key={idx}>
          <OrderDate>{el.date} 결제 완료</OrderDate>
          {el.items.map((item, idx) => (
            <ItemContainer key={idx}>
              <Img src={item.img} />
              <ItemName>{item.itemName}</ItemName>
              <BottomContainer>
                <ItemQuantity>구매수량: {item.quantity}</ItemQuantity>|
                <ItemPrice>{item.price}원</ItemPrice>
              </BottomContainer>
            </ItemContainer>
          ))}
          <TotalPrice>총 결제금액: {el.totalPrice}원</TotalPrice>
        </HistoryContainer>
      ))}
    </MypageWrapper>
  );
}

export default Mypage;
