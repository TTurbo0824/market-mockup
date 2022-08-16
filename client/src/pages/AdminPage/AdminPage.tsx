import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SideNav from '../../components/admin/SideNav';
import ItemManagement from '../../components/admin/ItemManagement';
import UserManagement from '../../components/admin/UserManagement';
import TransactionManagement from '../../components/admin/TransactionManagement';
import TransDetail from './TransDetailPage';

const AdminPageWrapper = styled.div`
  width: 70rem;
  min-height: calc(100vh - 136px);
  flex-wrap: wrap;
  display: grid;
  grid-area: 'sidenav page';
  grid-template-columns: 10rem 1fr;
  margin: 0 auto;
`;

const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 156px);
`;

function AdminPage() {
  const navigate = useNavigate();
  const [curContent, setCurContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    let pathName = window.location.pathname.split('admin/')[1] || 'items';
    if (pathName.includes('id')) pathName = 'detail';
    setCurContent(pages[pathName]);
  }, [navigate]);

  const pages: { [key: string]: JSX.Element } = {
    items: <ItemManagement />,
    users: <UserManagement />,
    trans: <TransactionManagement />,
    detail: <TransDetail />,
  };

  return (
    <AdminPageWrapper>
      <SideNav />
      <PageWrapper>{curContent}</PageWrapper>
    </AdminPageWrapper>
  );
}

export default AdminPage;
