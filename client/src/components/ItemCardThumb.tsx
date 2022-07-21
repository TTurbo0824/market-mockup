import styled from 'styled-components';
import { Item } from '../stores/ItemStore';
import { Colors, priceToString } from './utils/_var';

type ItemProps = {
  item: Item;
  handleClick: (item: Item) => void;
};

const Card = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0.75rem;
  padding: 0.75rem 1.5rem;
  width: 12rem;
`;

const ItemName = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemPrice = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 0.75rem;
`;

const ItemImg = styled.img`
  width: 10rem;
  margin-left: auto;
  margin-right: auto;
`;

const AddBnt = styled.button`
  width: 95%;
  height: 2rem;
  background-color: white;
  border: 1px solid ${Colors.borderColor};
  cursor: pointer;
`;

const Tag = styled.div`
  visibility: ${(props) => props.color};
  background-color: ${Colors.darkGray};
  color: white;
  margin-top: 0.5rem;
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
`;

function ItemCardThumb({ item, handleClick }: ItemProps) {
  return (
    <Card>
      <ItemImg src={`../images/items/${item.img}`} />
      <ItemName>{item.itemName}</ItemName>
      <ItemPrice>{priceToString(item.price)}</ItemPrice>
      <AddBnt onClick={() => handleClick(item)}>장바구니 담기</AddBnt>
      <Tag color={item.status === '품절' ? 'normal' : 'hidden'}>SOLDOUT</Tag>
    </Card>
  );
}

export default ItemCardThumb;
