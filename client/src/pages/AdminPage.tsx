import { useState } from 'react';
import { useStores } from '../../src/stores/Context';
import styled from 'styled-components';
import SideNav from '../components/admin/SideNav';
import ItemManagement from '../components/admin/ItemManagement';
import UserManagement from '../components/admin/UserManagement';
import TransactionManagement from '../components/admin/TransactionManagement';

const AdminPageWrapper = styled.div`
  min-height: calc(100vh - 136px);
  flex-wrap: wrap;
  display: grid;
  grid-area: 'sidenav page';
  grid-template-columns: 10rem 1fr;
`;

const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 156px);
`;

function AdminPage() {
  const { userStore } = useStores();
  const [navMenu, setNavMenu] = useState('item');

  const handleNav = (menu: string) => {
    if (menu !== 'signout') setNavMenu(menu);
    else {
      userStore.signOut();
      window.location.replace('/');
    }
  };

  const pages: { [key: string]: JSX.Element } = {
    item: <ItemManagement />,
    user: <UserManagement />,
    trans: <TransactionManagement />,
  };

  return (
    <AdminPageWrapper>
      <SideNav handleNav={handleNav} />
      <PageWrapper>{pages[navMenu]}</PageWrapper>
    </AdminPageWrapper>
  );
}

export default AdminPage;
