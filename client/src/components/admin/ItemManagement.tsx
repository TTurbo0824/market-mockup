import { useState } from 'react';
import { useStores } from '../../stores/Context';
import styled from 'styled-components';
import { Colors } from '../utils/_var';
import { observer } from 'mobx-react';
// import axiosInstance from '../utils/axiosInstance';

const ItemWrapper = styled.div`
  display: flex;
  height: fit-content;
  flex-wrap: wrap;
  justify-content: center;
`;

export const PageTitle = styled.div`
  width: 60rem;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

export const TableWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;

export const Table = styled.table`
  width: 60rem;
  height: fit-content;
  text-align: center;
  margin: 0 auto;
  border-collapse: collapse;
  border-bottom: 2px solid ${Colors.borderColor};
  th {
    border-top: 2px solid ${Colors.borderColor};
    border-bottom: 2px solid ${Colors.borderColor};
  }
  td {
    padding: 0.2rem;
    border-bottom: 1px solid ${Colors.borderColor};
  }
`;

const StockInput = styled.input`
  text-align: right;
`;

const EditBnt = styled.button`
  cursor: pointer;
  width: 6.5rem;
  height: 2.5rem;
  margin-top: 1.75rem;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  border: none;
  background-color: ${Colors.blue};
  color: white;
`;

const NoItems = styled.div`
  margin-top: 1.5rem;
  text-align: center;
`;

function ItemManagement() {
  const { itemStore, modalStore } = useStores();

  const allItems = itemStore.getItems;

  console.log(allItems);

  const stocks: number[] = allItems.map((item) => item.stock);
  // const stocks: number[] = [];
  // allItems.forEach((item) => stocks.push(item.stock));

  const [itemStock, setItemStock] = useState(stocks);
  const [toBeChanged, setToBeChanged] = useState({ idx: null, content: '' });

  const handleStock = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    setItemStock([
      ...itemStock.slice(0, idx),
      Number(e.target.value),
      ...itemStock.slice(idx + 1, itemStock.length),
    ]);
  };

  const handleEdit = () => {
    itemStore.editItems(itemStock);
    window.location.reload();
  };

  return (
    <ItemWrapper>
      <PageTitle>상품 목록</PageTitle>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>상품코드</th>
              <th>상품명</th>
              <th>총재고량</th>
              <th>판매상태</th>
              <th>누적판매량</th>
            </tr>
          </thead>
          {allItems.map((item, idx) => (
            <tbody key={idx}>
              <tr>
                <td>{item.id}</td>
                <td>{item.itemName}</td>
                <td>
                  <StockInput onChange={(e) => handleStock(e, idx)} value={itemStock[idx]} />
                </td>
                <td>{item.status}</td>
                <td>{item.sold}</td>
              </tr>
            </tbody>
          ))}
        </Table>
      </TableWrapper>
      {allItems.length === 0 ? (
        <NoItems>등록된 상품이 없습니다.</NoItems>
      ) : (
        <EditBnt onClick={handleEdit}>일괄수정</EditBnt>
      )}
    </ItemWrapper>
  );
}

export default observer(ItemManagement);
