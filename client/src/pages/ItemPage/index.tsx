import styled from 'styled-components';

const ItemPageWrapper = styled.div`
  min-height: calc(100vh - 136px);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const ItemContainer = styled.div``;

function ItemPage() {
  return (
    <ItemPageWrapper>
      상세 페이지
      <ItemContainer />
    </ItemPageWrapper>
  );
}

export default ItemPage;
