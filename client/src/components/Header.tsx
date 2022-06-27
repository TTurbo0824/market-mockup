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
  const { userStore } = useStores();
  const { cartStore } = useStores();
  const { modalStore } = useStores();
  const allCart = cartStore.getCartItems;

  const handleRouting = (route: string) => {
    if (route === '/mypage' && userStore.getUserType === 'nonuser') {
      modalStore.openModal('로그인이 필요합니다.\n로그인 하시겠습니까?');
    } else window.location.replace(route);
  };

  return (
    <HeaderWrapper>
      <HeaderIcon onClick={() => handleRouting('/')} src="../../images/icons/home.png" />
      <nav>
        <ul>
          {userStore.getUserType !== 'admin' ? (
            <>
              <NavMenu onClick={() => handleRouting('/mypage')}>
                <HeaderIcon src="../../images/icons/person.png" />
              </NavMenu>
              <NavMenu onClick={() => handleRouting('/cart')}>
                <HeaderIcon src="../../images/icons/cart.png" />
                <CartQuant>{allCart.length}</CartQuant>
              </NavMenu>
            </>
          ) : null}
        </ul>
      </nav>
    </HeaderWrapper>
  );
}

export default observer(Header);
