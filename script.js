const sectionItems = document.querySelector('.items');
const sectionLoading = document.querySelector('.loading');
const olCart = document.querySelector('.cart__items');
const buttonEmptyCart = document.querySelector('.empty-cart');
const spanPriceTotal = document.querySelector('section > span');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(newElement, className, innerText) {
  const element = document.createElement(newElement);
  element.className = className;
  if (innerText) {
    element.innerText = innerText;
  }
  return element;
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
  spanPriceTotal.innerHTML = priceTotal
    .toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
}

function cartItemClickListener({ target }) {
  target.parentNode.remove();
  saveCartItems(olCart.innerHTML);
  updatePriceAtCart();
}

function createCartItemElement({ name, image, salePrice }) {
  const li = document.createElement('li');
  const tagP = createCustomElement('p', '', name);
  const spanX = createCustomElement('span', 'cart__close-button', 'X');
  tagP.appendChild(createCustomElement('span', 'cart__item-price', `R$${salePrice}`));
  li.className = 'cart__item';
  li.appendChild(createProductImageElement(image));
  li.appendChild(tagP);
  li.appendChild(spanX);
  spanX.addEventListener('click', cartItemClickListener);
  return li;
}

function clearCartItems() {
  olCart.innerHTML = '';
  saveCartItems(olCart.innerHTML);
  updatePriceAtCart();
}

async function addItemToCart({ target }) {
  const getSku = getSkuFromProductItem(target.parentNode);
  const { title: name, price: salePrice, thumbnail: image } = await fetchItem(getSku);
  const liItem = createCartItemElement({ name, image, salePrice });
  olCart.appendChild(liItem);
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

function removeLoadMsg() {
  sectionLoading.remove();
}

async function init() {
  const { results } = await fetchProducts('computador');
  if (!results) return;

  removeLoadMsg();
  results.forEach((element) => {
    const name = element.title;
    const sku = element.id;
    const image = element.thumbnail.replace(/[A-Z].jpg$/, 'W.webp');
    const newSection = createProductItemElement({ name, sku, image })
    newSection.querySelector('.item__add').addEventListener('click', addItemToCart);
    sectionItems.appendChild(newSection);
  });

  localStorageLoad();
  buttonEmptyCart.addEventListener('click', clearCartItems);
}

window.onload = () => { 
  init();
};

/**
 * Referência de como formatar moeda para BRL
 * Ref.: https://www.horadecodar.com.br/2020/09/01/formatar-moeda-brasileira-em-javascript-float-para-real/
 */