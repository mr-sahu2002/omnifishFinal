
/////////////////////////////////contentfull//////////////////////////////
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "28wptc463a57",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "mCgLs_E6Udeob67YtKwgO2bGZsI7XCciO36I-fnSwpA"
});
////////////////////////////////////////////SCROLLING///////////////////////////////////
window.onscroll = function() {myFunction()};

var navbar = document.getElementById("nav");    
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

////////////////////////////////////////////CART SECTION///////////////////////////////////

//----------------------variables--------------------------------//

//cart button in nav bar to open
const cartBtn=document.querySelector('.cart-btn');
//cart close button in cart hidden section (overlay)
const closeCartBtn=document.querySelector('.close-cart');
//clear the item of cart
const clearCartBtn=document.querySelector('.clear-cart');
//slecting the whole cart part in white 
const cartDOM=document.querySelector('.cart');
//the overlay after pressing the cart button
const cartOverlay=document.querySelector('.cart-overlay');
//all item in the cart
const cartItems=document.querySelector('.cart-items');
//cart total price section (calculation)
const cartTotal=document.querySelector('.cart-total'); 
//all item
const cartContent=document.querySelector('.cart-content'); 
//slecting the cart main section (fish)
const fishDOM=document.querySelector('.products-center'); 
//slecting the cart main section (chicken)
const chickenDOM=document.querySelector('.chickensection');
//slecting the cart main section (egg)
const eggDOM=document.querySelector('.eggsection')

//cart
let cart=[];
//buttons
let buttonsDOM=[];

///////////////////////////////////////////// all class (3) ////////////////////

//getting the products from products.json
class Products{
  
  //async not understood?
  async getProducts(){
    try {

      let contentful = await client.getEntries({
        content_type:"omnifish"
      });

      let result= await fetch("products.json");
      let data= await result.json();

      let products=contentful.items;
      products=products.map(item =>{
        const {title, price,category}=item.fields;
        const {id}= item.sys
        const image= item.fields.image.fields.file.url;
        return { title, price, category, id, image }; 
      })
      return products;
    } catch (error) {
      console.log(error);
    }
    
  }
}

//----------------------------display products---------------------//

