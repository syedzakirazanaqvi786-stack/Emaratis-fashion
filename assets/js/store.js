/**
 * EMARATIS FASHION - BOUTIQUE STORE ENGINE & STATE MANAGEMENT
 * Handles: Currency Switcher, Product Catalog, Lookbook Filter,
 * Cart Drawer, Wishlist Drawer, Quick View Modal, VIP Concierge, Audio.
 */

// Exchange rates relative to base USD
const EXCHANGE_RATES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)', prefix: '$', suffix: ' USD' },
  AED: { symbol: 'AED', rate: 3.6725, label: 'AED (د.إ)', prefix: '', suffix: ' AED' },
  PKR: { symbol: '₨', rate: 278.5, label: 'PKR (₨)', prefix: '₨ ', suffix: ' PKR' }
};

// Haute Couture Product Catalog
const PRODUCTS_CATALOG = [
  {
    id: 'ef-001',
    title: 'The Noor Crimson Lehenga',
    subtitle: 'Haute Couture Centerpiece',
    category: 'Silk Gowns',
    badge: 'HERO PIECE',
    priceUSD: 4850,
    primaryImage: 'assets/images/lookbook-crimson-front.jpg',
    secondaryImage: 'assets/images/lookbook-crimson-back.jpg',
    detailImage: 'assets/images/craft-bodice.jpg',
    leadTime: '6 to 8 Weeks Bespoke Handcrafting',
    composition: '100% Hand-Spun Mulberry Silk, Antique Bullion Zardozi, Hand-Cut Kundan Accents',
    description: 'Handcrafted from liquid mulberry silk, this iconic silhouette embodies timeless poise and quiet power. Tailored exclusively for modern sophistication with 380 hours of master artisan embroidery.',
    measurements: 'Custom made-to-measure according to client anatomical blueprint.'
  },
  {
    id: 'ef-002',
    title: 'The Emerald Sovereign Gown',
    subtitle: 'Royal Courtier Silhouette',
    category: 'Evening Wear',
    badge: 'LIMITED ATELIER',
    priceUSD: 5400,
    primaryImage: 'assets/images/couture-emerald.jpg',
    secondaryImage: 'assets/images/couture-emerald.jpg',
    detailImage: 'assets/images/craft-sleeve.jpg',
    leadTime: '8 to 10 Weeks Bespoke Handcrafting',
    composition: 'Archival Emerald Silk Velvet, 24k Gold Thread Filigree, Dabka & Kora Hand-Embroidery',
    description: 'Deep forest emerald silk velvet architectural gown featuring a sweeping imperial train encrusted with heirloom gold floral motifs.',
    measurements: 'Contoured bodice with flared structural train.'
  },
  {
    id: 'ef-003',
    title: 'The Midnight Noir Velvet Gown',
    subtitle: 'Red-Carpet Eveningwear',
    category: 'Evening Wear',
    badge: 'EDITORIAL EXCLUSIVE',
    priceUSD: 4650,
    primaryImage: 'assets/images/couture-noir.jpg',
    secondaryImage: 'assets/images/couture-noir.jpg',
    detailImage: 'assets/images/craft-back.jpg',
    leadTime: '6 Weeks Bespoke Handcrafting',
    composition: 'Pitch Black Sculpted Silk Satin, Hand-Pavé Champagne Micro-Beads, Structured Internal Corset',
    description: 'A striking noir silhouette engineered with architectural hip draping, deep plunge neckline, and glittering champagne micro-crystals that catch ambient light.',
    measurements: 'Built-in structural corset with custom waist cinching.'
  },
  {
    id: 'ef-004',
    title: 'The Imperial Ivory Cape Sari',
    subtitle: 'Ceremonial Draped Couture',
    category: 'Silk Gowns',
    badge: 'PRIVATE COMMISSIONS',
    priceUSD: 4950,
    primaryImage: 'assets/images/couture-ivory.jpg',
    secondaryImage: 'assets/images/couture-ivory.jpg',
    detailImage: 'assets/images/craft-hemline.jpg',
    leadTime: '7 Weeks Bespoke Handcrafting',
    composition: 'Pure Habotai Silk, Sheer Organza Cape, Resham & Antique Marori Gold Borders',
    description: 'Ethereal ivory draping harmonized with an imperial floor-grazing cape. Captures effortless fluid grace with heirloom artisan borders.',
    measurements: 'Fluid pre-pleated drape with adjustable waist bracket.'
  },
  {
    id: 'ef-005',
    title: 'The Sovereign Zardozi Bodice',
    subtitle: 'Artisanal Tailored Choli',
    category: 'Bespoke Cut',
    badge: 'MASTER CRAFT',
    priceUSD: 3850,
    primaryImage: 'assets/images/craft-bodice.jpg',
    secondaryImage: 'assets/images/craft-sleeve.jpg',
    detailImage: 'assets/images/craft-bodice.jpg',
    leadTime: '4 Weeks Bespoke Handcrafting',
    composition: 'Pure Silk Dupioni, Antique Gold Bullion Wire, Pearl Drops & Semi-Precious Inlays',
    description: 'Intricately embroidered structured bodice featuring archival Mughal-inspired scrollwork and hand-threaded hanging beads.',
    measurements: 'Individual contour blueprint with concealed side fasteners.'
  },
  {
    id: 'ef-006',
    title: 'The Architectural Flared Lehenga',
    subtitle: 'Heirloom Hand-Finished Hem',
    category: 'Bespoke Cut',
    badge: 'ARCHIVAL RELEASE',
    priceUSD: 4200,
    primaryImage: 'assets/images/craft-hemline.jpg',
    secondaryImage: 'assets/images/lookbook-crimson-side.jpg',
    detailImage: 'assets/images/craft-hemline.jpg',
    leadTime: '6 to 8 Weeks Bespoke Handcrafting',
    composition: 'Multi-layered Mulberry Silk, Reinforced Horsehair Hem, Graduated Antique Gold Panels',
    description: 'A masterpiece of volume and movement. Graduated embroidered urns and geometric borders float gracefully with every stride.',
    measurements: 'High-waist contoured waistband with hand-braided silk drawstrings.'
  }
];

