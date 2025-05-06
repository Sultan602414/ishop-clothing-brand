let mycard = document.querySelector(".cardbox");
let wcard = document.querySelector(".wbox");
let kcard = document.querySelector(".kbox");
let totalPrice = 0; // Initialize total price
let order = 0; // Initialize order count

let crd = "";
let crd2 = "";
let crd3 = "";
let url = "../shop.json";

// Cart items array
let cartItems = [];

// Function to render items in cart and update the total value
const renderCart = () => {
    let cartContainer = document.querySelector(".cart-items");
    cartContainer.innerHTML = "";  // Clear existing content

    cartItems.forEach((item, index) => {
        cartContainer.innerHTML += `
        <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p class='mt-2'>Price: ${item.price}</p>
        <img src="../images/trash.svg" alt="" class="btn-remove delete" data-index="${index}">
        </div>
        `;
    });

    // Update the total value display
    document.querySelector('.total-value').textContent = `Total Payment: $${totalPrice.toFixed(2)}`;

    // Add event listeners to "Remove" buttons
    document.querySelectorAll(".btn-remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let index = e.target.dataset.index;
            removeCartItem(index);  // Call remove function
        });
    });
};

// Function to add item to cart and update total value and order count
const addToCart = (item) => {
    cartItems.push(item);
    totalPrice += parseFloat(item.price);  // Convert price to a number
    order += 1; // Increase order count
    updateOrderCount();  // Update order value display
    renderCart();  // Re-render the cart items
};

// Function to remove item from cart and update total value and order count
const removeCartItem = (index) => {
    totalPrice -= parseFloat(cartItems[index].price);  // Convert price to a number
    cartItems.splice(index, 1);
    order -= 1; // Decrease order count
    updateOrderCount();  // Update order value display
    renderCart();  // Re-render the cart items
};

// Function to update order count in DOM
const updateOrderCount = () => {
    document.querySelector('.order').textContent = `${order}`;
};

const myfunc = async () => {
    let fetch1 = await fetch(url);
    let varj = await fetch1.json();
    console.log(varj);

    let women = varj.filter((name) => name.category == "women");
    let kid = varj.filter((name) => name.category == "kids");
    let men = varj.filter((name) => name.category == "men");

    men.forEach(i => {
        crd += `<div class="col-6 col-sm-4 col-md-3 col-lg-2  mb-3">
        <div class="ccard">
        <img src="${i.img}" alt="">
        <h4>${i.name}</h4>
        <p>Price: $${i.price}</p>
        <button class="btn-outline-dark btn-sm btn add-to-cart" data-item='${JSON.stringify(i)}'>ADD TO CART</button>
        </div>
        </div>
        `;
    });

    women.forEach(i => {
        crd2 += `<div class="col-6 col-sm-4 col-md-3 col-lg-2  mb-3">
        <div class="ccard">
        <img src="${i.img}" alt="">
        <h4>${i.name}</h4>
        <p>Price: $${i.price}</p>
        <button class="btn-outline-dark btn-sm btn add-to-cart" data-item='${JSON.stringify(i)}'>ADD TO CART</button>
        </div>
        </div>
        `;
    });

    kid.forEach(i => {
        crd3 += `<div class="col-6 col-sm-4 col-md-3 col-lg-2  mb-3">
        <div class="ccard">
        <img src="${i.img}" alt="">
        <h4>${i.name}</h4>
        <p>Price: $${i.price}</p>
        <button class="btn-outline-dark btn-sm btn add-to-cart" data-item='${JSON.stringify(i)}'>ADD TO CART</button>
        </div>
        </div>
        `;
    });

    // Update the HTML
    mycard.innerHTML = crd;
    wcard.innerHTML = crd2;
    kcard.innerHTML = crd3;

    // Add event listeners to the "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let item = JSON.parse(e.target.dataset.item);
            addToCart(item);  // Add item to cart
        });
    });
};

myfunc();

// Cart functionality
let crtcros = document.querySelector("#cross");
let cartcont = document.querySelector(".cartcont");
let cart = document.querySelector("#cart");

crtcros.addEventListener("click", () => {
    cartcont.style.display = "none";
});
cart.addEventListener("click", () => {
    cartcont.style.display = "block";
});

// Initial display
document.querySelector('.total-value').textContent = `Total Payment: $${totalPrice.toFixed(2)}`;
document.querySelector('.order').textContent = `${order}`;
