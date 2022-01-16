const sectionItems = document.querySelector('.items');
const olCart = document.querySelector('.cart__items');
const buttonEmptyCart = document.querySelector('.empty-cart');
const spanPriceTotal = document.querySelector('section > span');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function updatePriceAtCart() {
  let priceTotal = 0;
  olCart.childNodes.forEach((element) => {
    const priceProduct = element.innerText.match(/\$\d*(\.\d{1,})?/)[0];
    priceTotal += Number(priceProduct.slice(1));
  });
  spanPriceTotal.innerHTML = priceTotal;
}

function cartItemClickListener({ target }) {
  target.remove();
  saveCartItems(olCart.innerHTML);
  updatePriceAtCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function clearCartItems() {
  olCart.innerHTML = '';
  saveCartItems(olCart.innerHTML);
  updatePriceAtCart();
}

async function addItemToCart({ target }) {
  console.log(spanPriceTotal);
  const sku = getSkuFromProductItem(target.parentNode);
  const { id, title, price } = await fetchItem(sku);
  olCart.appendChild(createCartItemElement({ name: title, sku: id, salePrice: price }));
  saveCartItems(olCart.innerHTML);
  updatePriceAtCart();
}

function localStorageLoad() {
  olCart.innerHTML = getSavedCartItems();
  olCart.childNodes.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  updatePriceAtCart();
}

async function init() {
  const { results } = await fetchProducts('computador');
  results.forEach((element) => {
    const name = element.title;
    const sku = element.id;
    const image = element.thumbnail;
    sectionItems.appendChild(createProductItemElement({ name, sku, image }));
  });

  document.querySelectorAll('.item__add').forEach((button) => {
    button.addEventListener('click', addItemToCart);
  });
  localStorageLoad();
  buttonEmptyCart.addEventListener('click', clearCartItems);
}

window.onload = () => { 
  init();
};
