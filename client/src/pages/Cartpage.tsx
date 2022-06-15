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

function Cartpage() {
  const { cartStore } = useStores();
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

  const handleDelete = (item: Item) => {
    cartStore.removeFromCart(item);
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
      // if ()
    }
  };

  return (
    <CartpageWrapper>
      <input
        type="checkbox"
        checked={checkedItems.length === allCartItems.length ? true : false}
        onChange={(e) => handleAllCheck(e.target.checked)}
      />
      <label>전체선택</label>
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
            <div>{itemQuantity[idx].quantity}</div>
            <button onClick={() => handleMinus(item.id, itemQuantity[idx].quantity)}>
              수량 빼기
            </button>
            <button onClick={() => handlePlus(item.id)}>수량 더하기</button>
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
