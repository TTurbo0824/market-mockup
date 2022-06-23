import styled from 'styled-components';
import { Item } from '../stores/ItemStore';
import { Colors, priceToString } from './utils/_var';

type ItemProps = {
  item: Item;
  handleClick: (item: Item) => void;
};

const Card = styled.div`
  width: 65rem;
  display: grid;
  grid-template-areas: 'img itemName price cart';
  grid-template-columns: 15% 45% 20% 20%;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border: 1px solid ${Colors.borderColor};
`;

const ItemName = styled.div`
  margin-left: 0.5rem;
`;

const ItemPrice = styled.div`
  text-align: center;
`;

const ItemImg = styled.img`
  width: 7rem;
  margin-left: 0.75rem;
`;

const AddBnt = styled.button`
  cursor: pointer;
  width: fit-content;
  height: 2rem;
  background-color: white;
  border: 1px solid ${Colors.borderColor};
  justify-self: center;
`;

function ItemCardList({ item, handleClick }: ItemProps) {
  return (
    <Card>
      <ItemImg src={item.img} />
      <ItemName>{item.itemName}</ItemName>
      <ItemPrice>{priceToString(item.price)}원</ItemPrice>
      <AddBnt onClick={() => handleClick(item)}>장바구니 담기</AddBnt>
    </Card>
  );
}

export default ItemCardList;
