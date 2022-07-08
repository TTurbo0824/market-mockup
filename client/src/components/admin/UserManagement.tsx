import { useState, useEffect } from 'react';
import { useStores } from '../../stores/Context';
import axiosInstance from '../utils/axiosInstance';
import styled from 'styled-components';
import { priceToString } from '../utils/_var';
import { PageTitle, TableWrapper, Table } from './ItemManagement';

const UserWrapper = styled.div`
  display: flex;
  height: fit-content;
  flex-wrap: wrap;
  justify-content: center;
`;

function UserManagement() {
  const { adminStore, modalStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/admin-users');
        adminStore.importUserList(res.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          if (error.message.includes('404')) {
            adminStore.importUserList([]);
            setIsLoading(false);
          } else {
            modalStore.openModal(error.message);
            setIsLoading(false);
          }
        }
      }
    };
    fetchData();
  }, []);

  const allUsers = adminStore.getUserList;

  // console.log(allUsers);

  return (
    <UserWrapper>
      <PageTitle>회원조회</PageTitle>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>아이디</th>
              <th>가입일</th>
              <th>가입상태</th>
              <th>주문총액</th>
              <th>휴면전환일</th>
            </tr>
          </thead>
          {allUsers.map((user, idx) => (
            <tbody key={idx}>
              <tr>
                <td>{user.username}</td>
                <td>{String(user.signupDate)}</td>
                <td>{user.userStatus}</td>
                <td>{priceToString(user.orderTotal)}원</td>
                <td>{user.dormantDate || '-'}</td>
              </tr>
            </tbody>
          ))}
        </Table>
      </TableWrapper>
    </UserWrapper>
  );
}

export default UserManagement;
