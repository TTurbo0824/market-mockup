import { useState } from 'react';
import styled from 'styled-components';
import { useStores } from '../stores/Context';
import { observer } from 'mobx-react';
import { Item } from '../stores/ItemStore';

const CartpageWrapper = styled.div`
  /* background-color: lime; */
`;

const CartImg = styled.img`
  width: 5rem;
`;

const ItemContainer = styled.div`
  border: 1px solid black;
  margin: 1rem;
  padding: 0.5rem;
`;

const QuantContainer = styled.div`
  display: flex;
  border: 1px solid black;
  width: fit-content;
  align-items: center;
  /* background-color: pink; */
`;

const QuantBnt = styled.div`
  padding: 0 0.3rem;
  width: 0.7rem;
  text-align: center;
  line-height: 1.5rem;
  background-color: lightgray;
  :first-child {
    border-right: 1px solid black;
  }
  :last-child {
    border-left: 1px solid black;
  }
  :hover {
    cursor: pointer;
  }
`;

const Quant = styled.div`
  padding: 0 0.4rem;
  width: 1.25rem;
  text-align: right;
`;

function Cartpage() {
  const { cartStore } = useStores();
  const allCartItems = cartStore.getCartItems;
  const itemQuantity = cartStore.getItemQuant;
  const itemIdArr = allCartItems.map((el) => el.id);

  const [checkedItems, setCheckedItems] = useState(itemIdArr);

  // console.log('item arr', itemIdArr);
  // console.log('checked', checkedItems);

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

  const handleDelete = (item: Item) => {
    cartStore.removeFromCart(item);
    window.location.reload();
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
      alert('아이템을 삭제하시겠습니까?');
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
        let price = Number(allCartItems[i].price) * quantity;
        total.quantity += quantity;
        total.price += price;
      }
    }

    return total;
  };

  const total = getTotalPrice();

  return (
    <CartpageWrapper>
      <label>
        <input
          type="checkbox"
          checked={checkedItems.length === allCartItems.length ? true : false}
          onChange={(e) => handleAllCheck(e.target.checked)}
        />
        전체선택
      </label>
      <button onClick={handleBulkDelete}>선택삭제</button>
      <div>전체 수량: {total.quantity}</div>
      <div>전체 가격: {total.price}</div>
      {allCartItems.length !== 0 ? (
        allCartItems.map((item, idx) => (
          <ItemContainer key={idx}>
            <input
              type="checkbox"
              onChange={(e) => handleEachCheck(e.target.checked, item.id)}
              checked={checkedItems.includes(item.id)}
            />
            <CartImg src={item.img} />
            <div>{item.itemName}</div>
            <div>{Number(item.price) * itemQuantity[idx].quantity}원</div>
            <QuantContainer>
              <QuantBnt onClick={() => handleMinus(item.id, itemQuantity[idx].quantity)}>
                -
              </QuantBnt>
              <Quant>{itemQuantity[idx].quantity}</Quant>
              <QuantBnt onClick={() => handlePlus(item.id)}>+</QuantBnt>
            </QuantContainer>
            <button onClick={() => handleDelete(item)}>삭제</button>
          </ItemContainer>
        ))
      ) : (
        <div>장바구니가 비어있습니다.</div>
      )}
    </CartpageWrapper>
  );
}

export default observer(Cartpage);
