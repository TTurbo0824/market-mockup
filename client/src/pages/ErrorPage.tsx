import styled from 'styled-components';
import { Colors } from '../components/utils/_var';
import { useStores } from '../../src/stores/Context';

const PageWrapper = styled.div`
  width: 60rem;
  min-height: calc(100vh - 136px);
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
`;

const ErrorImg = styled.img`
  object-fit: contain;
  width: 12rem;
  padding-right: 2rem;
  margin-top: 4rem;
  /* filter: invert(75%); */
`;

const ErrorMsg = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  white-space: pre-line;
  :first-of-type {
    margin: 1rem auto 0.75rem;
    font-size: 1.15rem;
    font-weight: bold;
  }
  :last-of-type {
    color: ${Colors.gray};
  }
`;

const MainBnt = styled.button`
  margin: 1.5rem auto;
  border: none;
  height: fit-content;
  padding: 0.5rem 0.75rem;
  color: white;
  background-color: ${Colors.blue};
`;

function ErrorPage() {
  const { userStore } = useStores();

  const goToMain = () => {
    const route = userStore.getUserType === 'admin' ? '/admin' : '/';
    window.location.replace(route);
  };

  return (
    <PageWrapper>
      <div>
        <ErrorImg src='/images/icons/not-found.png' />
        <ErrorMsg>페이지를 찾을 수 없습니다.</ErrorMsg>
        <ErrorMsg>
          입력한 주소가 잘못되었거나, 사용이 일시 중단 되어{'\n'}요청한 페이지를 찾을 수 없습니다.
        </ErrorMsg>
        <MainBnt onClick={goToMain}>메인으로 이동</MainBnt>
      </div>
    </PageWrapper>
  );
}

export default ErrorPage;
