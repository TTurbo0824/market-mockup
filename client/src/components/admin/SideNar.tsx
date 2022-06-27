import styled from 'styled-components';

const SideNarWrapper = styled.div`
  padding-left: 1.5rem;
  ul {
    padding: 0;
  }
`;

const Menu = styled.li`
  cursor: pointer;
  list-style: none;
  width: 100%;
  text-align: left;
  margin-bottom: 1rem;
`;

type SideNavProp = {
  handleNav: (menu: string) => void;
};

function SideNar({ handleNav }: SideNavProp) {
  const navObj: { [key: string]: string } = { item: '상품 관리', user: '회원 관리', trans: '거래 내역', signout: '로그아웃' };
  const navMenu = Object.keys(navObj);

  return (
    <SideNarWrapper>
      <ul>
        {navMenu.map((menu, idx) => (
          <Menu key={idx} onClick={() => handleNav(menu)}>
            {navObj[menu]}
          </Menu>
        ))}
      </ul>
    </SideNarWrapper>
  );
}

export default SideNar;
