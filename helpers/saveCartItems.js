const saveCartItems = (innerHtml) => {
  localStorage.setItem('cartItems', innerHtml);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
