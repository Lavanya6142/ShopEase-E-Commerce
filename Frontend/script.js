// ======================================================
// SHOPEASE - MAIN JAVASCRIPT
// ======================================================


// ======================================================
// CART
// ======================================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const addCartButtons = document.querySelectorAll(".add-cart");
const cartCountElement = document.querySelector(".cart-count");


// Update cart count
function updateCartCount() {

    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }

}


// ======================================================
// ADD PRODUCT TO CART
// ======================================================

addCartButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const productCard = button.closest(".product-card");

        const product = {
            id: productCard.getAttribute("data-product-id"),
            name: productCard.querySelector("h3").textContent.trim(),
            price: productCard.querySelector(".price").textContent.trim(),
            image: productCard.querySelector("img").src,
            category: productCard.querySelector(".product-category").textContent.trim(),
            description: productCard.getAttribute("data-description"),
            quantity: 1
        };

        cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        alert(product.name + " added to cart!");

    });

});


// Initial cart count
updateCartCount();


// ======================================================
// VIEW PRODUCT DETAILS
// ======================================================

const viewDetailsButtons = document.querySelectorAll(".view-details");

viewDetailsButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const productCard = button.closest(".product-card");

        const product = {

            id: productCard.getAttribute("data-product-id"),

            name: productCard.querySelector("h3").textContent.trim(),

            price: productCard.querySelector(".price").textContent.trim(),

            image: productCard.querySelector("img").src,

            category: productCard.querySelector(".product-category").textContent.trim(),

            description: productCard.getAttribute("data-description")

        };

        localStorage.setItem(
            "selectedProduct",
            JSON.stringify(product)
        );

        window.location.href = "product-details.html";

    });

});


// ======================================================
// SEARCH
// ======================================================

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

if (searchInput && searchButton) {

    searchButton.addEventListener("click", function() {

        const searchText =
            searchInput.value.trim().toLowerCase();

        const productCards =
            document.querySelectorAll(".product-grid > .product-card");

        productCards.forEach(function(card) {

            const productName =
                card.querySelector("h3").textContent.toLowerCase();

            const categoryElement =
                card.querySelector(".product-category");

            const productCategory =
                categoryElement
                    ? categoryElement.textContent.toLowerCase()
                    : "";

            if (
                productName.includes(searchText) ||
                productCategory.includes(searchText)
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });


        // Scroll only if products section exists
        const productsSection =
            document.getElementById("products");

        if (productsSection) {

            productsSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });


    // Search using Enter key
    searchInput.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            searchButton.click();

        }

    });

}


// ======================================================
// CART PAGE
// ======================================================

const cartItemsContainer =
    document.getElementById("cartItems");

const cartTotalElement =
    document.getElementById("cartTotal");


if (cartItemsContainer) {

    displayCart();

}


function displayCart() {

    cartItemsContainer.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <p style="text-align:center; color:#6b7280;">
                Your cart is empty.
            </p>
        `;

        if (cartTotalElement) {
            cartTotalElement.textContent = "₹0";
        }

        return;

    }


    cart.forEach(function(product, index) {

        const price =
            parseFloat(
                product.price.replace(/[₹,]/g, "")
            );

        const quantity =
            product.quantity || 1;

        const subtotal =
            price * quantity;

        total += subtotal;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="cart-item-info">

                <h3>${product.name}</h3>

                <p>
                    ₹${price.toLocaleString("en-IN")}
                </p>

                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>

            </div>

            <div class="cart-item-right">

                <strong>
                    ₹${subtotal.toLocaleString("en-IN")}
                </strong>

                <button
                    class="remove-cart-btn"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

        `;


        cartItemsContainer.appendChild(cartItem);

    });


    if (cartTotalElement) {

        cartTotalElement.textContent =
            "₹" + total.toLocaleString("en-IN");

    }

}


// ======================================================
// INCREASE CART QUANTITY
// ======================================================

function increaseQuantity(index) {

    if (!cart[index].quantity) {
        cart[index].quantity = 1;
    }

    cart[index].quantity++;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

    updateCartCount();

}


