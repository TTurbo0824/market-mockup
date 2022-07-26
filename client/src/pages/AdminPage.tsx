import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [curContent, setCurContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const pathName = window.location.pathname.split('admin/')[1] || 'items';
    setCurContent(pages[pathName]);
  }, [navigate]);

  const pages: { [key: string]: JSX.Element } = {
    items: <ItemManagement />,
    users: <UserManagement />,
    trans: <TransactionManagement />,
  };

  return (
    <AdminPageWrapper>
      <SideNav />
      <PageWrapper>{curContent}</PageWrapper>
    </AdminPageWrapper>
  );
}

export default AdminPage;
