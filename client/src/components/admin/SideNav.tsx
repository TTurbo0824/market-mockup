import { NavLink } from 'react-router-dom';
import { useStores } from '../../../src/stores/Context';
import { Colors } from '../utils/_var';
import styled from 'styled-components';

const SideNavWrapper = styled.div`
  padding-left: 1rem;
  ul {
    padding: 0;
  }
  a {
    text-decoration: none;
  }
`;

const Menu = styled.li`
  cursor: pointer;
  list-style: none;
  width: fit-content;
  margin: 0.9rem 0.25rem;
  padding-bottom: 0.15rem;
  color: ${Colors.gray};
  :first-of-type {
    margin-top: 1.25rem;
    
  }
  :not(:last-of-type) {
    border-bottom: 4px solid ${(props) => props.color};
    font-weight: ${(props) => (props.color !== 'white' ? 'bold' : 'normal')};
  }
`;

function SideNav() {
  const { userStore } = useStores();
  const curPath = window.location.pathname.split('/admin/')[1];

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
        {navMenu.map((menu) =>
          menu !== 'signout' ? (
            <Menu key={menu} color={curPath === menu ? Colors.blue : 'white'}>
              <NavLink to={`${menu}`} style={{ color: curPath === menu ? 'black' : Colors.gray }}>
                {navObj[menu]}
              </NavLink>
            </Menu>
          ) : (
            <Menu key={menu} onClick={handleSignout}>
              {navObj[menu]}
            </Menu>
          ),
        )}
      </ul>
    </SideNavWrapper>
  );
}

export default SideNav;