// ======================================================
// DECREASE CART QUANTITY
// ======================================================

function decreaseQuantity(index) {

    if (!cart[index].quantity) {
        cart[index].quantity = 1;
    }


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

    updateCartCount();

}


// ======================================================
// REMOVE PRODUCT FROM CART
// ======================================================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

    updateCartCount();

}


// ======================================================
// CHECKOUT PAGE
// ======================================================

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutTotal =
    document.getElementById("checkoutTotal");


if (checkoutItems) {

    displayCheckout();

}


function displayCheckout() {

    let total = 0;

    checkoutItems.innerHTML = "";


    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p style="text-align:center; color:#6b7280;">
                Your cart is empty.
            </p>
        `;

        if (checkoutSubtotal) {
            checkoutSubtotal.textContent = "₹0";
        }

        if (checkoutTotal) {
            checkoutTotal.textContent = "₹0";
        }

        return;

    }


    cart.forEach(function(product) {

        const price =
            parseFloat(
                product.price.replace(/[₹,]/g, "")
            );

        const quantity =
            product.quantity || 1;

        const subtotal =
            price * quantity;

        total += subtotal;


        const checkoutItem =
            document.createElement("div");

        checkoutItem.className =
            "checkout-item";


        checkoutItem.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="checkout-item-info">

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ₹${price.toLocaleString("en-IN")}
                    × ${quantity}
                </p>

            </div>

            <div class="checkout-item-price">

                ₹${subtotal.toLocaleString("en-IN")}

            </div>

        `;


        checkoutItems.appendChild(checkoutItem);

    });


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            "₹" + total.toLocaleString("en-IN");

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            "₹" + total.toLocaleString("en-IN");

    }

}

// ======================================================
// PLACE ORDER
// ======================================================

const checkoutForm =
    document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            // Check cart
            if (cart.length === 0) {
                alert(
                    "Your cart is empty. Please add products before placing an order."
                );
                return;
            }

            // Get customer details
            const fullName =
                document.getElementById("fullName").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const address =
                document.getElementById("address").value.trim();

            const city =
                document.getElementById("city").value.trim();

            const pincode =
                document.getElementById("pincode").value.trim();

            const paymentElement =
                document.querySelector(
                    'input[name="payment"]:checked'
                );

            if (!paymentElement) {
                alert("Please select a payment method.");
                return;
            }

            const payment =
                paymentElement.value;

            // Validate fields
            if (
                !fullName ||
                !email ||
                !phone ||
                !address ||
                !city ||
                !pincode
            ) {
                alert(
                    "Please fill in all delivery details."
                );
                return;
            }

            // Calculate total
            let total = 0;

            cart.forEach(function (product) {

                const price =
                    parseFloat(
                        product.price.replace(/[₹,]/g, "")
                    );

                const quantity =
                    product.quantity || 1;

                total += price * quantity;
            });



// ==================================================
// ONLINE PAYMENT
// ==================================================

