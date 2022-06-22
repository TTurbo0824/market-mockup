import styled from 'styled-components';
import { useStores } from '../stores/Context';
import { observer } from 'mobx-react';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem;
  margin-left: 1.25rem;

  ul {
    display: flex;
    padding-left: 0;
    margin: 0;
  }
`;

const NavMenu = styled.li`
  display: flex;
  height: fit-content;
  list-style-type: none;
  margin-left: 1rem;
`;

const HeaderIcon = styled.img`
  cursor: pointer;
  width: 1.6rem;
  height: 1.5rem;
  vertical-align: middle;
  margin-bottom: 0.15rem;
`;

const CartQuant = styled.div`
  width: 1.5rem;
  margin-left: 0.5rem;
`;

function Header() {
  const { cartStore } = useStores();
  const allCart = cartStore.getCartItems;

  const handleRouting = (route: string) => {
    window.location.replace(route);
  };

  return (
    <HeaderWrapper>
      <HeaderIcon onClick={() => handleRouting('/')} src="../../images/icons/home.png" />
      <nav>
        <ul>
          <NavMenu onClick={() => handleRouting('/mypage')}>
            <HeaderIcon src="../../images/icons/person.png" />
          </NavMenu>
          <NavMenu onClick={() => handleRouting('/cart')}>
            <HeaderIcon src="../../images/icons/cart.png" />
            <CartQuant>{allCart.length}</CartQuant>
          </NavMenu>
        </ul>
      </nav>
    </HeaderWrapper>
  );
}

export default observer(Header);
