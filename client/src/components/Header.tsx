import styled from 'styled-components';
import { useStores } from '../stores/Context';
import { observer } from 'mobx-react';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem;

  ul {
    display: flex;
    padding-left: 0;
    margin: 0;
  }
`;

const Home = styled.div`
  :hover {
    cursor: pointer;
  }
`
const NavMenu = styled.li`
  list-style-type: none;
  margin-left: .5rem;
  :hover {
    cursor: pointer;
  }
`;

function Header() {
  const { cartStore } = useStores();
  const allCart = cartStore.getCartItems;

  // const routes = {
  //   home: '/',
  //   mypage: 'mypage',
  //   cart: 'cart'
  // };

  // const allMenu = [];

  // for (const key in routes) allMenu.push(key);

  const handleRouting = (route: string) => {
    window.location.replace(route);
  };

  return (
    <HeaderWrapper>
      <Home onClick={() => handleRouting('/')}>home</Home>
      <nav>
        <ul>
          <NavMenu onClick={() => handleRouting('/mypage')}>my page</NavMenu>
          <NavMenu onClick={() => handleRouting('/cart')}>장바구니: {allCart.length}</NavMenu>
        </ul>
      </nav>
    </HeaderWrapper>
  );
}

export default observer(Header);
