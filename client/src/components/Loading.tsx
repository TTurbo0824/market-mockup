import styled from 'styled-components';

const LoadingWrapper = styled.div`
  margin: 0 auto;
  img {
    margin-top: 5rem;
    width: 4rem;
  }
`;

function Loading() {
  return (
    <LoadingWrapper>
      <img src='/images/icons/loading.gif' alt='loading-indicator' />
    </LoadingWrapper>
  );
}

export default Loading;
