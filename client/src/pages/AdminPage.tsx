import { useState } from 'react';
import styled from 'styled-components';
import SideNar from '../components/admin/SideNar';
import TransactionManagement from '../components/admin/TransactionManagement';
const AdminPageWrapper = styled.div`
  min-height: calc(100vh - 156px);
  display: flex;
`;

function AdminPage() {
  const [navMenu, setNavMenu] = useState('item');

  console.log(navMenu)
  const handleNav = (menu: string) => {
    setNavMenu(menu);
  }
  return (
    <AdminPageWrapper>
      <SideNar handleNav={handleNav}/>
      {navMenu === 'trans' ? <TransactionManagement />
      : null }
    </AdminPageWrapper>
  );
}

export default AdminPage;
