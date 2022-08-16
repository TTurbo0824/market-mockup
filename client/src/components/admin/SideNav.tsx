import { NavLink } from 'react-router-dom';
import { useStores } from '../../../src/stores/Context';
import styled from 'styled-components';

const SideNavWrapper = styled.div`
  padding-left: 1rem;
  ul {
    padding: 0;
  }
  a {
    color: black;
    text-decoration: none;
  }
`;

const Menu = styled.li`
  cursor: pointer;
  list-style: none;
  width: 80%;
  text-align: left;
  padding: 0.5rem 0.25rem;
  :first-of-type {
  }
`;

function SideNav() {
  const { userStore } = useStores();

  const navObj: { [key: string]: string } = {
    items: '상품 관리',
    users: '회원 관리',
    trans: '거래 내역',
    signout: '로그아웃',
  };

  const navMenu = Object.keys(navObj);

  const handleSignout = () => {
    userStore.signOut();
    window.location.replace('/');
  };

  return (
    <SideNavWrapper>
      <ul>
        {navMenu.map((menu, idx) =>
          menu !== 'signout' ? (
            <Menu key={idx}>
              <NavLink to={`${menu}`}>{navObj[menu]}</NavLink>
            </Menu>
          ) : (
            <Menu key={idx} onClick={handleSignout}>
              {navObj[menu]}
            </Menu>
          ),
        )}
      </ul>
    </SideNavWrapper>
  );
}

export default SideNav;
