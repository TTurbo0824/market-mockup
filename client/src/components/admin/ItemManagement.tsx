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
import axiosInstance from '../utils/axiosInstance';

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
  width: 58rem;
  display: grid;
  grid-template-columns: 10% 35% 11% 17% 17% 10%;
  border-top: 2px solid ${Colors.borderColor};
  border-bottom: 2px solid ${Colors.borderColor};
  font-weight: bold;
`;

const BottomContainer = styled.div`
  width: 58rem;
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
  stock: number | null;
  status: string | null;
}

function ItemManagement() {
  const { itemStore, modalStore } = useStores();
  const itemList = itemStore.getItems;

  const [displayItem, setDisplayItem] = useState(itemList);

  const tempToBeChanged = displayItem.map((el) => {
    return { id: el.id, stock: el.stock, status: el.status };
  });

  const [toBeChanged, setToBeChanged] = useState<ChangeItem[]>(tempToBeChanged);
  const [idToChange, setIdToChange] = useState<any[]>([]);
  const [mode, setMode] = useState({ status: '전체' });

  const status = ['전체', '판매중', '품절', '재고 5개 미만'];
  const changeStatus = ['판매중', '품절'];
  const fields = ['상품코드', '상품명', '총재고량', '재고수정', '판매상태', '누적판매량'];

  useEffect(() => {
    let tempList = [...itemList];

    if (mode.status !== '전체' && mode.status !== '재고 5개 미만') {
      tempList = tempList.filter((el) => el.status === mode.status);
    } else if (mode.status === '재고 5개 미만') {
      tempList = tempList.filter((el) => el.stock < 5);
    }

    setDisplayItem(tempList);
    setToBeChanged(
      tempList.map((el) => {
        return {
          id: el.id,
          stock: el.stock,
          status: el.status,
        };
      }),
    );
    setIdToChange([]);
  }, [mode, itemList]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode({ status: e.target.value });
  };

  const handleEditInfo = (e: any, idx: number, type: string) => {
    if (type === 'stock' && !Number(e.target.value) && Number(e.target.value) !== 0) {
      modalStore.openModal('숫자만 입력해주세요.');
    } else {
      if (!idToChange.includes(toBeChanged[idx].id)) setIdToChange([...idToChange, toBeChanged[idx].id]);

      const editTarget = {
        id: toBeChanged[idx].id,
        stock: type === 'stock' ? Number(e.target.value) : toBeChanged[idx].stock,
        status: type === 'stock' ? (Number(e.target.value) === 0 ? '품절' : '판매중') : e.target.value,
      };

      setToBeChanged([
        ...toBeChanged.slice(0, idx),
        editTarget,
        ...toBeChanged.slice(idx + 1, toBeChanged.length),
      ]);
    }
  };

  const handleEdit = () => {
    const finalChanged = toBeChanged.filter((el) => idToChange.includes(el.id));

    if (!finalChanged.length) modalStore.openModal('수정사항을 입력해주세요.');
    else {
      axiosInstance
        .patch('/admin-items', { itemToChange: finalChanged })
        .then((res) => {
          itemStore.importItemList(res.data.data);
          window.location.reload();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
          } else {
            modalStore.openModal(error.response.data.message);
          }
        });
    }
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
            <StockInput
              onChange={(e) => handleEditInfo(e, idx, 'stock')}
              value={toBeChanged[idx].stock?.toString()}
            />
            <BottomContent>
              <select
                value={toBeChanged[idx].status?.toString()}
                onChange={(e) => handleEditInfo(e, idx, 'status')}
              >
                {changeStatus.map((el, idx) => (
                  <option value={el} key={idx}>
                    {el}
                  </option>
                ))}
              </select>
            </BottomContent>
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
