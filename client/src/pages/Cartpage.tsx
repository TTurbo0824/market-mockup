import { useState, useEffect, useMemo } from 'react';
import { useStores } from '../stores/Context';
import { observer } from 'mobx-react';
import { Item } from '../interface/Item';
import styled from 'styled-components';
import { Colors, priceToString, getDate } from '../components/utils/_var';
import { Tag } from '../components/ItemCardList';
import Loading from '../components/Loading';
import EmptyCart from '../components/EmptyCart';
import axiosInstance from '../components/utils/axiosInstance';

const CartpageWrapper = styled.div`
  width: 60rem;
  min-height: calc(100vh - 136px);
  display: grid;
  grid-template-areas: 'cart pay';
  grid-template-columns: 73% 27%;
  margin: 0 auto;
  button,
  input,
  label {
    cursor: pointer;
  }
`;

const CartContainer = styled.div`
  grid-area: cart;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const TopContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const CheckAll = styled.input`
  margin-right: 0.5rem;
`;

const SelDeleteBnt = styled.button`
  background-color: white;
  border: none;
  :last-of-type {
    margin-right: 1rem;
  }
`;

const ItemContainer = styled.div`
  display: grid;
  width: 100%;
  height: fit-content;
  grid-template-areas: 'check img item price delete';
  grid-template-columns: 6% 15% 39% 35% 5%;
  border: 1px solid ${Colors.lightGray};
  margin: 0.75rem 1.25rem 0 0;
  padding: 1rem 0.5rem;
  :last-of-type {
    margin-bottom: 1rem;
  }
`;

const CartImg = styled.img`
  grid-area: img;
  width: 5rem;
`;

const CheckEach = styled.input`
  grid-area: check;
  width: fit-content;
`;

const DeleteBnt = styled.button`
  grid-area: delete;
  background-color: white;
  border: none;
  font-size: 1.25rem;
  align-self: flex-start;
`;

const NameDiv = styled.div`
  grid-area: item;
`;

const PriceDiv = styled.div`
  width: 100%;
  text-align: center;
`;

const PriceContainer = styled.div`
  grid-area: price;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0.5rem;
`;

const QuantContainer = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.color};
  width: fit-content;
  height: 1.55rem;
  align-items: center;
`;

const Quant = styled.div`
  padding-right: 0.4rem;
  width: 1.75rem;
  text-align: right;
  color: ${(props) => props.color};
`;

const QuantBnt = styled.button`
  height: 100%;
  border: none;
  background-color: white;
  text-align: center;
  :first-child {
    border-right: 1px solid ${(props) => props.color};
  }
  :last-child {
    border-left: 1px solid ${(props) => props.color};
  }
`;

const PayContainer = styled.div`
  grid-area: pay;
  height: 22rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border: 1px solid ${Colors.lightGray};
  padding: 1.25rem 1rem;
  margin-left: 0.25rem;
`;

const TotalQuant = styled.div`
  width: 100%;
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${Colors.lightGray};
`;

const OrderBnt = styled.button`
  width: 100%;
  height: 3rem;
  margin-top: auto;
  font-size: 1rem;
  color: white;
  background-color: ${Colors.blue};
  border: none;
`;

const TitleSpan = styled.span`
  width: 100%;
  font-weight: bold;
`;

const SpanContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  :last-of-type {
    border-top: 1px solid lightgray;
    padding-top: 1rem;
  }
