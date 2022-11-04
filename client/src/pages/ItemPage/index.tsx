import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStores } from '../../stores/Context';
import { observer } from 'mobx-react';

import axiosInstance from '../../components/utils/axiosInstance';
import styled from 'styled-components';
import { Colors, priceToString, getDate } from '../../components/utils/_var';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { Item } from '../../interface/Item';

import { LoadingWrapper } from '../AdminPage/components/admin/TransactionManagement';
import Loading from '../../components/Loading';

const ItemPageWrapper = styled.div`
  min-height: calc(100vh - 136px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const InnerContainer = styled.div`
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
`;
const ItemContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 50rem;
  height: fit-content;
  align-items: flex-start;
`;

const InfoContainer = styled.div`
  width: 100%;
  margin-left: 2rem;
`;

const ItemImg = styled.img`
  width: 14rem;
`;

const ItemName = styled.div`
  width: 100%;
  font-size: 1.25rem;
  font-weight: bold;
`;

const ItemPrice = styled.div`
  font-size: 1.5rem;
`;

const QuantManager = styled.div`
  background-color: #eee;
  border-top: 2px solid silver;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const QuantContainer = styled.div`
  border: 1px solid ${Colors.borderColor};
  width: 5rem;
  display: flex;
  justify-content: space-between;
  height: 1.75rem;
  background-color: white;
`;

const QuantDiv = styled.div`
  margin: auto;
`;

const QuantBntContainer = styled.div`
  display: flex;
  height: 100%;
`;

const QuantBnt = styled.button`
  height: 100%;
  background-color: transparent;
  border: none;
  border-left: 1px solid ${Colors.borderColor};
`;

const BntContaienr = styled.div`
  width: 100%;
  display: flex;
  margin: 0.75rem 0;
`;

const DetailBnt = styled.button`
  width: 50%;
  border: none;
  color: ${(props) => (props.color === 'silver' ? 'black' : 'white')};
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: ${(props) => props.color};
`;

const DetailContainer = styled.div`
  width: 50rem;
  height: fit-content;
`;

const DetailTitle = styled.div`
  margin-top: 2.5rem;
  padding: 0.5rem 0;
  font-size: 1.25rem;
  border-bottom: 3px solid black;
`;

const Description = styled.div`
  padding: 1rem 0;
`;

function ItemPage() {
  const { itemStore, userStore, modalStore, cartStore } = useStores();
  const { id } = useParams();
  const itemId = Number(id?.split('=')[1]);
  const allCartItems = cartStore.getCartItems;
  const token = userStore.getUserInfo.token;

  const [curItem, setCurItem] = useState({} as Item);
  const [curQuant, setCurQuant] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`item?itemId=${itemId}`);
        setCurItem(res.data.data);
        setIsLoading(false);
      } catch (error: any) {
        if (error.response.data.message === 'item not found') {
          window.location.replace('/error');
        } else {
          modalStore.openModal('에러가 발생했습니다.');
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [itemId]);

  const handlePlus = () => {
    axiosInstance
      .get(`/cart-item?itemId=${itemId}`)
      .then((res) => {
        const itemQuant = res.data.data.quantity;

        if (itemQuant < curQuant + 1) {
          modalStore.openModal('구매가능 수량을 초과하였습니다.');
        } else {
          setCurQuant(curQuant + 1);
        }
      })
      .catch((error) => {
        if (error) modalStore.openModal(error.response.data.message);
      });
  };

  const handleMinus = () => {
    setCurQuant(curQuant - 1);
  };

  const handleOrder = () => {
    if (userStore.getUserType === 'nonuser') {
      modalStore.openModal('로그인이 필요합니다.\n로그인 하시겠습니까?');
    } else if (curItem.stock === 0) {
      modalStore.openModal('상품 품절 등의 사유로\n주문 불가합니다.');
    } else {
      const curDate = getDate();
      const curOrder = [
        {
          id: curItem.id,
          itemName: curItem.itemName,
          price: curItem.price * curQuant,
          quantity: curQuant,
          img: curItem.img,
          stock: curItem.stock,
        },
      ];

      axiosInstance
        .post('/order', { newOrders: curOrder })
        .then((res) => {
          const { id, uniqueId, lowStockItem } = res.data.data;
          itemStore.addToPaidList(curOrder, id, uniqueId, curDate, curItem.price * curQuant);
          modalStore.openModal('주문이 완료되었습니다.');
          if (lowStockItem.length) {
            modalStore.openModal(`품절 등의 사유로\n일부 수량만 결제되었습니다.`);
          } else {
            window.location.reload();
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
          } else if (error.response.data.message === 'all items are soldout') {
            modalStore.openModal('상품 품절 등의 사유로\n주문 불가합니다.');
          } else {
            modalStore.openModal(error.response.data.message);
          }
        });
    }
  };

  const handleAddToCart = () => {
    if (allCartItems.map((el) => el.itemName).includes(curItem.itemName)) {
      modalStore.openModal('이미 추가된 상품입니다.');
    } else {
      if (!token) {
        cartStore.addToCart(curItem);
        modalStore.openModal('장바구니에 추가되었습니다.');
      } else {
        axiosInstance
          .post('/cart-item', { itemId: curItem.id, quantity: curQuant })
          .then((res) => {
            curItem.id = res.data.data.id;
            cartStore.addToCart(curItem);
            setCurItem(curItem);
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

  return (
    <ItemPageWrapper>
      <InnerContainer>
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <>
            <ItemContainer>
              <ItemImg src={`/images/items/${curItem.img}`} />
              <InfoContainer>
                <ItemName>{curItem.itemName}</ItemName>
                <ItemPrice>{priceToString(curItem.price || 0)}</ItemPrice>
                <QuantManager>
                  <div style={{ width: '100%', marginBottom: '1rem' }}>{curItem.itemName}</div>
                  <QuantContainer>
                    <QuantDiv>{curQuant}</QuantDiv>
                    <QuantBntContainer>
                      <QuantBnt onClick={handlePlus} disabled={curItem.stock === 0}>
                        <FontAwesomeIcon icon={faAngleUp} />
                      </QuantBnt>
                      <QuantBnt onClick={handleMinus} disabled={curQuant === 1}>
                        <FontAwesomeIcon icon={faAngleDown} />
                      </QuantBnt>
                    </QuantBntContainer>
                  </QuantContainer>
                  <div>{priceToString(curQuant * curItem.price || 0)}</div>
                </QuantManager>
                <BntContaienr>
                  {curItem.status === '품절' ? (
                    <DetailBnt color='silver' disabled>
                      일시품절
                    </DetailBnt>
                  ) : null}
                  <DetailBnt color='black' onClick={handleAddToCart}>
                    장바구니 담기
                  </DetailBnt>
                  {curItem.status === '품절' ? null : (
                    <DetailBnt
                      color='blue'
                      onClick={handleOrder}
                      disabled={curItem.status === '품절'}
                    >{`바로구매 >`}</DetailBnt>
                  )}
                </BntContaienr>
              </InfoContainer>
            </ItemContainer>
            <DetailContainer>
              <DetailTitle>상품상세정보</DetailTitle>
              <Description>{curItem.itemName}입니다.</Description>
            </DetailContainer>
          </>
        )}
      </InnerContainer>
    </ItemPageWrapper>
  );
}

export default observer(ItemPage);
