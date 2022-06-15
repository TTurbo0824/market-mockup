import styled from 'styled-components';
import { Item } from '../stores/ItemStore';

type ItemProps = {
  item: Item;
  handleClick: (a: any) => void;
};

const Card = styled.div`
  border: 1px solid black;
  margin: 1rem;
`;

const ItemName = styled.div``;

const ItemPrice = styled.div``;

const ItemImg = styled.img`
  width: 10rem;
`;

const AddBnt = styled.button``;

function ItemCard({ item, handleClick }: ItemProps) {

  return (
    <Card>
      <ItemImg src={item.img} />
      <ItemName>{item.itemName}</ItemName>
      <ItemPrice>{item.price}</ItemPrice>
      <AddBnt onClick={() => handleClick(item)}>장바구니 담기</AddBnt>
    </Card>
  );
}

export default ItemCard;
