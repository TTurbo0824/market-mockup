import { useState } from 'react';
import styled from 'styled-components';
import { useStores } from '../stores/Context';
import ItemCard from '../components/ItemCard';
import { Item } from '../stores/ItemStore';
import { observer } from 'mobx-react';

const MainpageWrapper = styled.div`
  /* background-color: lime; */
`;

export type MainpageProps = {
  handleModal: (a: any) => void;
  handleMessage: (a: any) => void;
};

function Mainpage({ handleModal, handleMessage }: MainpageProps) {
  const { itemStore } = useStores();
  const { cartStore } = useStores();
  const allCartItems = cartStore.getCartItems;
  const allItems = itemStore.getItems;

  const handleClick = (item: Item) => {
    if (allCartItems.map((el) => el.id).includes(item.id)) {
      openModal('이미 추가된 상품입니다.');
    } else {
      cartStore.addToCart(item);
      openModal('장바구니에 추가되었습니다.');
    }
  };

  const openModal = (message: string) => {
    handleModal(true);
    handleMessage(message);
  };

  return (
    <MainpageWrapper>
      {allItems.map((item, idx) => (
        <ItemCard key={idx} item={item} handleClick={handleClick} />
      ))}
    </MainpageWrapper>
  );
}

export default observer(Mainpage);