if (payment === "online") {

    console.log("Online payment selected");

    const paymentOrder = {

        customerName: fullName,

        customerEmail: email,

        phone: phone,

        address: address,

        city: city,

        pincode: pincode,

        totalAmount: total,

        orderItems: cart

    };

    // Save order information temporarily
    localStorage.setItem(
        "paymentOrder",
        JSON.stringify(paymentOrder)
    );

    console.log(
        "Payment order saved:",
        paymentOrder
    );

    // Go to payment page
    window.location.href = "payment.html";

    return;
}  

            // ==================================================
            // CASH ON DELIVERY
            // ==================================================

            try {

                // Send COD order to Spring Boot
                const response = await fetch(
                    "https://shopease-e-commerce-production.up.railway.app/orders",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                localStorage.getItem("token")
                        },

                        body: JSON.stringify({

                            customerName:
                                fullName,

                            customerEmail:
                                email,

                            phone:
                                phone,

                            address:
                                address,

                            city:
                                city,

                            pincode:
                                pincode,

                            payment:
                                payment,

                            orderDate:
                                new Date()
                                    .toISOString()
                                    .split("T")[0],

                            totalAmount:
                                total,

                            status:
                                "PLACED",

                            orderItems:
                                cart.map(
                                    function (product) {

                                        return {

                                            quantity:
                                                product.quantity || 1,

                                            price:
                                                parseFloat(
                                                    product.price
                                                        .replace(/[₹,]/g, "")
                                                ),

                                            product: {

                                                id:
                                                    Number(product.id)

                                            }

                                        };

                                    }
                                )

                        })

                    }
                );


                // Check response
                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Backend Error:",
                        errorText
                    );

                    throw new Error(
                        "Failed to place order"
                    );
                }


                // Get saved order
                const savedOrder =
                    await response.json();


                // Success message
                alert(
                    "Order placed successfully!\n\n" +

                    "Order ID: " +
                    savedOrder.id +

                    "\nCustomer: " +
                    fullName +

                    "\nPayment: Cash on Delivery" +

                    "\nTotal: ₹" +
                    total.toLocaleString("en-IN")
                );


                // Clear cart
                cart = [];

                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );

                updateCartCount();


                // Go to My Orders
                window.location.href =
                    "orders.html";


            } catch (error) {

                console.error(
                    "Order Error:",
                    error
                );

                alert(
                    "Unable to place the order.\n\n" +
                    "Please make sure the backend server is running."
                );

            }

        }
    );

}



// ======================================================
// LOGIN / LOGOUT BUTTON
// ======================================================

const token =
    localStorage.getItem("token");

const loginButton =
    document.getElementById("loginButton");


if (loginButton && token) {

    loginButton.textContent =
        "Logout";


    loginButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "token"
            );

            alert(
                "You have been logged out."
            );

            window.location.href =
                "index.html";

        }
    );

}


// ======================================================
// PRODUCT DETAILS PAGE
// ======================================================

const productDetailsPage =
    document.getElementById(
        "product-details-page"
    );


if (productDetailsPage) {

    const selectedProduct =
        JSON.parse(
            localStorage.getItem(
                "selectedProduct"
            )
        );


    if (selectedProduct) {

        document.getElementById(
            "product-image"
        ).src =
            selectedProduct.image;


        document.getElementById(
            "product-image"
        ).alt =
            selectedProduct.name;


        document.getElementById(
            "product-name"
        ).textContent =
            selectedProduct.name;


        document.getElementById(
            "product-price"
        ).textContent =
            selectedProduct.price;


        document.getElementById(
            "product-description"
        ).textContent =
            selectedProduct.description ||
            "No description available.";


        const quantityInput =
            document.getElementById(
                "quantity"
            );


        // Increase quantity
        document.getElementById(
            "increase-btn"
        ).addEventListener(
            "click",
            function() {

                quantityInput.value =
                    parseInt(
                        quantityInput.value
                    ) + 1;

            }
        );


        // Decrease quantity
        document.getElementById(
            "decrease-btn"
        ).addEventListener(
            "click",
            function() {

                let quantity =
                    parseInt(
                        quantityInput.value
                    );


                if (quantity > 1) {

                    quantityInput.value =
                        quantity - 1;

                }

            }
        );


        // Add to cart
        document.getElementById(
            "add-to-cart-btn"
        ).addEventListener(
            "click",
            function() {

                const quantity =
                    parseInt(
                        quantityInput.value
                    );


                let productCart =
                    JSON.parse(
                        localStorage.getItem(
                            "cart"
                        )
                    ) || [];


                for (
                    let i = 0;
                    i < quantity;
                    i++
                ) {

                    productCart.push(
                        selectedProduct
                    );

                }


                localStorage.setItem(
                    "cart",
                    JSON.stringify(
                        productCart
                    )
                );


                cart =
                    productCart;


                updateCartCount();


                alert(
                    "Product added to cart!"
                );

            }
        );


        // Buy Now
        document.getElementById(
            "buy-now-btn"
        ).addEventListener(
            "click",
            function() {

                const quantity =
                    parseInt(
                        quantityInput.value
                    );


                let productCart =
                    JSON.parse(
                        localStorage.getItem(
                            "cart"
                        )
                    ) || [];


                for (
                    let i = 0;
                    i < quantity;
                    i++
                ) {

                    productCart.push(
                        selectedProduct
                    );

                }


                localStorage.setItem(
                    "cart",
                    JSON.stringify(
                        productCart
                    )
                );


                window.location.href =
                    "cart.html";

            }
        );

    } else {

        alert(
            "Product not found."
        );

        window.location.href =
            "products.html";

    }

}


