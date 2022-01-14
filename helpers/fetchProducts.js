const fetchProducts = async (query) => {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const dataObj = await fetch(API_URL)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => error);
  return dataObj;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