`;

function Cartpage() {
  const { userStore, itemStore, cartStore, modalStore } = useStores();
  const cartItems = cartStore.getCartItems;
  const token = userStore.getUserInfo.token;
  const itemQuantity = cartStore.getItemQuant;

  const [allCartItems, setAllCartItems] = useState(!token ? cartItems : []);
  const itemIdArr = useMemo(() => cartItems.map((el) => el.id), [cartItems]);
  const [checkedItems, setCheckedItems] = useState(!token ? itemIdArr : []);
  const soldOutIds = useMemo(
    () => allCartItems.filter((el) => el.status === '품절').map((el) => el.id),
    [allCartItems],
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          await axiosInstance.get('/cart').then((res) => {
            cartStore.setUpCart(res.data.cartItems, res.data.cartQuant);
            const newCartItems = res.data.cartItems;
            const newItemIdArr = newCartItems.map((el: Item) => el.id);
            setAllCartItems(newCartItems);
            setCheckedItems(newItemIdArr);
            setIsLoading(false);
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes('404')) {
              cartStore.setUpCart([], []);
              setAllCartItems([]);
              setCheckedItems([]);
              setIsLoading(false);
            } else modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
          }
        }
      };
      fetchData();
    }
  }, [cartStore, token, modalStore]);

  const handleAllCheck = (checked: boolean) => {
    setCheckedItems(checked ? itemIdArr : []);
  };

  const handleEachCheck = (checked: boolean, id: number) => {
    if (checked) {
      setCheckedItems([...checkedItems, id]);
    } else {
      setCheckedItems(checkedItems.filter((el) => el !== id));
    }
  };

  const handlePlus = (id: number) => {
    if (!token) {
      const curQuant = itemQuantity.filter((el) => el.itemId === id)[0].quantity;

      axiosInstance
        .get(`/cart-item?itemId=${id}`)
        .then((res) => {
          const itemQuant = res.data.data.quantity;

          if (itemQuant < curQuant + 1) {
            modalStore.openModal('구매가능 수량을 초과하였습니다.');
          } else cartStore.plusQuantity(id);
        })
        .catch((error) => {
          if (error) modalStore.openModal(error.response.data.message);
        });
    } else handleQuant('plus', id);
  };

  const handleMinus = (id: number, quantity: number) => {
    if (quantity === 1) {
      modalStore.openModal(`확인삭제_${id}`);
    } else if (!token) {
      cartStore.minusQuantity(id);
    } else {
      handleQuant('minus', id);
    }
  };

  const handleQuant = (type: string, itemId: number) => {
    axiosInstance
      .patch('/cart-item', { type, itemId })
      .then((res) => {
        if (res.status === 200) {
          if (type === 'plus') cartStore.plusQuantity(itemId);
          else cartStore.minusQuantity(itemId);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
        } else if (error.response.data.message === 'your quantity exceeds current stock') {
          modalStore.openModal('구매가능 수량을 초과하였습니다.');
        } else {
          modalStore.openModal(error.response.data.message);
        }
      });
  };

  const getTotalPrice = () => {
    let total = {
      price: 0,
      quantity: 0,
    };

    for (let i = 0; i < itemIdArr.length; i++) {
      if (checkedItems.includes(itemIdArr[i]) && !soldOutIds.includes(itemIdArr[i])) {
        let quantity = itemQuantity[i].quantity;
        let price = allCartItems[i].price * quantity;
        total.quantity += quantity;
        total.price += price;
      }
    }

    return total;
  };

  const total = getTotalPrice();

  const getPurchaseList = () => {
    const tempList = allCartItems
      .filter((el) => checkedItems.includes(el.id))
      .map((el) => {
        let tempItem = {
          id: el.id,
          itemName: el.itemName,
          price: el.price * itemQuantity[itemIdArr.indexOf(el.id)].quantity,
          quantity: itemQuantity[itemIdArr.indexOf(el.id)].quantity,
          img: el.img,
          stock: el.stock,
        };

        return tempItem;
      });

    return tempList;
  };

  const handlePayment = () => {
    if (userStore.getUserType === 'nonuser') {
      modalStore.openModal('로그인이 필요합니다.\n로그인 하시겠습니까?');
    } else if (allCartItems.length === 0) {
      modalStore.openModal('장바구니가 비어있습니다.');
    } else {
      const purchaseList = getPurchaseList();

      if (!purchaseList.length) {
        modalStore.openModal('구매하실 상품을 선택해주세요.');
      } else {
        const curDate = getDate();

        axiosInstance
          .post('/order', { newOrders: purchaseList })
          .then((res) => {
            const { id, uniqueId, lowStockItem } = res.data.data;
            itemStore.addToPaidList(purchaseList, id, uniqueId, curDate, total.price);
            if (lowStockItem.length) {
              modalStore.openModal(`품절 등의 사유로\n결제되지 못한 상품입니다.#${lowStockItem}`);
            } else {
              window.location.reload();
            }
          })
          .catch((error) => {
            if (error.response.status === 401) {
              modalStore.openModal('장시간 미사용으로\n자동 로그아웃 처리되었습니다.');
            } else if (error.response.data.message === 'all items are soldout') {
              modalStore.openModal('상품 품절 등의 사유로 주문\n가능한 상품이 없습니다.');
            } else {
              modalStore.openModal(error.response.data.message);
            }
          });
      }
    }
  };

  const handleModal = (message: string, items: number[]) => {
    if (!allCartItems.length) {
      modalStore.openModal('장바구니가 비어있습니다.');
    } else if (!items.length) {
      if (message === '품절삭제') {
        modalStore.openModal('품절된 상품이 없습니다.');
      } else if (message === '선택삭제') {
        modalStore.openModal('선택된 상품이 없습니다.');
      }
    } else {
      modalStore.openModal(message);
      cartStore.setToBeDeleted(items);
    }
  };

  const deliveryCharge = 0;
  const discount = 0;
  const finalPrice = total.price + deliveryCharge - discount;

  const prices = [
    {
      field: '상품 가격',
      amount: total.price,
    },
    {
      field: '배송비',
      amount: deliveryCharge,
    },
    {
      field: '할인 예상금액',
      amount: discount,
    },
    {
      field: '총 주문금액',
      amount: finalPrice,
    },
  ];

  return (
    <CartpageWrapper>
      <CartContainer>
        <TopContainer>
          <label>
            <CheckAll
              type='checkbox'
              checked={checkedItems.length === allCartItems.length ? true : false}
              onChange={(e) => handleAllCheck(e.target.checked)}
            />
            전체선택
          </label>
          <div>
            <SelDeleteBnt onClick={() => handleModal('품절삭제', soldOutIds)}>품절상품삭제</SelDeleteBnt>
            <span style={{ fontSize: '0.8rem' }}>|</span>
            <SelDeleteBnt onClick={() => handleModal('선택삭제', checkedItems)}>선택삭제</SelDeleteBnt>
          </div>
        </TopContainer>
        {isLoading ? (
          <Loading />
        ) : allCartItems.length !== 0 ? (
          allCartItems.map((item, idx) => (
            <ItemContainer key={item.id}>
              <CheckEach
                type='checkbox'
                onChange={(e) => handleEachCheck(e.target.checked, item.id)}
                checked={checkedItems.includes(item.id)}
              />
              <CartImg src={`/images/items/${item.img}`} />
              <DeleteBnt onClick={() => handleModal('개별삭제', [item.id])}>✕</DeleteBnt>
              <NameDiv>
                {item.itemName}
                {item.status === '품절' ? <Tag style={{ marginLeft: 0 }}>SOLDOUT</Tag> : null}
              </NameDiv>
              <PriceContainer>
                <PriceDiv>{priceToString(item.price * itemQuantity[idx].quantity)}</PriceDiv>
                <QuantContainer color={item.status === '품절' ? Colors.lightGray : Colors.mediumGray}>
                  <QuantBnt
                    color={item.status === '품절' ? Colors.lightGray : Colors.mediumGray}
                    disabled={item.status === '품절' ? true : false}
                    onClick={() => handleMinus(item.id, itemQuantity[idx].quantity)}
                  >
                    -
                  </QuantBnt>
                  <Quant color={item.status === '품절' ? Colors.lightGray : Colors.black}>
                    {itemQuantity[idx].quantity}
                  </Quant>
                  <QuantBnt
                    color={item.status === '품절' ? Colors.lightGray : Colors.mediumGray}
                    disabled={item.status === '품절' ? true : false}
                    onClick={() => handlePlus(item.id)}
                  >
                    +
                  </QuantBnt>
                </QuantContainer>
              </PriceContainer>
            </ItemContainer>
          ))
        ) : (
          <EmptyCart />
        )}
      </CartContainer>
      <PayContainer>
        <TitleSpan>최종 결제금액</TitleSpan>
        <TotalQuant>
          <span>총 주문상품</span>
          {total.quantity}개
        </TotalQuant>
        {prices.map((price, idx) => (
          <SpanContainer key={idx}>
            <span>{price.field}</span>
            {priceToString(price.amount)}
          </SpanContainer>
        ))}
        <OrderBnt onClick={handlePayment}>주문하기</OrderBnt>
      </PayContainer>
    </CartpageWrapper>
  );
}

export default observer(Cartpage);
