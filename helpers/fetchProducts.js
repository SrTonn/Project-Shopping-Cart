const fetchProducts = async () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const dataObj = await fetch(API_URL)
    .then((response) => response.json())
    .then((data) => data.results)
    .catch((error) => `Algo deu errado :( \n${error}`);
  return dataObj;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
