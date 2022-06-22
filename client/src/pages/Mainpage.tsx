import styled from 'styled-components';
import { useStores } from '../stores/Context';
import ItemCard from '../components/ItemCard';
import { Item } from '../stores/ItemStore';
import { observer } from 'mobx-react';

const MainpageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const CardContainer = styled.div`
  width: 65rem;
  min-width: 65rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 2rem;
`

export type MainpageProps = {
  handleMessage: (message: string) => void;
};

function Mainpage({ handleMessage }: MainpageProps) {
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
    handleMessage(message);
  };

  return (
    <MainpageWrapper>
      <CardContainer>
        {allItems.map((item, idx) => (
          <ItemCard key={idx} item={item} handleClick={handleClick} />
        ))}
      </CardContainer>
    </MainpageWrapper>
  );
}

export default observer(Mainpage);