// ======================================================
// PRODUCT REVIEWS
// ======================================================

const ratingStars =
    document.querySelectorAll(
        ".rating-star"
    );


let selectedRating = 5;


const reviewProduct =
    JSON.parse(
        localStorage.getItem(
            "selectedProduct"
        )
    );


let productId =
    reviewProduct
        ? reviewProduct.id
        : "unknown";


const reviewStorageKey =
    "reviews_" + productId;


// Star selection
ratingStars.forEach(
    function(star) {

        star.addEventListener(
            "click",
            function() {

                selectedRating =
                    parseInt(
                        star.getAttribute(
                            "data-rating"
                        )
                    );


                ratingStars.forEach(
                    function(item) {

                        const rating =
                            parseInt(
                                item.getAttribute(
                                    "data-rating"
                                )
                            );


                        if (
                            rating <=
                            selectedRating
                        ) {

                            item.classList.add(
                                "active"
                            );

                        } else {

                            item.classList.remove(
                                "active"
                            );

                        }

                    }
                );

            }
        );

    }
);


// ======================================================
// LOAD REVIEWS
// ======================================================

function loadReviews() {

    const reviewsList =
        document.getElementById(
            "reviews-list"
        );


    if (!reviewsList) {
        return;
    }


    reviewsList.innerHTML = "";


    const reviews =
        JSON.parse(
            localStorage.getItem(
                reviewStorageKey
            )
        ) || [];


    reviews.forEach(
        function(review) {

            displayReview(
                review.name,
                review.rating,
                review.text
            );

        }
    );

}


// ======================================================
// DISPLAY REVIEW
// ======================================================

function displayReview(
    name,
    rating,
    reviewText
) {

    const reviewsList =
        document.getElementById(
            "reviews-list"
        );


    if (!reviewsList) {
        return;
    }


    const reviewItem =
        document.createElement(
            "div"
        );


    reviewItem.className =
        "review-item";


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= rating
                ? "★"
                : "☆";

    }


    reviewItem.innerHTML = `

        <div class="review-header">

            <strong>
                ${name}
            </strong>

            <span class="review-stars">
                ${stars}
            </span>

        </div>

        <p>
            ${reviewText}
        </p>

    `;


    reviewsList.appendChild(
        reviewItem
    );

}


// ======================================================
// UPDATE RATING SUMMARY
// ======================================================

function updateRatingSummary() {

    const averageRating =
        document.getElementById(
            "average-rating"
        );

    const reviewCount =
        document.getElementById(
            "review-count"
        );


    if (
        !averageRating ||
        !reviewCount
    ) {

        return;

    }


    const reviews =
        JSON.parse(
            localStorage.getItem(
                reviewStorageKey
            )
        ) || [];


    if (reviews.length === 0) {

        averageRating.textContent =
            "★★★★★ 0.0/5";

        reviewCount.textContent =
            "(0 Reviews)";

        return;

    }


    let totalRating = 0;


    reviews.forEach(
        function(review) {

            totalRating +=
                Number(
                    review.rating
                );

        }
    );


    const average =
        (
            totalRating /
            reviews.length
        ).toFixed(1);


    averageRating.textContent =
        "★★★★★ " +
        average +
        "/5";


    reviewCount.textContent =
        "(" +
        reviews.length +
        (
            reviews.length === 1
                ? " Review)"
                : " Reviews)"
        );

}


// ======================================================
// SUBMIT REVIEW
// ======================================================

