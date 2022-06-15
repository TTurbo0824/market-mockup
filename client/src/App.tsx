import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Mainpage from './pages/Mainpage';
import Mypage from './pages/Mypage';
import Cartpage from './pages/Cartpage';
import Modal from './components/Modal';

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleModal = (boolean: boolean) => {
    setOpenModal(boolean);
  };

  const handleMessage = (message: string) => {
    setMessage(message);
  };

  return (
    <div className="App">
      {openModal ? <Modal handleModal={handleModal} message={message} /> : null}
      <Header />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Mainpage handleModal={handleModal} handleMessage={handleMessage} />}
          />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/cart" element={<Cartpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
