export const Colors = {
  black: '#303030',
  darkGray: '#575757',
  gray: '#7a7a7a',
  mediumGray: '#a7a7a7',
  lightGray: '#e0e2e3',
  borderColor: '#ccc',
  blue: '#0d5be1',
};

export const priceToString = (price: number | null | string) => {
  if (price === null) return '-';
  else return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
};

export const getDate = () => {
  let today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString().replace('T', ' ').substring(0, 10);
};

export const dateObj: { [key: string]: number } = {
  오늘: 1000 * 60 * 60 * 24,
  '1주': 1000 * 60 * 60 * 24 * 7,
  '1개월': 1000 * 60 * 60 * 24 * 30,
  '3개월': 1000 * 60 * 60 * 24 * 30 * 3,
};
