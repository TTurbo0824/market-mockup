import { useState } from 'react';
import { useStores } from '../stores/Context';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Colors, priceToString } from '../components/utils/_var';
import EmptyCart from '../components/EmptyCart';

const CartpageWrapper = styled.div`
  width: 65rem;
  min-height: calc(100vh - 156px);
  display: grid;
  grid-template-areas: 'cart pay';
  grid-template-columns: 73% 27%;
  margin: 0 auto;
  button,
  input,
  label {
    cursor: pointer;
  }
`;

const CartContainer = styled.div`
  grid-area: cart;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const CheckAll = styled.input`
  margin-right: 0.5rem;
`;

const SelDeleteBnt = styled.button`
  background-color: white;
  border: none;
  text-decoration: underline;
  margin-left: auto;
  margin-right: 1rem;
  text-align: right;
`;

const ItemContainer = styled.div`
  display: grid;
  width: 100%;
  height: fit-content;
  grid-template-areas: 'check img item price delete';
  grid-template-columns: 6% 15% 39% 35% 5%;
  border: 1px solid ${Colors.lightGray};
  margin: 0.75rem 1.25rem 0 0;
  padding: 1rem 0.5rem;
`;

const CartImg = styled.img`
  grid-area: img;
  width: 5rem;
`;

const CheckEach = styled.input`
  grid-area: check;
`;

const DeleteBnt = styled.button`
  grid-area: delete;
  background-color: white;
  border: none;
  font-size: 1.25rem;
  align-self: flex-start;
`;

const NameDiv = styled.div`
  grid-area: item;
`;

const PriceDiv = styled.div`
  width: 100%;
  text-align: center;
`;

const PriceContainer = styled.div`
  grid-area: price;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0.5rem;
`;

const QuantContainer = styled.div`
  display: flex;
  border: 1px solid ${Colors.borderColor};
  width: fit-content;
  height: fit-content;
  align-items: center;
`;

const Quant = styled.div`
  padding-right: 0.4rem;
  width: 1.75rem;
  text-align: right;
`;

const QuantBnt = styled.div`
  width: 1.3rem;
  text-align: center;
  :first-child {
    border-right: 1px solid ${Colors.borderColor};
  }
  :last-child {
    border-left: 1px solid ${Colors.borderColor};
  }
  :hover {
    cursor: pointer;
  }
`;

const PayContainer = styled.div`
  grid-area: pay;
  height: 22rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border: 1px solid ${Colors.lightGray};
  padding: 1.25rem 1rem;
  margin-left: 0.25rem;
`;

const TotalQuant = styled.div`
  width: 100%;
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${Colors.lightGray};
`;

const OrderBnt = styled.button`
  width: 100%;
  height: 3rem;
  margin-top: auto;
  font-size: 1rem;
  color: white;
  background-color: ${Colors.blue};
  border: none;
  margin-top: auto;
`;

const TitleSpan = styled.span`
  width: 100%;
  font-weight: bold;
`;

const SpanContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  :last-of-type {
    border-top: 1px solid lightgray;
    padding-top: 1rem;
  }
`;

