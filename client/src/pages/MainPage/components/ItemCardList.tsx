import styled from 'styled-components';
import { ItemCardProps } from '../../../interface/Item';
import { Colors, priceToString } from '../../../components/utils/_var';

const Card = styled.div`
  cursor: pointer;
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

export const Tag = styled.div`
  background-color: ${Colors.darkGray};
  color: white;
  width: fit-content;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
`;

function ItemCardList({ item, handleClick, goToDetailPage }: ItemCardProps) {
  return (
    <Card onClick={goToDetailPage}>
      <ItemImg src={`/images/items/${item.img}`} />
      <div>
        <ItemName>{item.itemName}</ItemName>
        {item.status === '품절' ? <Tag>SOLDOUT</Tag> : null}
      </div>
      <ItemPrice>{priceToString(item.price)}</ItemPrice>
      <AddBnt onClick={() => handleClick(item)}>장바구니 담기</AddBnt>
    </Card>
  );
}

export default ItemCardList;