const submitReviewButton =
    document.getElementById(
        "submit-review"
    );


if (submitReviewButton) {

    submitReviewButton.addEventListener(
        "click",
        function() {

            const reviewName =
                document.getElementById(
                    "review-name"
                ).value.trim();


            const reviewText =
                document.getElementById(
                    "review-text"
                ).value.trim();


            if (!reviewName) {

                alert(
                    "Please enter your name."
                );

                return;

            }


            if (!reviewText) {

                alert(
                    "Please write a review."
                );

                return;

            }


            const reviews =
                JSON.parse(
                    localStorage.getItem(
                        reviewStorageKey
                    )
                ) || [];


            const newReview = {

                name:
                    reviewName,

                rating:
                    selectedRating,

                text:
                    reviewText

            };


            reviews.push(
                newReview
            );


            localStorage.setItem(
                reviewStorageKey,
                JSON.stringify(
                    reviews
                )
            );


            displayReview(
                reviewName,
                selectedRating,
                reviewText
            );


            updateRatingSummary();


            document.getElementById(
                "review-name"
            ).value = "";


            document.getElementById(
                "review-text"
            ).value = "";


            alert(
                "Review submitted successfully!"
            );

        }
    );

}


// Load reviews when page opens
loadReviews();

updateRatingSummary();


// ======================================================
// RELATED PRODUCTS
// ======================================================

const relatedProducts = {

    "3": {

        id: "3",

        name: "Smartphone Pro",

        price: "₹25,000",

        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",

        category: "Electronics",

        description:
            "A powerful smartphone with modern features."

    },


    "4": {

        id: "4",

        name: "Wireless Headphones",

        price: "₹3,500",

        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",

        category: "Electronics",

        description:
            "Comfortable wireless headphones with clear sound."

    },


    "5": {

        id: "5",

        name: "Classic Cotton T-Shirt",

        price: "₹999",

        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",

        category: "Fashion",

        description:
            "Comfortable classic cotton t-shirt."

    }

};


// ======================================================
// OPEN RELATED PRODUCT
// ======================================================

function openRelatedProduct(productId) {

    const product =
        relatedProducts[productId];


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );


    window.location.href =
        "product-details.html";

}


// ======================================================
// ADD RELATED PRODUCT TO CART
// ======================================================

function addRelatedProductToCart(
    productId
) {

    const product =
        relatedProducts[productId];


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    let relatedCart =
        JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];


    relatedCart.push({

        id:
            product.id,

        name:
            product.name,

        price:
            product.price,

        image:
            product.image,

        category:
            product.category,

        description:
            product.description,

        quantity:
            1

    });


    localStorage.setItem(
        "cart",
        JSON.stringify(
            relatedCart
        )
    );


    cart =
        relatedCart;


    updateCartCount();


    alert(
        product.name +
        " added to cart!"
    );

}
// ======================================================
// MY ORDERS
// ======================================================

const ordersList = document.getElementById("orders-list");
const noOrders = document.getElementById("no-orders");

if (ordersList) {
    loadOrders();
}