function Cartpage() {
  const { itemStore } = useStores();
  const { cartStore } = useStores();
  const { modalStore } = useStores();
  const allCartItems = cartStore.getCartItems;
  const itemQuantity = cartStore.getItemQuant;
  const itemIdArr = allCartItems.map((el) => el.id);
  const [checkedItems, setCheckedItems] = useState(itemIdArr);

  const handleAllCheck = (checked: boolean) => {
    setCheckedItems(checked ? itemIdArr : []);
  };

  const handleEachCheck = (checked: boolean, id: number) => {
    if (checked) {
      setCheckedItems([...checkedItems, id]);
    } else {
      setCheckedItems(checkedItems.filter((el) => el !== id));
    }
  };

  const handleBulkDelete = () => {
    cartStore.removeBulk(checkedItems);
    window.location.reload();
  };

  const handlePlus = (id: number) => {
    cartStore.plusQuantity(id);
  };

  const handleMinus = (id: number, quantity: number) => {
    if (quantity === 1) {
      modalStore.openModal(`확인삭제_${id}`);
    } else cartStore.minusQuantity(id);
  };

  const getTotalPrice = () => {
    let total = {
      price: 0,
      quantity: 0
    };

    for (let i = 0; i < itemIdArr.length; i++) {
      if (checkedItems.includes(itemIdArr[i])) {
        let quantity = itemQuantity[i].quantity;
        let price = allCartItems[i].price * quantity;
        total.quantity += quantity;
        total.price += price;
      }
    }

    return total;
  };

  const total = getTotalPrice();

  const getDate = () => {
    var today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString().replace('T', ' ').substring(0, 10);
  };

  const getPaidList = () => {
    const tempList = allCartItems
      .filter((el) => checkedItems.includes(el.id))
      .map((el) => {
        let tempItem = {
          id: el.id,
          itemName: el.itemName,
          price: el.price * itemQuantity[checkedItems.indexOf(el.id)].quantity,
          quantity: itemQuantity[checkedItems.indexOf(el.id)].quantity,
          img: el.img
        };

        return tempItem;
      });

    return tempList;
  };

  const handlePayment = () => {
    if (allCartItems.length === 0) {
      modalStore.openModal('장바구니가 비어있습니다.');
    } else {
      const paidList = getPaidList();
      const curDate = getDate();
      itemStore.addToPaidList(paidList, curDate, total.price);
      handleBulkDelete();
    }
  };

  const handleModal = (message: string, items: number[]) => {
    if (allCartItems.length === 0) {
      modalStore.openModal('장바구니가 비어있습니다.');
    } else {
      modalStore.openModal(message);
      cartStore.setToBeDeleted(items);
    }
  };

  const deliveryCharge = 0;
  const discount = 0;
  const finalPrice = total.price + deliveryCharge - discount;

  const prices = [
    {
      field: '상품 가격',
      amount: total.price
    },
    {
      field: '배송비',
      amount: deliveryCharge
    },
    {
      field: '할인 예상금액',
      amount: discount
    },
    {
      field: '총 주문금액',
      amount: finalPrice
    }
  ];

  return (
    <CartpageWrapper>
      <CartContainer>
        <label>
          <CheckAll
            type="checkbox"
            checked={checkedItems.length === allCartItems.length ? true : false}
            onChange={(e) => handleAllCheck(e.target.checked)}
          />
          전체선택
        </label>
        <SelDeleteBnt onClick={() => handleModal('선택삭제', checkedItems)}>선택삭제</SelDeleteBnt>
        {allCartItems.length !== 0 ? (
          allCartItems.map((item, idx) => (
            <ItemContainer key={idx}>
              <CheckEach
                type="checkbox"
                onChange={(e) => handleEachCheck(e.target.checked, item.id)}
                checked={checkedItems.includes(item.id)}
              />
              <CartImg src={item.img} />
              <DeleteBnt onClick={() => handleModal('개별삭제', [item.id])}>✕</DeleteBnt>
              <NameDiv>{item.itemName}</NameDiv>
              <PriceContainer>
                <PriceDiv>{priceToString(item.price * itemQuantity[idx].quantity)}원</PriceDiv>
                <QuantContainer>
                  <QuantBnt onClick={() => handleMinus(item.id, itemQuantity[idx].quantity)}>
                    -
                  </QuantBnt>
                  <Quant>{itemQuantity[idx].quantity}</Quant>
                  <QuantBnt onClick={() => handlePlus(item.id)}>+</QuantBnt>
                </QuantContainer>
              </PriceContainer>
            </ItemContainer>
          ))
        ) : (
          <EmptyCart />
        )}
      </CartContainer>
      <PayContainer>
        <TitleSpan>최종 결제금액</TitleSpan>
        <TotalQuant>
          <span>총 주문상품</span>
          {total.quantity}개
        </TotalQuant>
        {prices.map((price, idx) => (
          <SpanContainer key={idx}>
            <span>{price.field}</span>
            {priceToString(price.amount)}원
          </SpanContainer>
        ))}
        <OrderBnt onClick={handlePayment}>주문하기</OrderBnt>
      </PayContainer>
    </CartpageWrapper>
  );
}

export default observer(Cartpage);