class BoutiqueStore {
  constructor() {
    this.currentCurrency = localStorage.getItem('ef_currency') || 'PKR';
    this.cart = JSON.parse(localStorage.getItem('ef_cart') || '[]');
    this.wishlist = JSON.parse(localStorage.getItem('ef_wishlist') || '[]');
    this.activeFilter = 'All Designs';
    this.audioSynth = null;
    this.isAudioPlaying = false;

    this.init();
  }

  init() {
    this.bindCurrencySelector();
    this.renderLookbookGrid();
    this.bindLookbookFilters();
    this.bindCartDrawer();
    this.bindWishlistDrawer();
    this.bindQuickViewModal();
    this.bindBespokeModal();
    this.bindSearchModal();
    this.bindAudioToggle();
    this.updateAllPrices();
    this.updateCartCount();
    this.updateWishlistCount();
  }

  // Currency Converter Formatter
  formatPrice(priceUSD) {
    const config = EXCHANGE_RATES[this.currentCurrency] || EXCHANGE_RATES.USD;
    const converted = priceUSD * config.rate;

    // Round formatting
    let formattedNumber;
    if (this.currentCurrency === 'PKR') {
      formattedNumber = Math.round(converted).toLocaleString('en-US');
    } else if (this.currentCurrency === 'AED') {
      formattedNumber = Math.round(converted).toLocaleString('en-US');
    } else {
      formattedNumber = Math.round(converted).toLocaleString('en-US');
    }

    if (config.prefix && config.suffix) {
      return `${config.prefix}${formattedNumber}`;
    } else if (config.prefix) {
      return `${config.prefix}${formattedNumber}`;
    } else {
      return `${formattedNumber}${config.suffix}`;
    }
  }

  setCurrency(curr) {
    if (!EXCHANGE_RATES[curr]) return;
    this.currentCurrency = curr;
    localStorage.setItem('ef_currency', curr);
    this.updateAllPrices();
    this.renderCartItems();
    this.renderWishlistItems();
    this.showToast(`Currency updated to ${EXCHANGE_RATES[curr].label}`);
  }

