import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../stores/Context';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Colors } from './utils/_var';

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

const MenuDiv = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  top: 3rem;
  right: 2rem;
  width: 7rem;
  background-color: white;
  border: 1px solid ${Colors.borderColor};
  border-radius: 4px;
  padding: 0.4rem;
`;

const MyMenu = styled.button`
  width: 100%;
  text-align: center;
  margin: 0.25rem auto;
  border: none;
  background-color: white;
  font-size: 0.9rem;
`;

export type HeaderProps = {
  handleRouting: (route: string) => void;
  showMenu: boolean;
};

function Header() {
  const navigate = useNavigate();

  const { userStore, cartStore, modalStore } = useStores();
  const allCart = cartStore.getCartItems;
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    window.addEventListener('click', (e: any) => {
      if (showMenu && !e.target.className.toString().includes('prevent')) {
        setShowMenu(false);
      }
    });
  });

  const myMenu = [
    {
      menu: '주문내역',
      onClick: () => {
        navigate('/history');
        setShowMenu(false);
      },
    },
    {
      menu: '회원정보',
      onClick: () => {
        navigate('/info');
        setShowMenu(false);
      },
    },
    {
      menu: '로그아웃',
      onClick: () => modalStore.openModal('로그아웃하시겠습니까?'),
    },
  ];

  const handleRouting = (route: string) => {
    if (route === '/mypage' && userStore.getUserType === 'nonuser') {
      modalStore.openModal('로그인이 필요합니다.\n로그인 하시겠습니까?');
    } else if (route === '/mypage') {
      if (!showMenu) setShowMenu(true);
      else setShowMenu(false);
    } else {
      window.location.replace(route);
    }
  };

  return (
    <HeaderWrapper>
      {userStore.getUserType !== 'admin' ? (
        <HeaderIcon onClick={() => handleRouting('/')} src='../../images/icons/home.png' />
      ) : null}
      <nav>
        <ul>
          {userStore.getUserType !== 'admin' ? (
            <>
              <NavMenu className='prevent' onClick={() => handleRouting('/mypage')}>
                <HeaderIcon className='prevent' src='../../images/icons/person.png' />
              </NavMenu>
              <NavMenu onClick={() => handleRouting('/cart')}>
                <HeaderIcon src='../../images/icons/cart.png' />
                <CartQuant>{allCart.length}</CartQuant>
              </NavMenu>
            </>
          ) : null}
        </ul>
      </nav>
      {showMenu ? (
        <MenuDiv className='prevent'>
          {myMenu.map((el, idx) => (
            <MyMenu className='prevent' key={idx} onClick={el.onClick}>
              {el.menu}
            </MyMenu>
          ))}
        </MenuDiv>
      ) : null}
    </HeaderWrapper>
  );
}

export default observer(Header);
