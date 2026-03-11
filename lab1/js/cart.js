const addButtons = document.querySelectorAll(".addCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

const cart = document.getElementById("cart");
const cartToggle = document.getElementById("cartToggle");

let items = JSON.parse(localStorage.getItem("cart")) || [];

const orderBtn = document.getElementById("orderBtn");
const modal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");
const orderForm = document.getElementById("orderForm");

orderBtn.addEventListener("click", () => {

    if (items.length === 0) {
        alert("Cart is empty");
        return;
    }

    modal.classList.add("open");

});

closeModal.addEventListener("click", () => {
    modal.classList.remove("open");
});

orderForm.addEventListener("submit", (e) => {

    e.preventDefault();

    alert("Order placed successfully!");

    items = [];
    renderCart();

    modal.classList.remove("open");

});

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(items));
}

function renderCart() {
    cartItems.innerHTML = "";

    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.name]) {
            grouped[item.name] = { name: item.name, price: item.price, count: 1 };
        } else {
            grouped[item.name].count++;
        }
    });

    let total = 0;

    for (let key in grouped) {
        const group = grouped[key];
        const itemTotal = group.count * group.price;

        const li = document.createElement("li");
        li.innerHTML = `
            ${group.name} (${group.count}) 
            <span>$${itemTotal}</span>
        `;
        cartItems.appendChild(li);

        total += itemTotal;
    }

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = items.length;
    saveCart();
}

addButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const name = btn.dataset.name;
        const price = btn.dataset.price;

        items.push({ name, price });

        renderCart();
    });

});

cartToggle.addEventListener("click", () => {
    cart.classList.toggle("open");
});

document.getElementById("clearCart").addEventListener("click", () => {

    items = [];

    renderCart();
});

renderCart();
