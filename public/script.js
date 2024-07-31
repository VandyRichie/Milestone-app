// Shoe data
const shoes = [
    { name:   "Sneakers",   
      price:   17500,   
      image:   "https://i5.walmartimages.com/asr/9fbd62ae-c191-4de9-93b1-998bb4525be0_1.0904e1f970b4179fa9b424984e09444f.jpeg", 
      details:  "These sneakers are comfortable and stylish."
    },  
    { name:   "Boots",   
      price:   30000,   
      image:   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXdjUz8azdFDC9U0_sKyr1mKztGdE_P6EduMcrZyUcdc7g_jdgK2NpbrwR&s=10", 
      details:  "These boots offer excellent traction and durability."
    },  
    { name:   "Sandals",   
      price:   8300,   
      image:   "https://th.bing.com/th/id/OIP.EhOANMkl1-H9eab4m9r9fwAAAA?rs=1&pid=ImgDetMain, https://th.bing.com/th/id/OIP.Ln1jL13Cynyf5FsIPa8pCQHaF4?w=680&h=540&rs=1&pid=ImgDetMain", 
      details:  "These sandals are perfect for casual occasions."
    },  
];

// Function to create product elements
function createProductElement(shoe) {
    const product = document.createElement("div");
    product.classList.add("product");

    const img = document.createElement("img");
    img.src = shoe.image.split(', ')[0]; // Assuming the first image is the main image
    product.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = shoe.name;
    product.appendChild(name);

    const price = document.createElement("p");
    price.textContent = `${shoe.price}`;
    product.appendChild(price);

    const addToCartButton = document.createElement("button");
    addToCartButton.classList.add("add-to-cart");
    addToCartButton.textContent = "Add to Cart";
    // Add a data attribute to store the shoe information (optional)
    addToCartButton.dataset.shoeId = shoe.id; // Assuming you have an ID for each shoe
    product.appendChild(addToCartButton);

    product.addEventListener('click',   () => {
        const modal = document.getElementById('product-details-modal');
        const modalShoeName = document.getElementById('modal-shoe-name');
        const modalShoeImage = document.getElementById('modal-shoe-image');
        const modalShoePrice = document.getElementById('modal-shoe-price');
        const modalShoeDetails = document.getElementById('modal-shoe-details');
        modalShoeName.textContent = shoe.name;
        modalShoeImage.src = shoe.image.split(', ')[0]; // Assuming the first image is the main image
        modalShoePrice.textContent = `${shoe.price}`;
        modalShoeDetails.textContent = shoe.details || 'More information coming soon!'; // Add details if available
        modal.style.display = 'block'; 
    });
    return product;
}

// Close Modal functionality
const closeModal = document.querySelector('.close-modal');
closeModal.addEventListener('click',   () => {
    document.getElementById('product-details-modal').style.display = 'none';
});


// Populate featured products
const featuredProductsContainer = document.querySelector("#featured-products .product-container");
shoes.slice(0,   2).forEach(shoe => {
    featuredProductsContainer.appendChild(createProductElement(shoe));
});

// Populate all products
const allProductsContainer = document.querySelector("#all-products .product-container");
shoes.forEach(shoe => {
    allProductsContainer.appendChild(createProductElement(shoe));
});

//Cart system
let cart = []; // Array to store cart items

// Load cart from local storage if it exists
const storedCart = localStorage.getItem('cart');
if (storedCart) {
    cart = JSON.parse(storedCart);
}

// Function to add a shoe to the cart
function addToCart(shoe) {
    // Check if the shoe is already in the cart
    const existingShoe = cart.find(item => item.name === shoe.name);

    if (existingShoe) {
        // Increase quantity if already in cart
        existingShoe.quantity++;
    } else {
        // Add the shoe to the cart with quantity 1
        cart.push({ ...shoe,   quantity:   1 });
    }

    // Update local storage
    localStorage.setItem('cart',   JSON.stringify(cart));
    updateCartDisplay();
}

// Add event listeners to "Add to Cart" buttons (you'll need to add these buttons to your product divs)
// Example:  
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      try {
        const itemId = button.dataset.itemId; // Assuming the button has a data-item-id attribute
        const response = await fetch('/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item: itemId }) 
        });
        if (response.ok) {
          // Success - update the UI (e.g., display a message, update cart count)
        } else {
          // Error - handle the error (e.g., display an error message)
        }
      } catch (error) {
        // Handle any errors during the fetch request
      }
    });
  });

// Function to update the cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price:   ${item.price}</p>
                <p>Quantity:   ${item.quantity}</p>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
}

// Call updateCartDisplay initially to show any existing cart items
updateCartDisplay();

const viewCartButton = document.getElementById('view-cart');
const shoppingCart = document.getElementById('shopping-cart');

viewCartButton.addEventListener('click',   () => {
    shoppingCart.style.display = 'block'; // Show the cart
});

const checkoutButton = document.getElementById('checkout');
checkoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' } 
      });
      if (response.ok) {
        // Success - update the UI (e.g., display a message, clear the cart)
      } else {
        // Error - handle the error (e.g., display an error message)
      }
    } catch (error) {
      // Handle any errors during the fetch request
    }
  });

const loginButton = document.getElementById('login-button'); 
const logoutButton = document.getElementById('logout-button');
const userInfo = document.getElementById('user-info');
const ReplitAuth = require('replit-auth');
const axios = require('axios');


loginButton.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission
  try {
    // ... (Your login logic)
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }) 
    });
    if (response.ok) {
      // Login successful
    } else {
      const data = await response.json();
      // Display an error message to the user
      alert(data.message); 
    }
  } catch (error) {
    // Handle any network errors or other unexpected issues
    console.error('Login error:', error);
  }
});

function updateUserInfo() {
 if (ReplitAuth.isLoggedIn()) {
    const username = ReplitAuth.getUsername();
    userInfo.textContent = `Welcome,   ${username}!`;
    } else {
        userInfo.textContent = ''; 
    }
}

updateUserInfo();
ReplitAuth.on('login',   updateUserInfo); // Listen for login events
