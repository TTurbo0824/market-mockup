import { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from './stores/Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import Mainpage from './pages/Mainpage';
import HistoryPage from './pages/MyPage/HistoryPage';
import HistoryDetail from './pages/MyPage/HistoryDetailPage';
import InfoPage from './pages/MyPage/InfoPage';
import Cartpage from './pages/Cartpage';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Modal from './components/Modal';
import styled from 'styled-components';

const AppWrapper = styled.div`
  button {
    cursor: pointer;
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
  const { userStore } = useStores();
  const { modalStore } = useStores();
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
      <BrowserRouter>
        <Routes>
          {/* <Route path='/' element={userStore.getUserType !== 'admin' ? <Mainpage /> : <AdminPage />} /> */}
          <Route path='/' element={<Mainpage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/history' element={<HistoryPage />} />
          <Route path='/history/:id' element={<HistoryDetail />} />
          <Route path='/info' element={<InfoPage />} />
          <Route path='/cart' element={<Cartpage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </AppWrapper>
  );
}

export default observer(App);
