import { observer } from 'mobx-react';
import { useStores } from './stores/Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Mainpage from './pages/Mainpage';
import Mypage from './pages/Mypage';
import Cartpage from './pages/Cartpage';
import Modal from './components/Modal';
import styled from 'styled-components';

const FixedContainer = styled.div`
  position: fixed;
  top: 0;
  z-index: 999;
  height: 3.5;
  background-color: white;
  width: 100vw;
`;

const SpacingDiv = styled.div`
  height: 3.5rem;
`;

function App() {
  const { modalStore } = useStores();
  const modalInfo = modalStore.modalInfo;

  const handleModal = () => {
    modalStore.closeModal();
  };

  const handleMessage = (message: string) => {
    modalStore.openModal(message);
  };

  return (
    <div className="App">
      {modalInfo.open ? <Modal handleModal={handleModal} /> : null}
      <FixedContainer>
        <Header />
      </FixedContainer>
      <SpacingDiv />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainpage handleMessage={handleMessage} />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/cart" element={<Cartpage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default observer(App);
