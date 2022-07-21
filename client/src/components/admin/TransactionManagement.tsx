import { useState, useEffect } from 'react';
import { useStores } from '../../stores/Context';
import styled from 'styled-components';
import TransModal from './TransModal';
import { Colors, priceToString, dateObj } from '../utils/_var';
import { Transaction } from '../../stores/AdminStore';
import Loading from '../Loading';
import axiosInstance from '../utils/axiosInstance';

const TransactionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
  span {
    color: ${Colors.blue};
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const PageTitle = styled.div`
  width: 60rem;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

export const TopContainer = styled.div`
  width: 60rem;
  border-top: 2px solid ${Colors.borderColor};
  border-bottom: 2px solid ${Colors.borderColor};
  margin-bottom: 2.5rem;
`;

export const SubContainer = styled.div`
  display: grid;
  grid-template-areas: 'prop content';
  grid-template-columns: 15% 85%;
  margin: 0.5rem auto;
  :nth-of-type(2) {
    border-top: 1px solid ${Colors.borderColor};
    padding-top: 0.5rem;
  }
`;

export const Prop = styled.div`
  padding: 0 1rem;
`;

export const PropContent = styled.div`
  select {
    cursor: pointer;
    width: 15rem;
    border: 1px solid ${Colors.borderColor};
    padding: 0.15rem 0.75rem;
  }
`;

export const DateBnt = styled.button`
  color: ${(props) => props.color};
  background-color: ${(props) => (props.color === 'white' ? Colors.blue : 'white')};
  border: 1px solid ${Colors.borderColor};
  border-color: ${(props) => (props.color === 'white' ? Colors.blue : Colors.borderColor)};
  padding: 0.15rem;
  width: 3rem;
  :not(:first-of-type) {
    border-left: none;
  }
`;

const FieldContainer = styled.div`
  width: 60rem;
  display: grid;
  grid-template-columns: 14% 18% 14% 15% 15% 12% 12%;
  border-top: 2px solid ${Colors.borderColor};
  border-bottom: 2px solid ${Colors.borderColor};
  font-weight: bold;
`;

export const Fields = styled.div`
  text-align: center;
  line-height: 1.75rem;
`;

const BottomContainer = styled.div`
  width: 60rem;
  display: grid;
  grid-template-columns: 14% 18% 14% 15% 15% 12% 12%;
  border-bottom: 1px solid ${Colors.borderColor};
`;

export const BottomContent = styled.div`
  text-align: center;
  line-height: 1.75rem;
`;

export const EmptyIndicator = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 1.5rem;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

function TransactionManagement() {
  const { adminStore, modalStore } = useStores();

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [targetOrder, setTargetOrder] = useState<Transaction>({
    id: null,
    uniqueId: null,
    username: null,
    name: null,
    status: null,
    paymentAmount: null,
    paymentDate: '-',
    cancelRequestDate: null,
    canceledAmount: null,
    cancelDate: null,
  });

  const transList = adminStore.getTransList;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/admin-transactions');
        adminStore.importTransList(res.data.data);
        setDisplayItem(res.data.data);
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
  }, [openModal]);

  const [displayItem, setDisplayItem] = useState<Transaction[]>([]);
  const [mode, setMode] = useState({ date: '전체', status: '전체' });
  const status = ['전체', '결제완료', '취소요청', '결제취소', '취소거절'];
  const dates = ['전체', '오늘', '1주', '1개월', '3개월'];
  const fields = ['아이디', '주문번호', '결제상태', '결제금액', '취소금액', '결제일', '취소일'];

  useEffect(() => {
    const today = new Date();

    let tempList = [...transList];

    if (mode.date !== '전체') {
      tempList = transList.filter((el) => Date.parse(el.paymentDate) > today.getTime() - dateObj[mode.date]);
    }
    if (mode.status !== '전체') {
      tempList = tempList.filter((el) => el.status === mode.status).reverse();
    }
    setDisplayItem(tempList);
  }, [mode]);

  const handleModal = () => {
    if (openModal) setOpenModal(false);
    else setOpenModal(true);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode({ ...mode, status: e.target.value });
  };

  const handleDateSel = (type: string) => {
    setMode({ ...mode, date: type });
  };

  return (
    <TransactionWrapper>
      <PageTitle>거래 내역</PageTitle>
      {isLoading ? (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      ) : (
        <>
          <TopContainer>
            <SubContainer>
              <Prop>결제일</Prop>
              <PropContent>
                {dates.map((el, idx) => (
                  <DateBnt
                    key={idx}
                    onClick={() => handleDateSel(el)}
                    color={mode.date === el ? 'white' : 'black'}
                  >
                    {el}
                  </DateBnt>
                ))}
              </PropContent>
            </SubContainer>
            <SubContainer>
              <Prop>결제상태</Prop>
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
            displayItem.map((trans, idx) => (
              <BottomContainer key={idx}>
                <BottomContent>{trans.username}</BottomContent>
                <BottomContent>
                  {trans.paymentDate.slice(0, 10)}-{trans.uniqueId}
                </BottomContent>
                <BottomContent>
                  {trans.status === '취소요청' ? (
                    <span
                      onClick={() => {
                        handleModal();
                        setTargetOrder(trans);
                      }}
                    >
                      {trans.status}
                    </span>
                  ) : (
                    trans.status
                  )}
                </BottomContent>
                <BottomContent>{priceToString(trans.paymentAmount)}</BottomContent>
                <BottomContent>{priceToString(trans.canceledAmount)}</BottomContent>
                <BottomContent>{trans.paymentDate.slice(0, 10)}</BottomContent>
                <BottomContent>{trans.cancelDate || '-'}</BottomContent>
              </BottomContainer>
            ))
          ) : (
            <EmptyIndicator>거래 내역이 존재하지 않습니다.</EmptyIndicator>
          )}
          {openModal ? <TransModal trans={targetOrder} handleModal={handleModal} /> : null}
        </>
      )}
    </TransactionWrapper>
  );
}

export default TransactionManagement;
