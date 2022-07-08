import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStores } from '../../stores/Context';
import { priceToString } from '../utils/_var';
import { PageTitle, TableWrapper, Table } from './ItemManagement';
import axiosInstance from '../utils/axiosInstance';

const TransactionWrapper = styled.div`
  display: flex;
  height: fit-content;
  flex-wrap: wrap;
  justify-content: center;
`;

function TransactionManagement() {
  const { adminStore, modalStore } = useStores();
  const transList = adminStore.getTransList;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/admin-transactions');
        adminStore.importTransList(res.data.data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('404')) {
            adminStore.importTransList([]);
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

  return (
    <TransactionWrapper>
      <PageTitle>거래 내역</PageTitle>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>아이디</th>
              <th>주문번호</th>
              <th>결제상태</th>
              <th>결제금액</th>
              <th>취소금액</th>
              <th>결제일</th>
              <th>취소일</th>
            </tr>
          </thead>
          {transList.map((trans, idx) => (
            <tbody key={idx}>
              <tr>
                <td>{trans.username}</td>
                <td>{trans.id}</td>
                <td>{trans.status}</td>
                <td>{priceToString(trans.paymentAmount)}</td>
                <td>{priceToString(trans.canceledAmount)}</td>
                <td>{trans.paymentDate}</td>
                <td>{trans.canceledDate || '-'}</td>
              </tr>
            </tbody>
          ))}
        </Table>
      </TableWrapper>
    </TransactionWrapper>
  );
}

export default TransactionManagement;