  updateAllPrices() {
    // Update currency selector label in nav
    const activeLabel = document.getElementById('activeCurrencyLabel');
    if (activeLabel) {
      activeLabel.textContent = this.currentCurrency;
    }

    // Hero price
    const heroPriceEl = document.getElementById('heroProductPrice');
    if (heroPriceEl) {
      heroPriceEl.textContent = this.formatPrice(4850);
    }

    // Lookbook cards
    document.querySelectorAll('[data-product-price-usd]').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-product-price-usd'));
      el.textContent = this.formatPrice(usd);
    });

    // Subtotals in cart
    this.renderCartItems();
  }

  bindCurrencySelector() {
    const select = document.getElementById('currencySelect');
    if (select) {
      select.value = this.currentCurrency;
      select.addEventListener('change', (e) => {
        this.setCurrency(e.target.value);
      });
    }

    // Custom dropdown options if any
    document.querySelectorAll('[data-set-currency]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const curr = e.currentTarget.getAttribute('data-set-currency');
        this.setCurrency(curr);
      });
    });
  }

  // Lookbook Grid Rendering
  renderLookbookGrid() {
    const grid = document.getElementById('lookbookGrid');
    if (!grid) return;

    const filtered = this.activeFilter === 'All Designs'
      ? PRODUCTS_CATALOG
      : PRODUCTS_CATALOG.filter(p => p.category.toLowerCase().includes(this.activeFilter.toLowerCase()) || this.activeFilter.toLowerCase().includes(p.category.toLowerCase()));

    grid.innerHTML = filtered.map(item => {
      const inWishlist = this.wishlist.some(w => w.id === item.id);
      return `
        <div class="lookbook-card group relative flex flex-col bg-[#0E0E12] border border-[#2A2A30] rounded-sm overflow-hidden magnetic-hover" data-id="${item.id}">
          <!-- Image Showcase -->
          <div class="relative w-full aspect-[3/4] overflow-hidden bg-[#07070A] cursor-pointer" onclick="window.boutiqueStore.openQuickView('${item.id}')">
            <img 
              src="${item.primaryImage}" 
              alt="${item.title}" 
              class="lookbook-image-zoom w-full h-full object-cover object-center filter brightness-95 group-hover:brightness-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity"></div>
            
            <!-- Category Badge -->
            <span class="absolute top-4 left-4 text-[9.5px] uppercase tracking-[0.22em] px-2.5 py-1 bg-[#0A0A0C]/80 backdrop-blur-md border border-[#2A2A30] text-white/90">
              ${item.badge}
            </span>

            <!-- Wishlist Heart Button -->
            <button 
              type="button" 
              onclick="event.stopPropagation(); window.boutiqueStore.toggleWishlist('${item.id}')"
              class="wishlist-btn absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0A0A0C]/70 backdrop-blur-md border border-[#2A2A30] flex items-center justify-center text-white/80 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors interactive-bubble"
              title="Add to Wishlist"
            >
              <i class="${inWishlist ? 'fas fa-heart text-[#D4AF37]' : 'far fa-heart'} text-xs"></i>
            </button>

            <!-- Quick View Overlay on Hover -->
            <div class="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-4">
              <button 
                type="button"
                onclick="event.stopPropagation(); window.boutiqueStore.openQuickView('${item.id}')"
                class="w-full py-2.5 text-[10.5px] uppercase tracking-[0.22em] bg-[#0A0A0C]/90 backdrop-blur-md text-[#F4E095] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-black transition-colors interactive-bubble"
              >
                Inspect Silhouette
              </button>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-6 flex flex-col flex-1 justify-between bg-gradient-to-b from-[#0E0E12] to-[#08080B]">
            <div>
              <div class="text-[9.5px] uppercase tracking-[0.26em] text-[#D4AF37] mb-1 font-semibold">${item.category}</div>
              <h3 class="font-serif-luxury text-xl text-white font-medium group-hover:text-[#F4E095] transition-colors cursor-pointer" onclick="window.boutiqueStore.openQuickView('${item.id}')">
                ${item.title}
              </h3>
              <p class="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed font-light">
                ${item.description}
              </p>
            </div>

            <div class="pt-5 mt-4 border-t border-[#222226] flex items-center justify-between">
              <div>
                <span class="text-[9.5px] text-white/40 uppercase tracking-widest block">Atelier Value</span>
                <span class="font-cinzel text-base text-[#D4AF37] font-semibold" data-product-price-usd="${item.priceUSD}">
                  ${this.formatPrice(item.priceUSD)}
                </span>
              </div>
              <button 
                type="button" 
                onclick="window.boutiqueStore.addToCart('${item.id}')"
                class="px-4 py-2 text-[10px] uppercase tracking-[0.18em] border border-[#D4AF37]/50 text-white/90 hover:bg-[#D4AF37] hover:text-black transition-all interactive-bubble"
              >
                Reserve Piece
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  bindLookbookFilters() {
    document.querySelectorAll('[data-filter-category]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-filter-category]').forEach(b => {
          b.classList.remove('bg-[#D4AF37]', 'text-black', 'border-[#D4AF37]');
          b.classList.add('bg-transparent', 'text-white/70', 'border-white/15');
        });

        const target = e.currentTarget;
        target.classList.remove('bg-transparent', 'text-white/70', 'border-white/15');
        target.classList.add('bg-[#D4AF37]', 'text-black', 'border-[#D4AF37]');

        this.activeFilter = target.getAttribute('data-filter-category');
        this.renderLookbookGrid();
      });
    });
  }

  // Cart Management
  addToCart(productId, size = 'Bespoke Made-to-Measure') {
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(i => i.id === productId && i.size === size);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        priceUSD: product.priceUSD,
        image: product.primaryImage,
        size: size,
        quantity: 1
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.renderCartItems();
    this.openCartDrawer();
    this.showToast(`"${product.title}" added to your curated bag.`);
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartCount();
    this.renderCartItems();
  }

  updateQuantity(index, delta) {
    if (!this.cart[index]) return;
    this.cart[index].quantity += delta;
    if (this.cart[index].quantity <= 0) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
    this.updateCartCount();
    this.renderCartItems();
  }

  saveCart() {
    localStorage.setItem('ef_cart', JSON.stringify(this.cart));
  }

  updateCartCount() {
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });
  }

  renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotalAmount');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div class="py-16 text-center text-white/50">
          <i class="fas fa-shopping-bag text-3xl text-white/20 mb-4 block"></i>
          <p class="font-serif-luxury text-lg text-white/70">Your curated bag is empty.</p>
          <p class="text-xs text-white/40 mt-1 max-w-xs mx-auto">Discover iconic haute couture silhouettes from our capsule collection.</p>
          <button onclick="window.boutiqueStore.closeCartDrawer(); window.location.href='#collection'" class="mt-6 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
            Explore The Collection
          </button>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = this.formatPrice(0);
      return;
    }

    let subtotalUSD = 0;
    container.innerHTML = this.cart.map((item, idx) => {
      subtotalUSD += item.priceUSD * item.quantity;
      return `
        <div class="flex gap-4 p-4 border border-white/10 bg-[#0d0d0d] rounded-sm relative group">
          <img src="${item.image}" alt="${item.title}" class="w-20 h-24 object-cover object-top border border-white/10 flex-shrink-0" />
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start">
                <h4 class="font-serif-luxury text-sm text-white font-medium pr-4">${item.title}</h4>
                <button onclick="window.boutiqueStore.removeFromCart(${idx})" class="text-white/30 hover:text-rose-400 text-xs transition-colors">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
              <p class="text-[10px] text-[#D4AF37] tracking-wider mt-0.5">${item.size}</p>
            </div>
            <div class="flex justify-between items-center mt-3">
              <div class="flex items-center border border-white/20 rounded-sm">
                <button onclick="window.boutiqueStore.updateQuantity(${idx}, -1)" class="w-6 h-6 flex items-center justify-center text-xs text-white/60 hover:text-white">-</button>
                <span class="w-6 text-center text-xs text-white font-mono">${item.quantity}</span>
                <button onclick="window.boutiqueStore.updateQuantity(${idx}, 1)" class="w-6 h-6 flex items-center justify-center text-xs text-white/60 hover:text-white">+</button>
              </div>
              <span class="font-cinzel text-xs text-[#D4AF37] font-semibold">
                ${this.formatPrice(item.priceUSD * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (subtotalEl) {
      subtotalEl.textContent = this.formatPrice(subtotalUSD);
    }
  }

  bindCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const openBtns = document.querySelectorAll('[data-open-cart]');
    const closeBtns = document.querySelectorAll('[data-close-cart]');
    const backdrop = document.getElementById('cartDrawerBackdrop');

    openBtns.forEach(btn => btn.addEventListener('click', () => this.openCartDrawer()));
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeCartDrawer()));
    if (backdrop) backdrop.addEventListener('click', () => this.closeCartDrawer());

    // Checkout button - triggers full luxury checkout modal
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) return;
        this.closeCartDrawer();
        const first = this.cart[0];
        if (window.atelierAdmin) {
          window.atelierAdmin.openCheckoutModal(first.title, first.priceUSD);
        } else {
          const total = document.getElementById('cartSubtotalAmount')?.textContent || '';
          const itemList = this.cart.map(c => `• ${c.title} (${c.size}) x${c.quantity}`).join('%0A');
          const text = `Hello Emaratis Fashion Haute Couture Concierge,%0A%0AI would like to place a private order for the following curated pieces:%0A${itemList}%0A%0AEstimated Total: ${encodeURIComponent(total)}%0A%0APlease arrange my white-glove VIP concierge consultation.`;
          window.open(`https://wa.me/971500000000?text=${text}`, '_blank');
        }
      });
    }
  }

  openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const panel = document.getElementById('cartDrawerPanel');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (!drawer) return;
    drawer.classList.remove('hidden');
    setTimeout(() => {
      if (backdrop) backdrop.classList.remove('opacity-0');
      if (panel) panel.classList.remove('translate-x-full');
    }, 10);
    this.renderCartItems();
  }

  closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const panel = document.getElementById('cartDrawerPanel');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (!drawer) return;
    if (backdrop) backdrop.classList.add('opacity-0');
    if (panel) panel.classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 350);
  }

  // Wishlist Management
  toggleWishlist(productId) {
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;

    const existingIdx = this.wishlist.findIndex(w => w.id === productId);
    if (existingIdx > -1) {
      this.wishlist.splice(existingIdx, 1);
      this.showToast(`Removed "${product.title}" from Wishlist.`);
    } else {
      this.wishlist.push(product);
      this.showToast(`Saved "${product.title}" to Wishlist.`);
    }

    localStorage.setItem('ef_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistCount();
    this.renderLookbookGrid();
    this.renderWishlistItems();
  }

  updateWishlistCount() {
    const count = this.wishlist.length;
    document.querySelectorAll('.wishlist-count-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  renderWishlistItems() {
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;

    if (this.wishlist.length === 0) {
      container.innerHTML = `
        <div class="py-16 text-center text-white/50">
          <i class="far fa-heart text-3xl text-white/20 mb-4 block"></i>
          <p class="font-serif-luxury text-lg text-white/70">Your wishlist is empty.</p>
          <p class="text-xs text-white/40 mt-1 max-w-xs mx-auto">Tap the heart on any piece to save it for your private fittings.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.wishlist.map(item => `
      <div class="flex gap-4 p-4 border border-white/10 bg-[#0d0d0d] rounded-sm relative group">
        <img src="${item.primaryImage}" alt="${item.title}" class="w-20 h-24 object-cover object-top border border-white/10 flex-shrink-0" />
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <h4 class="font-serif-luxury text-sm text-white font-medium pr-4">${item.title}</h4>
              <button onclick="window.boutiqueStore.toggleWishlist('${item.id}')" class="text-white/40 hover:text-rose-400 text-xs">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <p class="text-[10px] text-[#D4AF37] tracking-wider mt-0.5">${item.category}</p>
          </div>
          <div class="flex justify-between items-center mt-3">
            <span class="font-cinzel text-xs text-[#D4AF37] font-semibold">
              ${this.formatPrice(item.priceUSD)}
            </span>
            <button 
              onclick="window.boutiqueStore.addToCart('${item.id}'); window.boutiqueStore.toggleWishlist('${item.id}')"
              class="px-3 py-1 text-[9px] uppercase tracking-wider bg-[#D4AF37] text-black font-semibold hover:bg-[#F4E095] transition-colors"
            >
              Move to Bag
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  bindWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const openBtns = document.querySelectorAll('[data-open-wishlist]');
    const closeBtns = document.querySelectorAll('[data-close-wishlist]');
    const backdrop = document.getElementById('wishlistDrawerBackdrop');

    openBtns.forEach(btn => btn.addEventListener('click', () => this.openWishlistDrawer()));
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeWishlistDrawer()));
    if (backdrop) backdrop.addEventListener('click', () => this.closeWishlistDrawer());
  }

  openWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const panel = document.getElementById('wishlistDrawerPanel');
    const backdrop = document.getElementById('wishlistDrawerBackdrop');
    if (!drawer) return;
    drawer.classList.remove('hidden');
    setTimeout(() => {
      if (backdrop) backdrop.classList.remove('opacity-0');
      if (panel) panel.classList.remove('translate-x-full');
    }, 10);
    this.renderWishlistItems();
  }

  closeWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const panel = document.getElementById('wishlistDrawerPanel');
    const backdrop = document.getElementById('wishlistDrawerBackdrop');
    if (!drawer) return;
    if (backdrop) backdrop.classList.add('opacity-0');
    if (panel) panel.classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 350);
  }

  // Quick View Modal
  openQuickView(productId) {
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    document.getElementById('qvTitle').textContent = product.title;
    document.getElementById('qvSubtitle').textContent = product.subtitle;
    document.getElementById('qvCategory').textContent = product.category;
    document.getElementById('qvPrice').textContent = this.formatPrice(product.priceUSD);
    document.getElementById('qvPrice').setAttribute('data-product-price-usd', product.priceUSD);
    document.getElementById('qvDescription').textContent = product.description;
    document.getElementById('qvComposition').textContent = product.composition;
    document.getElementById('qvLeadTime').textContent = product.leadTime;
    document.getElementById('qvImage').src = product.primaryImage;
    document.getElementById('qvDetailImage').src = product.detailImage;

    // Set active product for add to bag button
    const qvAddBtn = document.getElementById('qvAddToCartBtn');
    if (qvAddBtn) {
      qvAddBtn.onclick = () => {
        const selectedSize = document.querySelector('input[name="qvSize"]:checked')?.value || 'Bespoke Custom';
        this.addToCart(product.id, selectedSize);
        this.closeQuickView();
      };
    }

    const qvBespokeBtn = document.getElementById('qvBespokeBtn');
    if (qvBespokeBtn) {
      qvBespokeBtn.onclick = () => {
        this.closeQuickView();
        this.openBespokeModal(product.title);
      };
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
    }, 10);
  }

  closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }

  bindQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    const closeBtns = document.querySelectorAll('[data-close-quickview]');
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeQuickView()));
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeQuickView();
      });
    }
  }

  // Bespoke Order & Consultation Modal
  openBespokeModal(presetSilhouette = '') {
    const modal = document.getElementById('bespokeModal');
    if (!modal) return;

    const select = document.getElementById('bespokeSilhouetteSelect');
    if (select && presetSilhouette) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.includes(presetSilhouette) || select.options[i].value === presetSilhouette) {
          select.selectedIndex = i;
          break;
        }
      }
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
    }, 10);
  }

  closeBespokeModal() {
    const modal = document.getElementById('bespokeModal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }

  bindBespokeModal() {
    const modal = document.getElementById('bespokeModal');
    const openBtns = document.querySelectorAll('[data-open-bespoke]');
    const closeBtns = document.querySelectorAll('[data-close-bespoke]');

    openBtns.forEach(b => b.addEventListener('click', () => {
      const silhouette = b.getAttribute('data-silhouette') || '';
      this.openBespokeModal(silhouette);
    }));

    closeBtns.forEach(b => b.addEventListener('click', () => this.closeBespokeModal()));
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeBespokeModal();
      });
    }

    // Form submission
    const form = document.getElementById('bespokeForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('clientName')?.value || 'Valued Client';
        const silhouette = document.getElementById('bespokeSilhouetteSelect')?.value || 'Haute Couture Silhouette';
        const phone = document.getElementById('clientPhone')?.value || '';
        const notes = document.getElementById('clientNotes')?.value || 'No special instructions.';

        this.closeBespokeModal();
        this.showToast(`Inquiry received, ${name}. Our Master Couturier will contact you via WhatsApp shortly.`);

        // Also offer instant WhatsApp redirection
        const text = `Hello Emaratis Fashion VIP Concierge,%0A%0AMy name is ${encodeURIComponent(name)}.%0AI wish to commission a bespoke piece: ${encodeURIComponent(silhouette)}.%0AContact: ${encodeURIComponent(phone)}%0ANotes: ${encodeURIComponent(notes)}`;
        setTimeout(() => {
          window.open(`https://wa.me/971500000000?text=${text}`, '_blank');
        }, 1200);
      });
    }
  }

  // Search Modal
  bindSearchModal() {
    const modal = document.getElementById('searchModal');
    const openBtns = document.querySelectorAll('[data-open-search]');
    const closeBtns = document.querySelectorAll('[data-close-search]');
    const input = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResultsContainer');

    openBtns.forEach(b => b.addEventListener('click', () => {
      if (!modal) return;
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        if (input) input.focus();
      }, 10);
    }));

    closeBtns.forEach(b => b.addEventListener('click', () => {
      if (!modal) return;
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    }));

    if (input && resultsContainer) {
      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          resultsContainer.innerHTML = '<p class="text-xs text-white/40 py-6 text-center">Type silhouette name, fabric, or category (e.g. "Crimson", "Silk", "Noir")...</p>';
          return;
        }

        const matches = PRODUCTS_CATALOG.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.composition.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          resultsContainer.innerHTML = '<p class="text-xs text-white/40 py-6 text-center">No bespoke pieces matched your query. Please contact VIP Concierge for custom commissions.</p>';
          return;
        }

        resultsContainer.innerHTML = matches.map(item => `
          <div class="flex items-center justify-between p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors" onclick="window.boutiqueStore.openQuickView('${item.id}'); document.querySelector('[data-close-search]').click();">
            <div class="flex items-center gap-3">
              <img src="${item.primaryImage}" class="w-12 h-14 object-cover object-top border border-white/10" />
              <div>
                <h5 class="font-serif-luxury text-sm text-white">${item.title}</h5>
                <span class="text-[10px] text-[#D4AF37]">${item.category}</span>
              </div>
            </div>
            <span class="font-cinzel text-xs text-[#D4AF37]">${this.formatPrice(item.priceUSD)}</span>
          </div>
        `).join('');
      });
    }
  }

  // Audio Runway Ambient Soundscape (Synthesized with Web Audio API)
  bindAudioToggle() {
    const btn = document.getElementById('ambientAudioBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      this.toggleAudio();
    });
  }

  toggleAudio() {
    const btn = document.getElementById('ambientAudioBtn');
    const icon = btn?.querySelector('i');
    const label = btn?.querySelector('.audio-label');

    if (this.isAudioPlaying) {
      this.stopAudio();
      this.isAudioPlaying = false;
      if (icon) icon.className = 'fas fa-volume-mute text-xs';
      if (label) label.textContent = 'Runway Audio: OFF';
      this.showToast('Runway ambiance silenced.');
    } else {
      this.startAudio();
      this.isAudioPlaying = true;
      if (icon) icon.className = 'fas fa-volume-up text-xs text-[#D4AF37]';
      if (label) label.textContent = 'Runway Audio: ON';
      this.showToast('Runway Haute Couture soundscape activated.');
    }
  }

  startAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Generate a warm, ethereal cinematic drone chord (C minor 9 / meditative fashion ambiance)
      const now = this.audioCtx.currentTime;
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.06, now + 3);
      this.masterGain.connect(this.audioCtx.destination);

      // Low pass filter to create velvet-smooth analog warmth
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.connect(this.masterGain);

      // Frequencies for a royal, mysterious luxury chord: C2 (65.41Hz), G2 (98.00Hz), Eb3 (155.56Hz), Bb3 (233.08Hz), D4 (293.66Hz)
      const freqs = [65.41, 98.0, 155.56, 233.08];
      this.oscillators = freqs.map((f, i) => {
        const osc = this.audioCtx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        // Slight detune for lush spatial chorus
        osc.detune.setValueAtTime((i - 1.5) * 4, now);

        const oscGain = this.audioCtx.createGain();
        oscGain.gain.setValueAtTime(0.25, now);
        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start();
        return osc;
      });
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  }

  stopAudio() {
    if (this.masterGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      setTimeout(() => {
        if (this.oscillators) {
          this.oscillators.forEach(osc => osc.stop());
          this.oscillators = null;
        }
      }, 1250);
    }
  }

  // Toast Notification System
  showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3800);
  }
}

// Global accessor
window.BoutiqueStore = BoutiqueStore;
