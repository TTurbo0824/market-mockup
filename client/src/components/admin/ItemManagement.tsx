import { useState, useEffect } from 'react';
import { useStores } from '../../stores/Context';
import styled from 'styled-components';
import { Colors } from '../utils/_var';
import { observer } from 'mobx-react';
import {
  PageTitle,
  TopContainer,
  SubContainer,
  Prop,
  PropContent,
  Fields,
  BottomContent,
  EmptyIndicator,
} from './TransactionManagement';
// import axiosInstance from '../utils/axiosInstance';

const ItemWrapper = styled.div`
  display: flex;
  height: fit-content;
  flex-wrap: wrap;
  justify-content: center;
`;

const StockInput = styled.input`
  text-align: right;
  width: 75%;
  height: 75%;
  margin: auto;
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

const FieldContainer = styled.div`
  width: 60rem;
  display: grid;
  grid-template-columns: 10% 35% 11% 17% 17% 10%;
  border-top: 2px solid ${Colors.borderColor};
  border-bottom: 2px solid ${Colors.borderColor};
  font-weight: bold;
`;

const BottomContainer = styled.div`
  width: 60rem;
  display: grid;
  grid-template-columns: 10% 35% 11% 17% 17% 10%;
  border-bottom: 1px solid ${Colors.borderColor};
`;

const BntContainer = styled.div`
  width: 100%;
  text-align: center;
`;

interface ChangeItem {
  id: number | null;
  quantity: number | null;
  status: string | null;
}

function ItemManagement() {
  const { itemStore, modalStore } = useStores();
  const itemList = itemStore.getItems;
  // const itemIdArr = itemList.map((el) => el.id);
  const [displayItem, setDisplayItem] = useState(itemList);

  // console.log(itemList);

  const stocks: number[] = itemList.map((item) => item.stock);
  // const stocks: number[] = [];
  // itemList.forEach((item) => stocks.push(item.stock));

  const [itemStock, setItemStock] = useState(stocks);
  const [toBeChanged, setToBeChanged] = useState<ChangeItem[]>([]);
  // const [target, setTarget] = useState(displayItem);

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

  const [mode, setMode] = useState({ status: '전체' });

  const status = ['전체', '판매중', '품절', '재고 8개 미만'];
  const fields = ['상품코드', '상품명', '총재고량', '재고수정', '판매상태', '누적판매량'];

  useEffect(() => {
    let tempList = [...itemList];

    if (mode.status !== '전체' && mode.status !== '재고 8개 미만') {
      tempList = tempList.filter((el) => el.status === mode.status);
    } else if (mode.status === '재고 8개 미만') {
      tempList = tempList.filter((el) => el.stock < 8);
    }
    setDisplayItem(tempList);
  }, [mode]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode({ status: e.target.value });
  };

  return (
    <ItemWrapper>
      <PageTitle>상품 관리</PageTitle>
      <TopContainer>
        <SubContainer>
          <Prop>상품상태</Prop>
          <PropContent>
            <select onChange={(e) => handleSelect(e)}>
              {status.map((el, idx) => (
                <option value={el} key={idx}>
                  {el}
                </option>
              ))}
            </select>
          </PropContent>
        </SubContainer>
      </TopContainer>
      <FieldContainer>
        {fields.map((field, idx) => (
          <Fields key={idx}>{field}</Fields>
        ))}
      </FieldContainer>
      {displayItem && displayItem.length !== 0 ? (
        displayItem.map((item, idx) => (
          <BottomContainer key={idx}>
            <BottomContent>{item.id}</BottomContent>
            <BottomContent>{item.itemName}</BottomContent>
            <BottomContent>{item.stock}</BottomContent>
            <StockInput onChange={(e) => handleStock(e, idx)} value={itemStock[idx]} />
            <BottomContent>{item.status}</BottomContent>
            <BottomContent>{item.sold}</BottomContent>
          </BottomContainer>
        ))
      ) : (
        <EmptyIndicator>상품이 존재하지 않습니다.</EmptyIndicator>
      )}
      {displayItem.length !== 0 ? (
        <BntContainer>
          <EditBnt onClick={handleEdit}>일괄수정</EditBnt>
        </BntContainer>
      ) : null}
    </ItemWrapper>
  );
}

export default observer(ItemManagement);
