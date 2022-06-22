export const Colors = {
  black: '#303030',
  darkGray: '#575757',
  gray: '#7a7a7a',
  mediumGray: '#a7a7a7',
  lightGray: '#e0e2e3',
  borderColor: '#ccc',
  blue: '#1b7ced'
};

export const priceToString = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
