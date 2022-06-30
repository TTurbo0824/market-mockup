import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useStores } from '../stores/Context';
import ItemCardThumb from '../components/ItemCardThumb';
import ItemCardList from '../components/ItemCardList';
import { Item } from '../stores/ItemStore';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll, faListSquares } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../components/utils/_var';

const MainpageWrapper = styled.div`
  min-height: calc(100vh - 136px);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const CardContainer = styled.div`
  width: 65rem;
  min-width: 65rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 65rem;
  min-width: 65rem;
  justify-content: right;
  margin-bottom: 0.5rem;
`;

const ViewIcon = styled.div`
  cursor: pointer;
  margin-left: 0.75rem;
  font-size: 1.5rem;
  color: ${(props) => props.color};
`;

export type MainpageProps = {
  handleMessage: (message: string) => void;
};

function Mainpage({ handleMessage }: MainpageProps) {
  const { itemStore } = useStores();
  const { cartStore } = useStores();
  const { userStore } = useStores();
  const [viewType, setViewType] = useState('thumb');
  const [isLoading, setIsLoading] = useState(false);

  const allCartItems = cartStore.getCartItems;
  const allItems = itemStore.getAllItems;

  const token = userStore.getUserInfo.token;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await axios.get(process.env.REACT_APP_API_URL + '/items');
        itemStore.importItemList(result.data.data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  const handleClick = (item: Item) => {
    if (allCartItems.map((el) => el.id).includes(item.id)) {
      openModal('이미 추가된 상품입니다.');
    } else {
      if (!token) {
        cartStore.addToCart(item);
        openModal('장바구니에 추가되었습니다.');
      } else {
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/cart-item`,
            { itemId: item.id, price: item.price },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              withCredentials: true
            }
          )
          .then(() => {
            cartStore.addToCart(item);
            openModal('장바구니에 추가되었습니다.');
          })
          .catch((error) => {
            if (error.response.status === 401) {
              alert(error.response.message);
            } else {
            }
          });
      }
    }
  };

  const openModal = (message: string) => {
    handleMessage(message);
  };

  const handleView = (type: string) => {
    setViewType(type);
  };

  return (
    <MainpageWrapper>
      <ButtonContainer>
        <ViewIcon
          onClick={() => handleView('thumb')}
          color={viewType === 'thumb' ? Colors.black : Colors.mediumGray}>
          <FontAwesomeIcon icon={faBorderAll} />
        </ViewIcon>
        <ViewIcon
          onClick={() => handleView('list')}
          color={viewType === 'list' ? Colors.black : Colors.mediumGray}>
          <FontAwesomeIcon icon={faListSquares} />
        </ViewIcon>
      </ButtonContainer>
      <CardContainer>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          allItems &&
          allItems.map((item, idx) => {
            if (viewType === 'thumb') {
              return <ItemCardThumb key={idx} item={item} handleClick={handleClick} />;
            } else return <ItemCardList key={idx} item={item} handleClick={handleClick} />;
          })
        )}
      </CardContainer>
    </MainpageWrapper>
  );
}

export default observer(Mainpage);
