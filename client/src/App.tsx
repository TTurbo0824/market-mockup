import { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from './stores/Context';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import Mainpage from './pages/MainPage';
import ItemPage from './pages/ItemPage';
import HistoryPage from './pages/MyPage/HistoryPage';
import HistoryDetail from './pages/MyPage/HistoryDetailPage';
import InfoPage from './pages/MyPage/InfoPage';
import Cartpage from './pages/CartPage';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Modal from './components/Modal';
import ErrorPage from './pages/ErrorPage';
import styled from 'styled-components';

const AppWrapper = styled.div`
  button {
    cursor: pointer;
    font-family: 'IBM Plex Sans KR', sans-serif;
  }
`;

const FixedContainer = styled.div`
  position: fixed;
  top: 0;
  z-index: 999;
  height: 3.5;
  background-color: white;
  width: 100vw;
`;

const SpacingDiv = styled.div`
  height: 3.75rem;
`;

function App() {
  const { modalStore, userStore } = useStores();
  const modalInfo = modalStore.modalInfo;
  const [openSignin, setOpenSignin] = useState(false);
  const [openSignup, setOpennSignup] = useState(false);

  const handleModal = () => {
    modalStore.closeModal();
  };

  const handleSigninModal = () => {
    if (openSignin) setOpenSignin(false);
    else setOpenSignin(true);
  };

  const handleSignupModal = () => {
    if (openSignup) setOpennSignup(false);
    else setOpennSignup(true);
  };

  return (
    <AppWrapper>
      <BrowserRouter>
        <FixedContainer>
          <Header />
        </FixedContainer>
        <SpacingDiv />
        {modalInfo.open ? <Modal handleModal={handleModal} handleSigninModal={handleSigninModal} /> : null}
        {openSignin ? (
          <Signin handleSigninModal={handleSigninModal} handleSignupModal={handleSignupModal} />
        ) : null}
        {openSignup ? (
          <Signup handleSigninModal={handleSigninModal} handleSignupModal={handleSignupModal} />
        ) : null}
        <Routes>
          <Route
            path='/'
            element={userStore.getUserType !== 'admin' ? <Mainpage /> : <Navigate to='/admin' />}
          />
          <Route
            path='/item/:id'
            element={userStore.getUserType === 'user' ? <ItemPage /> : <Navigate to='/error' />}
          />
          <Route
            path='/admin'
            element={userStore.getUserType === 'admin' ? <AdminPage /> : <Navigate to='/' />}
          >
            <Route
              path='items'
              element={userStore.getUserType === 'admin' ? <AdminPage /> : <Navigate to='/' />}
            />
            <Route
              path='trans'
              element={userStore.getUserType === 'admin' ? <AdminPage /> : <Navigate to='/' />}
            />
            <Route
              path='trans/:id'
              element={userStore.getUserType === 'admin' ? <AdminPage /> : <Navigate to='/' />}
            />
            <Route
              path='users'
              element={userStore.getUserType === 'admin' ? <AdminPage /> : <Navigate to='/' />}
            />
          </Route>
          <Route
            path='/history'
            element={userStore.getUserType === 'user' ? <HistoryPage /> : <Navigate to='/error' />}
          />
          <Route
            path='/history/:id'
            element={userStore.getUserType === 'user' ? <HistoryDetail /> : <Navigate to='/error' />}
          />
          <Route
            path='/info'
            element={userStore.getUserType === 'user' ? <InfoPage /> : <Navigate to='/error' />}
          />
          <Route
            path='/cart'
            element={userStore.getUserType !== 'admin' ? <Cartpage /> : <Navigate to='/admin' />}
          />
          <Route path='/*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </AppWrapper>
  );
}

export default observer(App);
