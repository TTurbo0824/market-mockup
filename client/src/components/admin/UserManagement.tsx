import { useState, useEffect, useMemo } from 'react';
import { useStores } from '../../stores/Context';
import { User } from '../../interface/Admin';
import styled from 'styled-components';
import { Colors, priceToString, dateObj } from '../utils/_var';
import {
  PageTitle,
  TopContainer,
  SubContainer,
  Prop,
  PropContent,
  DateBnt,
  Fields,
  BottomContent,
  EmptyIndicator,
  LoadingWrapper,
} from './TransactionManagement';
import { PageUl, PageLi } from './ItemManagement';
import Loading from '../Loading';
import axiosInstance from '../utils/axiosInstance';

const UserWrapper = styled.div`
  display: flex;
  height: fit-content;
  flex-wrap: wrap;
  justify-content: center;
`;

const FieldContainer = styled.div`
  width: 58rem;
  display: grid;
  grid-template-columns: 10% 15% 12% 15% 15% 18% 15%;
  border-top: 2px solid ${Colors.borderColor};
  border-bottom: 2px solid ${Colors.borderColor};
  font-weight: bold;
`;

const BottomContainer = styled.div`
  width: 58rem;
  display: grid;
  grid-template-columns: 10% 15% 12% 15% 15% 18% 15%;
  border-bottom: 1px solid ${Colors.borderColor};
`;

interface UserObj {
  users: User[];
  page: number;
}

function UserManagement() {
  const { adminStore, modalStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/admin-users');
        const tempUsers = res.data.data;
        adminStore.importUserList(tempUsers);
        setCurPageInfo({ ...curPageInfo, users: tempUsers });
        setCurUsers(tempUsers.slice(0, userPerPage));
        setIsLoading(false);
      } catch (error) {
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

  const userList = adminStore.getUserList;

  const [mode, setMode] = useState({ date: '전체', status: '전체' });
  const status = ['전체', '정상', '휴면', '이용제한'];
  const dates = ['전체', '오늘', '1주', '1개월', '3개월'];
  const fields = ['회원번호', '아이디', '이름', '가입일', '가입상태', '주문총액', '휴면전환일'];

  const userPerPage = 15;
  const [curPageInfo, setCurPageInfo] = useState<UserObj>({
    users: [],
    page: 1,
  });

  const [curUsers, setCurUsers] = useState<User[]>([]);

  const pageNumbers: number[] = useMemo(
    () => Array.from({ length: Math.ceil(curPageInfo.users.length / userPerPage) }, (_, i) => i + 1),
    [curPageInfo.users],
  );

  useEffect(() => {
    const today = new Date();

    let tempList = [...userList];

    if (mode.date !== '전체') {
      tempList = userList.filter((el) => Date.parse(el.signupDate) > today.getTime() - dateObj[mode.date]);
    }
    if (mode.status !== '전체') {
      tempList = tempList.filter((el) => el.userStatus === mode.status);
    }
    const tempCurTrans = tempList.slice(0, userPerPage);
    setCurUsers(tempCurTrans);
    setCurPageInfo({ page: 1, users: tempList });
  }, [mode]);

  const handleDateSel = (type: string) => {
    setMode({ ...mode, date: type });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode({ ...mode, status: e.target.value });
  };

  const handlePagination = (number: number) => {
    if (pageNumbers.length < 2 || curPageInfo.page === number) {
      return;
    }

    const indexOfLastTran = number * userPerPage;
    const indexOfFirstTran = indexOfLastTran - userPerPage;

    setCurPageInfo({
      ...curPageInfo,
      page: number,
    });

    const newUsersList = curPageInfo.users.slice(indexOfFirstTran, indexOfLastTran);

    setCurUsers(newUsersList);
  };

  return (
    <UserWrapper>
      <PageTitle>회원 조회</PageTitle>
      {isLoading ? (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      ) : (
        <>
          <TopContainer>
            <SubContainer>
              <Prop>가입일</Prop>
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
              <Prop>가입상태</Prop>
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
          {curUsers && curUsers.length !== 0 ? (
            curUsers.map((user, idx) => (
              <BottomContainer key={idx}>
                <BottomContent>{user.id}</BottomContent>
                <BottomContent>{user.username}</BottomContent>
                <BottomContent>{user.name}</BottomContent>
                <BottomContent>{user.signupDate.slice(0, 10)}</BottomContent>
                <BottomContent>{user.userStatus}</BottomContent>
                <BottomContent>{priceToString(user.orderTotal)}</BottomContent>
                <BottomContent>{user.dormantDate || '-'}</BottomContent>
              </BottomContainer>
            ))
          ) : (
            <EmptyIndicator>회원이 존재하지 않습니다.</EmptyIndicator>
          )}
        </>
      )}
      <PageUl>
        {pageNumbers.map((number) => {
          return (
            <PageLi
              key={number}
              color={curPageInfo.page === number ? Colors.lightGray : 'white'}
              onClick={() => handlePagination(number)}
            >
              {number}
            </PageLi>
          );
        })}
      </PageUl>
    </UserWrapper>
  );
}

export default UserManagement;