async function loadOrders() {

    const token = localStorage.getItem("token");

    if (!token) {

        ordersList.innerHTML = `
            <p style="text-align:center;">
                Please login to view your orders.
            </p>
        `;

        if (noOrders) {
            noOrders.style.display = "none";
        }

        return;
    }

    try {

        const response = await fetch(
            "https://shopease-e-commerce-production.up.railway.app/orders",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load orders");
        }

        const orders = await response.json();

        ordersList.innerHTML = "";

        if (!orders || orders.length === 0) {

            if (noOrders) {
                noOrders.style.display = "block";
            }

            return;
        }

        if (noOrders) {
            noOrders.style.display = "none";
        }

        orders.forEach(function(order) {

            console.log("Order ID:", order.id, "Status:", order.status);

    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    const total = Number(order.totalAmount || 0);

    let itemsHTML = "";

    if (order.orderItems && order.orderItems.length > 0) {

        itemsHTML = order.orderItems.map(function(item) {

            const product = item.product || {};

            const quantity = Number(item.quantity || 1);
            const price = Number(item.price || 0);

            return `
                <div class="order-item">

                    <div class="order-item-info">

                        <strong>
                            ${product.name || "Product"}
                        </strong>

                        <span>
                            Quantity: ${quantity}
                        </span>

                    </div>

                    <div class="order-item-price">
                        ₹${price.toLocaleString("en-IN")}
                    </div>

                </div>
            `;

        }).join("");

    } else {

        itemsHTML = `
            <p class="no-order-items">
                No product details available.
            </p>
        `;
    }

    orderCard.innerHTML = `

        <div class="order-header">

            <div>

                <h3>
                    Order #${order.id}
                </h3>

                <p>
                    Date: ${order.orderDate || "N/A"}
                </p>

            </div>

            <span class="order-status">
                ${order.status || "PLACED"}
            </span>

        </div>


        <div class="order-details" style="display: none;">

            <p>
                <strong>Customer:</strong>
                ${order.customerName || "N/A"}
            </p>

            <p>
                <strong>Payment:</strong>
                ${
                    order.payment === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"
                }
            </p>

            <p>
                <strong>City:</strong>
                ${order.city || "N/A"}
            </p>

        </div>


        <div class="ordered-products">

            <h4>
                Ordered Products
            </h4>

            ${itemsHTML}

        </div>


     <div class="order-total">

    <strong>
        Total:
    </strong>

    <span>
        ₹${total.toLocaleString("en-IN")}
    </span>

</div>

<div class="order-actions">

    <button
        class="view-order-btn"
        onclick="toggleOrderDetails(this)"
    >
        View Details
    </button>

 ${
    String(order.status || "PLACED").toUpperCase() === "PLACED"
        ? `
            <button
                class="cancel-order-btn"
                onclick="cancelOrder(${order.id})"
            >
                Cancel Order
            </button>
          `
        : ""
}   

</div>

    `;

           ordersList.appendChild(orderCard);

        });

    } catch (error) {

        console.error(
            "Order History Error:",
            error
        );

        ordersList.innerHTML = `
            <p style="text-align:center; color:red;">
                Unable to load orders.
                Please make sure the backend is running.
            </p>
        `;
    }
} 
// ======================================================
// VIEW ORDER DETAILS
// ======================================================

function toggleOrderDetails(button) {

    const orderCard = button.closest(".order-card");

    const details = orderCard.querySelector(".order-details");

    if (!details) {
        return;
    }

    if (details.style.display === "none") {

        details.style.display = "block";

        button.textContent = "Hide Details";

    } else {

        details.style.display = "none";

        button.textContent = "View Details";
    }
}
// ======================================================
// CANCEL ORDER
// ======================================================

async function cancelOrder(orderId) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login to cancel your order.");
        return;
    }

    try {

        const response = await fetch(
            "https://shopease-e-commerce-production.up.railway.app/orders/" + orderId + "/cancel",
            {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to cancel order");
        }

        alert("Order cancelled successfully!");

        loadOrders();

    } catch (error) {

        console.error("Cancel Order Error:", error);

        alert(
            "Unable to cancel the order.\n\n" +
            "Please make sure the backend server is running."
        );
    }
}
// ======================================================
// LOGIN
// ======================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const loginMessage =
            document.getElementById("loginMessage");


        try {

            const response = await fetch(
                "https://shopease-e-commerce-production.up.railway.app/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok || !data.token) {

                loginMessage.textContent =
                    data.error || "Invalid email or password.";

                loginMessage.style.color = "red";

                return;
            }


            // Save JWT token

            localStorage.setItem(
                "token",
                data.token
            );


            loginMessage.textContent =
                "Login successful!";

            loginMessage.style.color = "green";


            // Go to homepage

            setTimeout(function() {

                window.location.href = "index.html";

            }, 500);


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            loginMessage.textContent =
                "Unable to connect to the backend server.";

            loginMessage.style.color = "red";

        }

    });

}