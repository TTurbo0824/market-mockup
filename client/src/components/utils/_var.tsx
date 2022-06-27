export const Colors = {
  black: '#303030',
  darkGray: '#575757',
  gray: '#7a7a7a',
  mediumGray: '#a7a7a7',
  lightGray: '#e0e2e3',
  borderColor: '#ccc',
  blue: '#1b7ced'
};

export const priceToString = (price: number | null) => {
  if (price === null) return '-'
  else return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getDate = () => {
  var today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString().replace('T', ' ').substring(0, 10);
};
