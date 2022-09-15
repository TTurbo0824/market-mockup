import styled from 'styled-components';
import MainBnt from '../../../components/MainBnt';

const EmptyCartContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
`;

const EmptyCartImg = styled.img`
  object-fit: contain;
  width: 20rem;
  margin-top: 0.5rem;
`;

export const Indicator = styled.div`
  width: 100%;
  text-align: center;
`;

function EmptyCart() {
  return (
    <EmptyCartContainer>
      <EmptyCartImg src='/images/icons/empty_cart.png' />
      <Indicator>장바구니에 담긴 상품이 없습니다.</Indicator>
      <MainBnt />
    </EmptyCartContainer>
  );
}

export default EmptyCart;
