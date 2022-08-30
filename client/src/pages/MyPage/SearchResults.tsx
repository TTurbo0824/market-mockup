import styled from 'styled-components';
import { priceToString } from '../../components/utils/_var';
import { Indicator } from './HistoryPage';
import {
  HistoryContainer,
  LeftContainer,
  TopContainer,
  OrderInfo,
  ItemContainer,
  ItemName,
  ItemImg,
  TotalPrice,
  RightContainer,
  DetailBnt,
} from './HistoryPage';

const SearchResultWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
`;

type ResultProp = {
  searchResults: any;
  toDetailPage: (a: number) => void;
};

function SearchResults({ searchResults, toDetailPage }: ResultProp) {
  return (
    <SearchResultWrapper>
      {searchResults.length ? (
        searchResults.map((item: any) => (
          <HistoryContainer key={item.id}>
            <LeftContainer>
              <TopContainer>
                <OrderInfo>
                  {item.date} · {item.status}
                </OrderInfo>
              </TopContainer>
              <ItemContainer>
                <ItemImg src={`/images/items/${item.items[0].img}`} />
                <ItemName>{item.items[0].itemName}</ItemName>
                <TotalPrice>총 결제금액: {priceToString(item.totalPrice)}</TotalPrice>
              </ItemContainer>
            </LeftContainer>
            <RightContainer>
              <DetailBnt onClick={() => toDetailPage(item.id)}>상세내역보기</DetailBnt>
            </RightContainer>
          </HistoryContainer>
        ))
      ) : (
        <Indicator>검색 결과가 없습니다.</Indicator>
      )}
    </SearchResultWrapper>
  );
}

export default SearchResults;
