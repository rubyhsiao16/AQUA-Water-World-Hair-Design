/* AQUA 水世界 Hair Salon - Core JavaScript Logic */

// Initialize Application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initAccessibility();
  initPortfolio();
  initMap();
});

/* ==========================================================================
   HEADER & MOBILE MENU LOGIC
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy to highlight current nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href && href.startsWith('#') && href.slice(1) === current) {
        item.classList.add('active');
      }
    });
  });
}

function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open');
}

function closeMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
}

/* ==========================================================================
   ACCESSIBILITY CONTROL PANEL LOGIC
   ========================================================================== */
function initAccessibility() {
  const contrastToggle = document.getElementById('contrastToggle');
  
  // Load saved accessibility settings from localStorage
  const savedContrast = localStorage.getItem('aqua-accessibility-contrast') === 'true';
  const savedFontScale = localStorage.getItem('aqua-accessibility-fontscale') || '1';
  
  // Set contrast state
  if (savedContrast) {
    document.body.classList.add('high-contrast');
    if (contrastToggle) contrastToggle.checked = true;
  }
  
  // Set font scale state
  document.documentElement.style.setProperty('--font-scale', savedFontScale);
  
  // Set active class on corresponding font button
  let activeBtnId = 'font-normal';
  if (savedFontScale === '1.2') activeBtnId = 'font-large';
  if (savedFontScale === '1.4') activeBtnId = 'font-xlarge';
  
  document.querySelectorAll('.font-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) activeBtn.classList.add('active');
}

function toggleAccessPanel(isOpen) {
  const panel = document.getElementById('accessPanel');
  const backdrop = document.getElementById('accessBackdrop');
  if (isOpen) {
    panel.classList.add('open');
    backdrop.classList.add('open');
    panel.focus();
  } else {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
  }
}

function setFontScale(scale, buttonId) {
  document.documentElement.style.setProperty('--font-scale', scale);
  localStorage.setItem('aqua-accessibility-fontscale', scale);
  
  document.querySelectorAll('.font-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(buttonId).classList.add('active');
}

function toggleHighContrast(isHighContrast) {
  if (isHighContrast) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
  localStorage.setItem('aqua-accessibility-contrast', isHighContrast);
}

/* ==========================================================================
   PORTFOLIO FILTER LOGIC
   ========================================================================== */
function initPortfolio() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active states on filter buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          // Simple visual fade in
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   INTERACTIVE MAP INITIALIZATION (Leaflet)
   ========================================================================== */
function initMap() {
  try {
    // Coordinate location for AQUA (Hsinchu - Jianzhong Road 57)
    const position = [24.7865, 120.9934];
    
    // Create Leaflet map centered at position
    const map = L.map('mapCanvas', {
      scrollWheelZoom: false // Disable mouse scroll zoom for accessibility / user experience
    }).setView(position, 16);

    // Beautiful cyan/water matching tile theme from CartoDB Positron
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(map);

    // Custom map icon styled nicely
    const salonIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          width: 40px; 
          height: 40px; 
          background: linear-gradient(135deg, var(--primary), var(--accent)); 
          border: 3px solid #fff; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg) translate(2px, -2px);
          box-shadow: 0 4px 10px rgba(15,23,42,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <i class="fa-solid fa-scissors" style="
            transform: rotate(45deg); 
            color: #fff; 
            font-size: 1.1rem;
          "></i>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    // Add marker with styled popup info window
    L.marker(position, { icon: salonIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: var(--font-body); padding: 5px;">
          <h4 style="color: var(--secondary); font-family: var(--font-display); margin-bottom: 5px; font-weight: 700;">AQUA 水世界</h4>
          <p style="font-size: 0.85rem; color: var(--text-light); margin: 0 0 5px 0;">300 新竹市東區武功里建中路 57 號</p>
          <a href="https://maps.app.goo.gl/Xipao7XydprMicqN7?g_st=ic" target="_blank" style="color: var(--primary); font-weight: 600; font-size: 0.8rem; text-decoration: underline;">在 Google 地圖中開啟</a>
        </div>
      `)
      .openPopup();
  } catch (error) {
    console.error('Leaflet Map Initialization failed: ', error);
    // Render static visual map grid fallback if Leaflet CDN fails or is offline
    document.getElementById('mapCanvas').innerHTML = `
      <div style="
        width: 100%; 
        height: 100%; 
        background: linear-gradient(135deg, rgba(14,165,233,0.1), rgba(45,212,191,0.1));
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 40px;
      ">
        <i class="fa-solid fa-map-location-dot" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px;"></i>
        <h4 style="font-family: var(--font-display); margin-bottom: 8px;">AQUA 水世界 營業地點</h4>
        <p style="color: var(--text-light); font-size: 0.9rem; max-width: 320px; margin-bottom: 20px;">
          300 新竹市東區武功里建中路 57 號
        </p>
        <a href="https://maps.app.goo.gl/Xipao7XydprMicqN7?g_st=ic" target="_blank" class="btn btn-primary">
          <i class="fa-solid fa-location-arrow"></i> 開啟 Google 地圖導航
        </a>
      </div>
    `;
  }
}
