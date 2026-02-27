// ── DATA ──
    const productDetails = [
      { id: 1, name: "AirPods Pro", price: 24900, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTJiKtlpQGkIeOyAPV3qQMNkl8uuRzfGWZtIDb_WgDnam8WjhpL&usqp=CAU", qty: 10, heading: "Wireless Noise Cancelling", des: "AirPods Pro deliver Active Noise Cancellation for immersive sound. Transparency mode so you can hear your surroundings." },
      { id: 2, name: "Apple Watch", price: 40900, imageUrl: "https://purepng.com/public/uploads/large/apple-watch-pcq.png", qty: 15, heading: "Never seen a watch like this", des: "The most advanced Apple Watch yet, featuring the Always-On Retina display, ECG app, and fall detection." },
      { id: 3, name: "MacBook Pro", price: 199900, imageUrl: "https://pngimg.com/uploads/macbook/macbook_PNG8.png", qty: 20, heading: "The best for the brightest", des: "Designed for those who defy limits. The new MacBook Pro is by far the most powerful notebook we've ever made." },
      { id: 4, name: "iPhone 11 Pro", price: 106600, imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-midnight-green-select-2019?wid=940&hei=1112&fmt=png-alpha&qlt=80&.v=1566954990073", qty: 35, heading: "Pro cameras. Pro display.", des: "A mind-blowing chip that doubles down on machine learning. Welcome to the first iPhone powerful enough to be called Pro." },
      { id: 5, name: "iPad Pro", price: 71900, imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202003_FMT_WHH?wid=940&hei=1112&fmt=png-alpha&qlt=80&.v=1583553704156", qty: 25, heading: "Your next computer is not a computer", des: "It's a magical piece of glass. So fast most PC laptops can't catch up. Use it with touch, pencil, or trackpad." }
    ];

    // ── STATE (V1 Logic paradigm) ──
    let cart = []; 
    const fmtPrice = n => `₹ ${n.toLocaleString('en-IN')}`;

    // ── RENDER ENGINE ──
    function renderApp() {
      document.getElementById('app').innerHTML = `
        <div class="banner">
          <ul class="box-area">${'<li></li>'.repeat(6)}</ul>
          
          <div class="nav">
            <div class="brand">Rex</div>
            <button class="cart-trigger" onclick="toggleSideNav(true)">
              <i class="fas fa-shopping-cart"></i>
              <span class="total-qty" id="cartBadge">0</span>
            </button>
          </div>

          <div class="main-cart" id="productGrid">${renderGrid()}</div>
          
          <div class="cover" id="mainCover" onclick="toggleSideNav(false)"></div>
          <div class="cover" id="modalCover" style="z-index:390;"></div>
          
          <div class="side-nav" id="sideNav">
            <div class="side-nav-header">
              <h2>Cart</h2>
              <button onclick="toggleSideNav(false)"><i class="fas fa-times"></i></button>
            </div>
            <div class="cart-items" id="cartItemsList"></div>
            <div class="final">
              <div class="final-total">
                <span>Total:</span>
                <span id="cartTotal">₹ 0</span>
              </div>
              <div class="action">
                <button onclick="openCheckout()" class="btn buy">Purchase <i class="fas fa-credit-card"></i></button>
                <button onclick="clearCart()" class="btn clear">Clear <i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>

          <div class="modal-wrap" id="modalWrap"></div>
          <div class="toast-wrap" id="toastWrap"></div>
        </div>
      `;
      updateUI();
    }

    function renderGrid() {
      return productDetails.map(p => {
        const stockClass = p.qty === 0 ? 'out' : p.qty <= 5 ? 'low' : '';
        const stockText = p.qty === 0 ? 'Out of Stock' : p.qty <= 5 ? `Only ${p.qty} Left` : 'In Stock';
        const overlay = p.qty === 0 ? `<div class="out-of-stock-cover" style="display:flex;"><span>SOLD OUT</span></div>` : '';

        return `
          <div class="card" id="card_${p.id}">
            <div class="top-bar">
              <i class="fab fa-apple"></i>
              <em class="stocks ${stockClass}" id="stockTag_${p.id}">${stockText}</em>
            </div>
            <div class="img-container">
              <img src="${p.imageUrl}" alt="${p.name}" />
              ${overlay}
            </div>
            <div class="details">
              <div class="name-fav">
                <strong>${p.name}</strong>
                <button onclick="this.classList.toggle('active')" class="heart"><i class="fas fa-heart"></i></button>
              </div>
              <div class="wrapper">
                <h5>${p.heading}</h5>
                <p>${p.des}</p>
              </div>
              <div class="purchase">
                <p>${fmtPrice(p.price)}</p>
                <div id="btnWrap_${p.id}">${renderActionBtn(p.id)}</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderActionBtn(id) {
      const inCart = cart.find(i => i.id === id);
      const product = productDetails.find(p => p.id === id);
      if (product.qty === 0 && !inCart) return '';
      
      if (inCart) {
        return `
          <div class="qty-change">
            <button class="btn-qty" onclick="changeQty(${id}, -1)"><i class="fas fa-minus" style="color:black; font-size:10px;"></i></button>
            <span class="qty-val">${inCart.qty}</span>
            <button class="btn-qty" onclick="changeQty(${id}, 1)"><i class="fas fa-plus" style="color:black; font-size:10px;"></i></button>
          </div>
        `;
      }
      return `<button class="add-btn" onclick="addItem(${id})">Add <i class="fas fa-chevron-right"></i></button>`;
    }

    // ── STATE UPDATERS (V1 Polish) ──
    function updateUI() {
      // Update Grid Buttons & Stocks dynamically
      productDetails.forEach(p => {
        const wrap = document.getElementById(`btnWrap_${p.id}`);
        if(wrap) wrap.innerHTML = renderActionBtn(p.id);
      });

      // Update Cart List
      const list = document.getElementById('cartItemsList');
      if (cart.length === 0) {
        list.innerHTML = `<div class="empty-cart">Looks like you haven't added anything yet.</div>`;
      } else {
        list.innerHTML = cart.map(item => `
          <div class="cart-item">
            <img src="${item.imgSrc}" alt="${item.name}" />
            <div class="cart-item-info">
              <strong>${item.name}</strong>
              <span>${fmtPrice(item.price * item.qty)}</span>
            </div>
            <div class="qty-change" style="margin-right:10px;">
              <button class="btn-qty" onclick="changeQty(${item.id}, -1)"><i class="fas fa-minus" style="color:black; font-size:10px;"></i></button>
              <span class="qty-val">${item.qty}</span>
              <button class="btn-qty" onclick="changeQty(${item.id}, 1)"><i class="fas fa-plus" style="color:black; font-size:10px;"></i></button>
            </div>
            <button onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
          </div>
        `).join('');
      }

      // Totals
      const totalQty = cart.reduce((s, i) => s + i.qty, 0);
      const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);
      document.getElementById('cartBadge').textContent = totalQty;
      document.getElementById('cartTotal').textContent = fmtPrice(totalPrice);
    }

    // ── CART ACTIONS ──
    function addItem(id) {
      const product = productDetails.find(p => p.id === id);
      if (!product || product.qty === 0) return;
      cart.push({ id, name: product.name, price: product.price, imgSrc: product.imageUrl, qty: 1 });
      updateUI();
    }

    function removeItem(id) {
      cart = cart.filter(i => i.id !== id);
      updateUI();
    }

    function changeQty(id, delta) {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      const newQty = item.qty + delta;
      
      if (delta > 0 && item.qty >= 10) {
        showToast('Limit reached — max 10 per product.', 'warning');
        return;
      }
      if (newQty < 1) {
        removeItem(id);
        return;
      }
      item.qty = newQty;
      updateUI();
    }

    function clearCart() {
      cart = [];
      updateUI();
    }

    // ── UI CONTROLS ──
    function toggleSideNav(show) {
      document.getElementById('sideNav').classList.toggle('open', show);
      document.getElementById('mainCover').style.display = show ? 'block' : 'none';
    }

    // ── CHECKOUT (V1 Modal Polish) ──
    function openCheckout() {
      if (cart.length === 0) {
        showToast('Add some items to cart first!', 'info');
        return;
      }
      toggleSideNav(false);
      const wrap = document.getElementById('modalWrap');
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      
      const rows = cart.map(i => `
        <div class="invoice-row">
          <span>${i.qty} x ${i.name}</span>
          <span>${fmtPrice(i.price * i.qty)}</span>
        </div>
      `).join('');

      wrap.innerHTML = `
        <div class="invoice">
          <div class="invoice-title">Order Summary</div>
          <div>${rows}</div>
          <div class="invoice-total">
            <span>Total Pay:</span>
            <span>${fmtPrice(total)}</span>
          </div>
          <div class="invoice-actions">
            <button class="btn-confirm" onclick="placeOrder()">Order Now</button>
            <button class="btn-cancel" onclick="closeCheckout()">Cancel</button>
          </div>
        </div>
      `;
      wrap.classList.add('open');
      document.getElementById('modalCover').style.display = 'block';
    }

    function closeCheckout() {
      document.getElementById('modalWrap').classList.remove('open');
      document.getElementById('modalCover').style.display = 'none';
    }

    function placeOrder() {
      // Deduct stock globally
      cart.forEach(item => {
        const product = productDetails.find(p => p.id === item.id);
        if (product) product.qty -= item.qty;
      });
      
      clearCart();
      const orderId = Math.floor(Math.random() * 90000) + 10000;
      const wrap = document.getElementById('modalWrap');
      
      wrap.innerHTML = `
        <div class="invoice" style="text-align: center;">
          <i class="fas fa-check-circle" style="font-size: 3rem; color: #5ce0a8; margin-bottom: 10px;"></i>
          <div class="invoice-title" style="border:none;">Order Placed!</div>
          <p style="color:#ccc; font-size:0.9rem; line-height:1.5;">Your order <strong>#${orderId}</strong> has been confirmed.<br>Estimated delivery: 3-5 working days.</p>
          <button class="btn-confirm" style="margin-top:20px; padding:12px; border-radius:10px; width:100%;" onclick="finishOrder()">Continue Shopping</button>
        </div>
      `;
    }

    function finishOrder() {
      closeCheckout();
      // Completely re-render the grid to apply new Out Of Stock overlays if needed
      document.getElementById('productGrid').innerHTML = renderGrid();
      updateUI(); 
    }

    // ── TOASTS ──
    function showToast(msg, type = 'info') {
      const wrap = document.getElementById('toastWrap');
      const icon = type === 'warning' ? 'exclamation-triangle' : 'info-circle';
      const color = type === 'warning' ? 'orange' : '#5cb8e0';
      
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = `<i class="fas fa-${icon}" style="color:${color}"></i> <span style="font-weight:500; font-size:0.9rem;">${msg}</span>`;
      
      wrap.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = '0.3s';
        setTimeout(() => el.remove(), 300);
      }, 3000);
    }

    // ── BOOT ──
    renderApp();