import { useState, useEffect, useMemo } from 'react';
import { useStores } from '../../stores/Context';
import { useNavigate } from 'react-router-dom';
import { KeyboardEvent } from 'react';
import styled from 'styled-components';
import SearchResults from './SearchResults';
import { Colors, priceToString } from '../../components/utils/_var';
import Loading from '../../components/Loading';
import MainBnt from '../../components/MainBnt';
import axiosInstance from '../../components/utils/axiosInstance';

const HistoryWrapper = styled.div`
  width: 60rem;
  min-height: calc(100vh - 136px);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
`;

export const TitleDiv = styled.div`
  width: 100%;
  margin-top: 1.25rem;
  margin-bottom: 1rem;
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
`;

export const HistoryContainer = styled.div`
  width: 100%;
  height: fit-content;
  border: 1px solid ${Colors.borderColor};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem;
  :last-of-type {
    margin-bottom: 2rem;
  }
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const OrderInfo = styled.div`
  margin-bottom: 0.75rem;
`;

export const ItemContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-areas: 'img itemname' 'img price';
  grid-template-columns: 5.5rem 1fr;
  margin: 0.5rem;
  padding: 0.5rem;
`;

export const ItemImg = styled.img`
  grid-area: img;
  width: 4rem;
`;

export const ItemName = styled.div`
  grid-area: itemname;
`;

export const TotalPrice = styled.div`
  grid-area: price;
`;

const EmptyContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const RightContainer = styled.div`
  margin: auto 0.75rem;
`;

export const DetailBnt = styled.button`
  border: 1px solid ${Colors.borderColor};
  background-color: white;
  padding: 0.25rem 0.75rem;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  align-items: center;
  margin-bottom: 1rem;
`;

const SearchBar = styled.div`
  margin-right: 0.5rem;
  width: 25rem;
  height: 2.5rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border: 1px solid ${Colors.borderColor};
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
  input:focus {
    outline: none;
  }
`;

type SearchProps = {
  width: string;
};

const SearchInput = styled.input<SearchProps>`
  width: ${(props) => props.width};
  height: 2rem;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  border: none;
`;

const ResetIcon = styled.div`
  cursor: pointer;
  background-color: ${Colors.mediumGray};
  color: white;
  border-radius: 20px;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1rem;
  text-align: center;
  margin-right: 0.5rem;
`;

const ResetBnt = styled.button`
  height: 100%;
  color: white;
  background-color: ${Colors.blue};
  border: none;
`;

const SearchIcon = styled.img`
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.25rem;
`;

export const Indicator = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 2rem;
`;

function HistoryPage() {
  const navigate = useNavigate();
  const { itemStore, modalStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [searchContent, setSearchContent] = useState('');
  const [searched, setSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await axiosInstance.get('/order').then((res) => {
          itemStore.importPaidList(res.data.data);
          setIsLoading(false);
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('404')) {
            itemStore.importPaidList([]);
            setIsLoading(false);
          } else modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        }
      }
    };
    fetchData();
  }, [itemStore, modalStore]);

  const paidList = itemStore.getPaidList;

  const toDetailPage = (orderId: number) => {
    navigate(`/history/id=${orderId}`);
  };

  const getSearchResults = useMemo(
    () => <SearchResults searchResults={searchResults} toDetailPage={toDetailPage} />,
    [searchResults],
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchContent(e.target.value);
  };

  const handleSearchBntClick = () => {
    if (searchContent) {
      setSearched(true);
      axiosInstance
        .get(`/order/search?q=${searchContent}`)
        .then((res) => {
          setSearchResults(res.data.data);
        })
        .catch((error) => {
          if (error.response.data.message === 'no orders found') {
            setSearchResults([]);
          } else {
            modalStore.openModal(error.response.data.message);
          }
        });
    } else alert('검색어를 입력해주세요');
  };

  const handleResetIconClick = () => {
    setSearchContent('');
  };

  const enterKeyPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchBntClick();
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <HistoryWrapper>
      <TitleDiv>주문 내역</TitleDiv>
      <SearchContainer>
        <SearchBar>
          <SearchInput
            width={!searchContent ? '25rem' : '20rem'}
            placeholder='주문한 상품 검색'
            onChange={handleInput}
            value={searchContent}
            onKeyPress={enterKeyPressed}
          />
          <ResetIcon style={{ display: !searchContent ? 'none' : 'block' }} onClick={handleResetIconClick}>
            ×
          </ResetIcon>
          <SearchIcon onClick={handleSearchBntClick} src='./images/icons/search-icon.jpg' alt='search-icon' />
        </SearchBar>
        <ResetBnt onClick={handleReset}>검색 초기화</ResetBnt>
      </SearchContainer>
      {isLoading ? (
        <Loading />
      ) : paidList && paidList.length !== 0 && !searched ? (
        paidList.map((el, idx) => (
          <HistoryContainer key={idx}>
            <LeftContainer>
              <TopContainer>
                <OrderInfo>
                  {el.date} · {el.status}
                </OrderInfo>
              </TopContainer>
              <ItemContainer>
                <ItemImg src={`/images/items/${el.items[0].img}`} />
                {el.items.length <= 1 ? (
                  <ItemName>{el.items[0].itemName}</ItemName>
                ) : (
                  <ItemName>
                    {el.items[0].itemName}
                    <span style={{ color: Colors.blue }}> 외 {el.items.length - 1}건</span>
                  </ItemName>
                )}
                <TotalPrice>총 결제금액: {priceToString(el.totalPrice)}</TotalPrice>
              </ItemContainer>
            </LeftContainer>
            <RightContainer>
              <DetailBnt onClick={() => toDetailPage(el.id)}>상세내역보기</DetailBnt>
            </RightContainer>
          </HistoryContainer>
        ))
      ) : searched ? (
        getSearchResults
      ) : (
        <EmptyContainer>
          <Indicator>아직 주문한 내역이 없습니다.</Indicator>
          <MainBnt />
        </EmptyContainer>
      )}
    </HistoryWrapper>
  );
}

export default HistoryPage;
