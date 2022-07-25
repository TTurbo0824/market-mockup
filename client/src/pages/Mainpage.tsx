import { useState, useEffect } from 'react';
import { useStores } from '../stores/Context';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ItemCardThumb from '../components/ItemCardThumb';
import ItemCardList from '../components/ItemCardList';
import { Item } from '../stores/ItemStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll, faListSquares } from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading';
import { Colors } from '../components/utils/_var';
import axiosInstance from '../components/utils/axiosInstance';

const MainpageWrapper = styled.div`
  min-height: calc(100vh - 136px);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const CardContainer = styled.div`
  width: 60rem;
  min-width: 60rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const TopContainer = styled.div`
  display: flex;
  width: 60rem;
  justify-content: right;
  align-items: center;
  margin-bottom: 1.75rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border: 1px solid ${Colors.black};
  margin-left: 0.5rem;
`;

const ViewIcon = styled.div`
  cursor: pointer;
  font-size: 1.25rem;
  color: ${(props) => props.color};
  padding: 0 0.4rem;
  :last-of-type {
    border-left: 1px solid ${Colors.black};
  }
`;

const SoldOutBnt = styled.button`
  height: 2rem;
  background-color: white;
  margin-right: 0.25rem;
  padding: 0 0.5rem;
  border: 1px solid ${Colors.borderColor};
`;

function Mainpage() {
  const { itemStore, cartStore, userStore, modalStore } = useStores();
  const [viewType, setViewType] = useState('thumb');
  const [isLoading, setIsLoading] = useState(false);
  const [outInclud, setOutInclud] = useState(true);
  const allCartItems = cartStore.getCartItems;
  const [displayItems, setDisplayItems] = useState<Item[]>([]);
  const allItems = itemStore.getItems;
  const token = userStore.getUserInfo.token || null;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + '/items', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        itemStore.importItemList(data.data);
        setDisplayItems(data.data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          modalStore.openModal(error.message);
          setDisplayItems([]);
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!outInclud) {
      const newItemList = allItems.filter((el) => el.status !== '품절');
      setDisplayItems(newItemList);
    } else setDisplayItems(allItems);
  }, [outInclud]);

  const handleClick = (item: Item) => {
    if (allCartItems.map((el) => el.itemName).includes(item.itemName)) {
      modalStore.openModal('이미 추가된 상품입니다.');
    } else {
      if (!token) {
        cartStore.addToCart(item);
        modalStore.openModal('장바구니에 추가되었습니다.');
      } else {
        axiosInstance
          .post('/cart-item', { itemId: item.id })
          .then((res) => {
            item.id = res.data.data.id;
            cartStore.addToCart(item);
            modalStore.openModal('장바구니에 추가되었습니다.');
          })
          .catch((error) => {
            if (error.response.status === 401) {
              modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
            } else if (error.response.data.message === 'item not available') {
              modalStore.openModal('현재 판매중인 상품이 아닙니다.');
            } else {
              modalStore.openModal(error.response.data.message);
            }
          });
      }
    }
  };

  const handleView = (type: string) => {
    setViewType(type);
  };

  const handleSoldOut = () => {
    if (outInclud) setOutInclud(false);
    else setOutInclud(true);
  };

  return (
    <MainpageWrapper>
      <TopContainer>
        <SoldOutBnt onClick={handleSoldOut}>{!outInclud ? '+ 품절상품 포함' : '- 품절상품 제외'}</SoldOutBnt>
        <ButtonContainer>
          <ViewIcon
            onClick={() => handleView('thumb')}
            color={viewType === 'thumb' ? Colors.black : Colors.mediumGray}
          >
            <FontAwesomeIcon icon={faBorderAll} />
          </ViewIcon>
          <ViewIcon
            onClick={() => handleView('list')}
            color={viewType === 'list' ? Colors.black : Colors.mediumGray}
          >
            <FontAwesomeIcon icon={faListSquares} />
          </ViewIcon>
        </ButtonContainer>
      </TopContainer>
      <CardContainer>
        {isLoading ? (
          <Loading />
        ) : (
          displayItems &&
          displayItems.map((item, idx) => {
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
