import {cart, removeFromCart, updateQuantity} from '../data/cart.js';
import {products,loadProducts,loadProductsFetch} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
//import '../data/backend-practice.js';

loadProductsFetch().then(()=>{
  loadProducts(loadCheckout);
});



function loadCheckout(){
  let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
    <div class="cart-item-container
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary"
            data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input type="number"
            min="0"
            max="100" class="quantity-input">
            <span class="save-quantity-link link-primary"
            data-product-id="${matchingProduct.id}">save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      updateCheckout();
    });
  });

  function updateCheckout(){
  let cartQuantity = 0;

cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
});

document.querySelector('.js-return-to-home-link')
  .innerHTML = `${cartQuantity} items`;
  }
  updateCheckout();



document.querySelectorAll('.update-quantity-link').
forEach((link)=>{
  link.addEventListener('click',()=>{
    let productId=link.dataset.productId;
    const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add('is-editing-quantity');
  })
})


function saveQuantity(productId, container) {

  const input = container.querySelector('.quantity-input');

  if (input.value.trim() === '') {
    alert('Please enter a quantity');
    return;
  }

  let newQuantity = Number(input.value);
  if (newQuantity === 0) {
    removeFromCart(productId);
    container.remove();
    updateCheckout();

  }else if (
    newQuantity >= 1 &&
    newQuantity <= 100 &&
    Number.isInteger(newQuantity)
  ) {

    container.classList.remove('is-editing-quantity');

    container.querySelector('.quantity-label').innerHTML = newQuantity;

    updateQuantity(productId, newQuantity);

    updateCheckout();

  }else {
    alert('Minimum quantity 1 and maximum quantity 100');
  }
}
document.querySelectorAll('.save-quantity-link')
.forEach((link) => {

  let productId = link.dataset.productId;

  const container = document.querySelector(
    `.js-cart-item-container-${productId}`
  );

  link.addEventListener('click', () => {

    saveQuantity(productId, container);

  });
  container.querySelector('.quantity-input')
  .addEventListener('keydown', (event) => {

    if (event.key === 'Enter') {

      event.preventDefault();

      saveQuantity(productId, container);

    }

  });

});
}



  