class UI{
  displayProducts(products){
    let result="";
    let resultTow="";
    let resultThree="";

    products.forEach(product =>{
      if(product.category === 'fish'){
        result +=`
        <!-- single product -->
            <article class="product">
              <div class="img-container">
                <img
                  src=${product.image}
                  alt="product"
                  class="product-img"
                />
                <button class="bag-btn" data-id=${product.id}>
                  <i class="fas fa-shopping-cart"></i>
                  add to cart
                </button>
              </div>
              <h3>${product.title}</h3>
              <h4>₹${product.price}</h4>
            </article>
            <!-- end of single product -->
        `
      }else if(product.category === 'chicken'){
        resultTow +=`
        <!-- single product -->
            <article class="product">
              <div class="img-container">
                <img
                  src=${product.image}
                  alt="product"
                  class="product-img"
                />
                <button class="bag-btn" data-id=${product.id}>
                  <i class="fas fa-shopping-cart"></i>
                  add to cart
                </button>
              </div>
              <h3>${product.title}</h3>
              <h4>₹${product.price}</h4>
            </article>
            <!-- end of single product -->
        `
      }else if(product.category === 'egg'){
        resultThree +=`
        <!-- single product -->
            <article class="product">
              <div class="img-container">
                <img
                  src=${product.image}
                  alt="product"
                  class="product-img"
                />
                <button class="bag-btn" data-id=${product.id}>
                  <i class="fas fa-shopping-cart"></i>
                  add to cart
                </button>
              </div>
              <h3>${product.title}</h3>
              <h4>₹${product.price}</h4>
            </article>
            <!-- end of single product -->
        `
      }

    });
     fishDOM.innerHTML=result;
     chickenDOM.innerHTML=resultTow;
     eggDOM.innerHTML=resultThree;
  }
  getBagButtons(){
    let buttons=[...document.querySelectorAll(".bag-btn")];//spread opreator(...)
    buttonsDOM=buttons;
    buttons.forEach(button=>{
      let id=button.dataset.id;
      let inCart=cart.find(item => item.id === id);
      if(inCart){
        button.innerText="In cart";
        button.disabled=true;
      }
      else{
        button.addEventListener('click', event=>{
          //disable button
          event.target.innerText="In Cart";
          event.target.disabled= true;
          //get product for products
          let cartItem={...Storage.getProduct(id), amount: 1};
          //add product to the cart
          cart=[...cart, cartItem];
          //save cart in local storage
          Storage.saveCart(cart);
          //set cart values
          this.setCartvalues(cart);
          //display cart items
          this.addCartItem(cartItem);
          //show the cart 
          this.showCart();
        })
      }
    });
  }
  setCartvalues(cart){
    let tempTotal=0;
    let itemsTotal=0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText= parseFloat(tempTotal.toFixed(2))
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item){
    const div=document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML=`
    <img src=${item.image} alt="product">
          <div>
            <h4>${item.title}</h4>
            <h5>₹${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>

        <div>
          <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
    cartContent.appendChild(div);
  }
  showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }

  //set app the card for showing and hidding cart
  setupApp(){
    cart=Storage.getCart();
    this.setCartvalues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
  }
  populateCart(cart){
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart(){
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }

  //for clearing the cart and funtaionlity
    cartLogic(){
      //clear cart button
      clearCartBtn.addEventListener('click', ()=>{
        this.clearCart();
      });
      //cart functionality
      cartContent.addEventListener('click', event =>{
       if(event.target.classList.contains('remove-item')){
         let removeItem=event.target;
         let id=removeItem.dataset.id;
         //>>error data is not removing from localstorage
         cartContent.removeChild(removeItem.parentElement.parentElement);
         this.removeItem(id);
       }
       else if(event.target.classList.contains("fa-chevron-up")){
         let addAmount=event.target;
         let id= addAmount.dataset.id;
         let tempItem= cart.find(item => item.id === id);
         tempItem.amount= tempItem.amount +1;
         Storage.saveCart(cart);
         this.setCartvalues(cart);
         addAmount.nextElementSibling.innerText= tempItem.amount;
       }
       else if(event.target.classList.contains("fa-chevron-down")){
          let lowerAmount=event.target;
          let id=lowerAmount.dataset.id;
          let tempItem=cart.find(item =>item.id === id);
          tempItem.amount= tempItem.amount -1;
          if(tempItem.amount > 0){
            Storage.saveCart(cart);
            this.setCartvalues(cart);
            lowerAmount.previousElementSibling.innerText=tempItem.amount;
          }
          else{
            cartContent.removeChild(lowerAmount.parentElement.parentElement);
            this.removeItem(id);
          }
       }
      });
    }

    clearCart(){
      let cartItems=cart.map(item => item.id);
      cartItems.forEach(id => this.removeItem(id));
       while(cartContent.children.length> 0){
         cartContent.removeChild(cartContent.children[0]);
         //hide cart after clearing the cart
        }
       this.hideCart();
    }
    removeItem(id){
      cart= cart.filter(item => item.id !==id);
      this.setCartvalues(cart);
      Storage.saveCart(cart);
      let button= this.getSingleButton(id);
      button.disabled=false;
      button.innerHTML=`<i class="fas fa-shopping-cart"></i>add to cart`;

    }
    getSingleButton(id){
      return buttonsDOM.find(button =>button.dataset.id === id);
    }
}

//----------------------------local storage------------------------//
class Storage{
  static saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products))
  }
  static getProduct(id){
    let products=JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }
  static saveCart(cart){
    localStorage.setItem('cart',JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

//-----------------------------eventlistner---------------------------//
document.addEventListener("DOMContentLoaded",()=>{
  const ui= new UI();
  const products= new Products(); 
  ui.setupApp();

//get all products
 products
      .getProducts()
      .then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
      })
      .then(() => {
        ui.getBagButtons();
        ui.cartLogic();
      });
  });


///////////////// Firebase ////////////////////////

document.addEventListener('DOMContentLoaded', function() {
  const loadEl = document.querySelector('#load');

  try {
    let app = firebase.app();
    let features = [
      'auth', 
      'database', 
      'firestore',
      'functions',
      'messaging', 
      'storage', 
      'analytics', 
      'remoteConfig',
      'performance',
    ].filter(feature => typeof app[feature] === 'function');
    loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
  } catch (e) {
    console.error(e);
    loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
  }
});

///// User Authentication /////

const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');


const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h2>${user.displayName}</h2>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

