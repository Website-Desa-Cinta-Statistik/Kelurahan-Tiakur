// Tiakur Village Website - Core JS Application

// Fallback site data in case fetching site_data.json fails (e.g., local run or initial repo state)
const FALLBACK_DATA = {
  "admin": {
    "code_hash": "f1cd356cd58776dbecddaff28278b5df3ad2a90ac37759f696f9d5e6699cd082" // SHA-256 for "tiakur123"
  },
  "profil": {
    "sejarah": "Kelurahan Tiakur merupakan pusat administrasi dan ibukota dari Kabupaten Maluku Barat Daya, Provinsi Maluku. Resmi ditetapkan sebagai ibukota berdasarkan Undang-Undang Republik Indonesia Nomor 31 Tahun 2008, Tiakur berkembang pesat menjadi pusat roda pemerintahan, perekonomian, dan kebudayaan di wilayah perbatasan selatan Indonesia. Terletak di Pulau Moa, Kelurahan Tiakur menyajikan keindahan alam sabana yang khas dipadukan dengan pesisir pantai berpasir putih. Semangat kekeluargaan dan persaudaraan masyarakat Tiakur disatukan dalam falsafah hidup adat 'Kalwedo' yang menjunjung tinggi toleransi, kebersamaan, dan perdamaian.",
    "visi": "Terwujudnya Kelurahan Tiakur sebagai pusat pelayanan publik yang prima, mandiri, unggul, dan berbudaya berbasis potensi lokal demi kesejahteraan masyarakat yang berkeadilan.",
    "misi": [
      "Meningkatkan kualitas pelayanan administrasi kelurahan secara cepat, akurat, transparan, dan berbasis teknologi informasi.",
      "Mengembangkan ekonomi kreatif dan memberdayakan masyarakat kelurahan berbasis potensi kelautan, pertanian sabana, dan perdagangan lokal.",
      "Membangun infrastruktur sarana dan prasarana lingkungan pemukiman yang sehat, tertata, dan ramah lingkungan.",
      "Memelihara nilai-nilai adat, budaya, dan kerukunan beragama masyarakat dalam bingkai persaudaraan 'Kalwedo'."
    ]
  },
  "aparatur": [
    { "id": 1, "nama": "Ronal Marcus, S.STP", "jabatan": "Lurah Tiakur", "avatar_color": "#005f73" },
    { "id": 2, "nama": "Helena Frans, S.Sos", "jabatan": "Sekretaris Kelurahan", "avatar_color": "#0077b6" },
    { "id": 3, "nama": "Jhonny Letelay, A.Md", "jabatan": "Kasi Pemerintahan & Ketertiban Umum", "avatar_color": "#0a9396" },
    { "id": 4, "nama": "Maria O. Keliwulan, S.E", "jabatan": "Kasi Kesejahteraan Rakyat & Pelayanan", "avatar_color": "#f4a261" }
  ],
  "transparansi_anggaran": {
    "tahun": "-",
    "pendapatan": [],
    "belanja": []
  },
  "statistik": {
    "total_penduduk": 4825,
    "total_keluarga": 1240,
    "jenis_kelamin": {
      "Laki-laki": 2450,
      "Perempuan": 2375
    },
    "pekerjaan": {
      "PNS / TNI / Polri": 520,
      "Pegawai Swasta / BUMN": 680,
      "Petani / Peternak": 1250,
      "Nelayan": 840,
      "Pedagang / Wiraswasta": 415,
      "Belum / Tidak Bekerja": 1120
    },
    "agama": {
      "Kristen Protestan": 3650,
      "Katolik": 680,
      "Islam": 450,
      "Hindu": 30,
      "Buddha": 15
    },
    "status_perkawinan": {
      "Belum Kawin": 1980,
      "Kawin": 2560,
      "Cerai Hidup": 185,
      "Cerai Mati": 100
    },
    "fasilitas_pendidikan": {
      "Taman Kanak-Kanak (TK)": 4,
      "Sekolah Dasar (SD)": 6,
      "Sekolah Menengah Pertama (SMP)": 3,
      "Sekolah Menengah Atas (SMA)": 2,
      "Perguruan Tinggi": 1
    },
    "fasilitas_kesehatan": {
      "Rumah Sakit": 1,
      "Puskesmas": 1,
      "Puskesmas Pembantu (Pustu)": 3,
      "Poliklinik": 1,
      "Poskesdes": 2,
      "Polindes": 1,
      "Tempat Praktik Dokter": 2,
      "Tempat Praktik Bidan": 4,
      "Apotek": 3
    }
  }
};

// Application State
let appData = null;
let currentCharts = {}; // Keeps track of active Chart.js instances to avoid canvas collision
let activeAdminTab = 'admin-tab-profil';

// Palette Colors for Charts
const chartColors = {
  greenForest: ['#005f73', '#0a9396', '#94d2bd', '#e9c46a', '#f4a261', '#e76f51'], // Beach themed
  blueOcean: ['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef', '#ade8f4'],
  goldAmber: ['#e9c46a', '#f4a261', '#f8c471', '#f9e79f', '#fcf3cf'],
  mixedGov: ['#005f73', '#0077b6', '#e9c46a', '#0a9396', '#00b4d8', '#f4a261', '#64748b']
};

// Utility: Format currency to IDR
function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Utility: Hash admin code with SHA-256
async function hashAdminCode(code) {
  const msgBuffer = new TextEncoder().encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  // Mobile Hamburger Toggle
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Header background change on scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Load website data
  await loadData();

  // Setup routing
  window.addEventListener('hashchange', router);
  router(); // Run on load
});

// Load Site Data from JSON or fallback
async function loadData() {
  try {
    const response = await fetch('data/site_data.json');
    if (!response.ok) throw new Error('Data file not found or corrupted.');
    appData = await response.json();
  } catch (error) {
    console.warn('Unable to load server site data, using local fallback state.', error);
    appData = JSON.parse(JSON.stringify(FALLBACK_DATA)); // Deep clone
  }
}

// SPA Router
function router() {
  const hash = window.location.hash || '#/beranda';
  
  // Highlight active link in header
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Destroy old charts to clean up memory
  Object.keys(currentCharts).forEach(key => {
    if (currentCharts[key]) {
      currentCharts[key].destroy();
      delete currentCharts[key];
    }
  });

  // Render view
  const root = document.getElementById('main-viewport');
  
  if (hash === '#/beranda') {
    renderBeranda(root);
  } else if (hash === '#/profil') {
    renderProfil(root);
  } else if (hash === '#/transparansi') {
    renderTransparansi(root);
  } else if (hash === '#/statistik') {
    renderStatistik(root);
  } else if (hash === '#/admin') {
    renderAdmin(root);
  } else {
    // 404 - Redirect to Beranda
    window.location.hash = '#/beranda';
  }

  // Scroll to top on page change
  window.scrollTo(0, 0);
}

// Counter Roller Animation
function animateCounter(elementId, targetValue, duration = 1200) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * targetValue);
    element.textContent = currentValue.toLocaleString('id-ID');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = targetValue.toLocaleString('id-ID');
    }
  };
  window.requestAnimationFrame(step);
}

// --- RENDER VIEWPORTS ---

// 1. Beranda
function renderBeranda(container) {
  container.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <span class="hero-tag">Kabupaten Maluku Barat Daya</span>
        <h1 class="hero-title">Selamat Datang di Portal Resmi<br><span>Kelurahan Tiakur</span></h1>
        <p class="hero-desc">Pusat pemerintahan dan pelayanan publik yang ramah, transparan, dan terpercaya di Bumi Kalwedo.</p>
        <div class="hero-buttons">
          <a href="#/statistik" class="btn btn-primary">Lihat Statistik Desa</a>
          <a href="#/profil" class="btn btn-secondary">Pelajari Profil Desa</a>
        </div>
      </div>
    </section>

    <section class="quick-stats">
      <div class="quick-stats-grid">
        <div class="stat-card">
          <div class="stat-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-number" id="home-stat-penduduk">0</div>
          <div class="stat-label">Total Penduduk</div>
        </div>
        
        <div class="stat-card stat-green">
          <div class="stat-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="stat-number" id="home-stat-keluarga">0</div>
          <div class="stat-label">Jumlah Keluarga</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
          </div>
          <div class="stat-number" id="home-stat-laki">0</div>
          <div class="stat-label">Laki-Laki</div>
        </div>

        <div class="stat-card stat-gold">
          <div class="stat-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z"/><path d="M8 12h8"/></svg>
          </div>
          <div class="stat-number" id="home-stat-perempuan">0</div>
          <div class="stat-label">Perempuan</div>
        </div>
      </div>
    </section>

    <section class="section-container">
      <div class="welcome-section">
        <div class="welcome-text">
          <h2>Selamat Datang di Kelurahan Tiakur</h2>
          <p>Kelurahan Tiakur senantiasa berupaya memberikan informasi publik yang informatif, transparan, dan akuntabel kepada segenap masyarakat. Kami berkomitmen untuk mendayagunakan kemajuan teknologi informasi demi kelancaran administrasi desa dan mempererat persatuan masyarakat.</p>
          <div class="welcome-quote">
            "Menghidupkan kebersamaan dan kekeluargaan dalam semangat adat Kalwedo demi kemajuan kota Tiakur."
          </div>
          <p>Motto Kalwedo adalah jiwa dari masyarakat kami yang senantiasa membawa perdamaian, saling mendukung, dan memelihara keharmonisan di tengah keanekaragaman suku dan kepercayaan.</p>
        </div>
        <div class="welcome-image-container">
          <div class="welcome-img-card">
            <!-- Custom stylized illustration placeholder / default nature image -->
            <img src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=600&q=80" alt="Landscape Moa Tiakur">
            <div class="img-overlay-badge">
              <span>Capital City Of</span>
              Maluku Barat Daya
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Animate numbers
  animateCounter('home-stat-penduduk', appData.statistik.total_penduduk);
  animateCounter('home-stat-keluarga', appData.statistik.total_keluarga);
  animateCounter('home-stat-laki', appData.statistik.jenis_kelamin['Laki-laki'] || 0);
  animateCounter('home-stat-perempuan', appData.statistik.jenis_kelamin['Perempuan'] || 0);
}

// 2. Profil Desa
function renderProfil(container) {
  // Render missions bullet points
  const missionsHTML = appData.profil.misi.map(misi => `<li>${misi}</li>`).join('');

  // Render apparatus profile cards
  const apparatusHTML = appData.aparatur.map(staff => {
    // Generate simple initials for avatar fallback
    const initials = staff.nama.split(',')[0].split(' ').map(n => n[0]).join('').substring(0, 2);
    return `
      <div class="aparatur-card">
        <div class="aparatur-avatar" style="background-color: ${staff.avatar_color || '#005f73'}">
          ${initials}
        </div>
        <h4 class="aparatur-nama">${staff.nama}</h4>
        <p class="aparatur-jabatan">${staff.jabatan}</p>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="section-container">
      <div class="section-title-wrapper">
        <h1 class="section-title">Profil Kelurahan</h1>
        <p class="section-subtitle">Mengenal sejarah, nilai dasar kepemimpinan, visi misi, dan jajaran kepengurusan Kelurahan Tiakur.</p>
      </div>

      <div class="history-card">
        <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--primary-forest);">Sejarah Singkat</h3>
        <p class="history-text">${appData.profil.sejarah}</p>
      </div>

      <div class="visi-misi-container">
        <div class="vision-card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-ocean)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Visi Kelurahan
          </h3>
          <div class="vision-content">
            "${appData.profil.visi}"
          </div>
        </div>
        
        <div class="mission-card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-forest)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Misi Kelurahan
          </h3>
          <ul class="mission-list">
            ${missionsHTML}
          </ul>
        </div>
      </div>

      <div class="section-title-wrapper" style="margin-top: 5rem; margin-bottom: 3rem;">
        <h2 class="section-title" style="font-size: 1.75rem;">Aparatur Kelurahan</h2>
        <p class="section-subtitle">Dedikasi jajaran perangkat Kelurahan Tiakur untuk melayani kebutuhan administratif dan sosial masyarakat.</p>
      </div>

      <div class="aparatur-grid">
        ${apparatusHTML}
      </div>
    </div>
  `;
}

// 3. Transparansi & APBDes
function renderTransparansi(container) {
  // Calculate Totals
  const totalPendapatan = appData.transparansi_anggaran.pendapatan.reduce((sum, item) => sum + item.jumlah, 0);
  const totalBelanja = appData.transparansi_anggaran.belanja.reduce((sum, item) => sum + item.jumlah, 0);

  // Render Income list
  const pendapatanRows = appData.transparansi_anggaran.pendapatan.map(item => `
    <tr>
      <td>${item.sumber}</td>
      <td class="col-amount">${formatRupiah(item.jumlah)}</td>
    </tr>
  `).join('');

  // Render Expense list
  const belanjaRows = appData.transparansi_anggaran.belanja.map(item => `
    <tr>
      <td>${item.bidang}</td>
      <td class="col-amount">${formatRupiah(item.jumlah)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="section-container">
      <div class="section-title-wrapper">
        <h1 class="section-title">Transparansi Anggaran</h1>
        <p class="section-subtitle">Realisasi Anggaran Pendapatan dan Belanja (APB) Kelurahan Tiakur Tahun Anggaran ${appData.transparansi_anggaran.tahun}.</p>
      </div>

      <div class="budget-overview">
        <div class="budget-chart-container">
          <canvas id="budgetChart"></canvas>
        </div>

        <div class="budget-summary-box">
          <div class="summary-card">
            <div class="summary-title">Total Pendapatan Kelurahan</div>
            <div class="summary-amount">${formatRupiah(totalPendapatan)}</div>
          </div>
          
          <div class="summary-card expense">
            <div class="summary-title">Total Belanja Kelurahan</div>
            <div class="summary-amount">${formatRupiah(totalBelanja)}</div>
          </div>
        </div>
      </div>

      <div class="budget-tables-grid">
        <div class="table-card">
          <h3>Rincian Pendapatan</h3>
          <div class="table-container">
            <table class="budget-table">
              <thead>
                <tr>
                  <th>Sumber Pendapatan</th>
                  <th style="text-align: right;">Jumlah (Rupiah)</th>
                </tr>
              </thead>
              <tbody>
                ${pendapatanRows}
                <tr style="font-weight: 700; background: rgba(0, 119, 182, 0.05);">
                  <td>TOTAL PENDAPATAN</td>
                  <td class="col-amount" style="color: var(--primary-ocean);">${formatRupiah(totalPendapatan)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-card">
          <h3>Rincian Pembelanjaan</h3>
          <div class="table-container">
            <table class="budget-table">
              <thead>
                <tr>
                  <th>Bidang Pembiayaan</th>
                  <th style="text-align: right;">Jumlah (Rupiah)</th>
                </tr>
              </thead>
              <tbody>
                ${belanjaRows}
                <tr style="font-weight: 700; background: rgba(230, 57, 70, 0.05);">
                  <td>TOTAL BELANJA</td>
                  <td class="col-amount" style="color: var(--danger);">${formatRupiah(totalBelanja)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render APBDes Chart
  const ctx = document.getElementById('budgetChart').getContext('2d');
  currentCharts['budget'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pendapatan', 'Belanja'],
      datasets: [{
        label: 'Anggaran Kelurahan (Rupiah)',
        data: [totalPendapatan, totalBelanja],
        backgroundColor: ['#2ec4b6', '#e63946'],
        borderRadius: 8,
        barThickness: 50
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return formatRupiah(context.raw);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatRupiah(value).replace('Rp', '');
            }
          }
        }
      }
    }
  });
}

// Helper to generate a clean HTML table for statistics
function generateStatsTable(dataObj, totalVal, showPercentage = true) {
  let rows = '';
  Object.keys(dataObj).forEach(key => {
    const val = dataObj[key];
    const percentage = totalVal > 0 ? ((val / totalVal) * 100).toFixed(1) + '%' : '0%';
    rows += `
      <tr>
        <td style="font-weight: 600; color: var(--text-dark);">${key}</td>
        <td class="col-amount" style="text-align: right;">${val.toLocaleString('id-ID')}</td>
        ${showPercentage ? `<td class="col-amount" style="text-align: right; color: var(--primary-ocean); font-weight: 600;">${percentage}</td>` : ''}
      </tr>
    `;
  });
  return `
    <div class="table-container" style="margin-top: 1rem;">
      <table class="budget-table">
        <thead>
          <tr>
            <th>Kategori</th>
            <th style="text-align: right;">Jumlah</th>
            ${showPercentage ? '<th style="text-align: right;">Persentase</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="font-weight: 700; background: rgba(0, 95, 115, 0.05);">
            <td>TOTAL</td>
            <td style="text-align: right;">${totalVal.toLocaleString('id-ID')}</td>
            ${showPercentage ? '<td style="text-align: right; color: var(--primary-forest);">100%</td>' : ''}
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// Function to generate and download Excel sheet for public users
function downloadExcelReport() {
  if (!window.XLSX) {
    alert("Maaf, pustaka Excel (SheetJS) belum dimuat. Silakan periksa koneksi internet Anda.");
    return;
  }

  const wb = XLSX.utils.book_new();
  const sheetData = [];

  // Title info
  sheetData.push(["LAPORAN DATA STATISTIK RESMI KELURAHAN TIAKUR"]);
  sheetData.push(["Kecamatan Moa, Kabupaten Maluku Barat Daya, Provinsi Maluku"]);
  sheetData.push([`Tanggal Diunduh: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`]);
  sheetData.push([]); // Spacer

  // Helper to calculate sum
  const getSum = obj => Object.values(obj).reduce((a, b) => a + b, 0);

  // 1. Ringkasan Kependudukan
  sheetData.push(["I. RINGKASAN KEPENDUDUKAN UMUM"]);
  sheetData.push(["Indikator Demografi", "Jumlah", "Satuan"]);
  sheetData.push(["Total Jumlah Penduduk", appData.statistik.total_penduduk, "Jiwa"]);
  sheetData.push(["Total Kepala Keluarga (KK)", appData.statistik.total_keluarga, "Keluarga"]);
  sheetData.push([]);

  // 2. Gender
  sheetData.push(["II. DATA PENDUDUK BERDASARKAN JENIS KELAMIN"]);
  sheetData.push(["Jenis Kelamin", "Jumlah (Jiwa)", "Persentase"]);
  const totalGender = getSum(appData.statistik.jenis_kelamin);
  Object.keys(appData.statistik.jenis_kelamin).forEach(k => {
    const val = appData.statistik.jenis_kelamin[k];
    const pct = totalGender > 0 ? ((val / totalGender) * 100).toFixed(1) + "%" : "0%";
    sheetData.push([k, val, pct]);
  });
  sheetData.push(["TOTAL GENDER", totalGender, "100%"]);
  sheetData.push([]);

  // 3. Pekerjaan
  sheetData.push(["III. DATA PENDUDUK BERDASARKAN STATUS PEKERJAAN"]);
  sheetData.push(["Status Pekerjaan", "Jumlah (Jiwa)", "Persentase"]);
  const totalJobs = getSum(appData.statistik.pekerjaan);
  Object.keys(appData.statistik.pekerjaan).forEach(k => {
    const val = appData.statistik.pekerjaan[k];
    const pct = totalJobs > 0 ? ((val / totalJobs) * 100).toFixed(1) + "%" : "0%";
    sheetData.push([k, val, pct]);
  });
  sheetData.push(["TOTAL PEKERJAAN", totalJobs, "100%"]);
  sheetData.push([]);

  // 4. Status Perkawinan
  sheetData.push(["IV. DATA PENDUDUK BERDASARKAN STATUS PERKAWINAN"]);
  sheetData.push(["Status Perkawinan", "Jumlah (Jiwa)", "Persentase"]);
  const totalMarital = getSum(appData.statistik.status_perkawinan);
  Object.keys(appData.statistik.status_perkawinan).forEach(k => {
    const val = appData.statistik.status_perkawinan[k];
    const pct = totalMarital > 0 ? ((val / totalMarital) * 100).toFixed(1) + "%" : "0%";
    sheetData.push([k, val, pct]);
  });
  sheetData.push(["TOTAL STATUS PERKAWINAN", totalMarital, "100%"]);
  sheetData.push([]);

  // 5. Agama
  sheetData.push(["V. DATA PENDUDUK BERDASARKAN AGAMA"]);
  sheetData.push(["Agama", "Jumlah (Jiwa)", "Persentase"]);
  const totalReligion = getSum(appData.statistik.agama);
  Object.keys(appData.statistik.agama).forEach(k => {
    const val = appData.statistik.agama[k];
    const pct = totalReligion > 0 ? ((val / totalReligion) * 100).toFixed(1) + "%" : "0%";
    sheetData.push([k, val, pct]);
  });
  sheetData.push(["TOTAL AGAMA", totalReligion, "100%"]);
  sheetData.push([]);

  // 6. Fasilitas Pendidikan
  if (appData.statistik.fasilitas_pendidikan) {
    sheetData.push(["VI. DATA SARANA PRASARANA PENDIDIKAN"]);
    sheetData.push(["Tingkat Pendidikan", "Jumlah Unit", "Persentase"]);
    const totalEdu = getSum(appData.statistik.fasilitas_pendidikan);
    Object.keys(appData.statistik.fasilitas_pendidikan).forEach(k => {
      const val = appData.statistik.fasilitas_pendidikan[k];
      const pct = totalEdu > 0 ? ((val / totalEdu) * 100).toFixed(1) + "%" : "0%";
      sheetData.push([k, val, pct]);
    });
    sheetData.push(["TOTAL UNIT PENDIDIKAN", totalEdu, "100%"]);
    sheetData.push([]);
  }

  // 7. Fasilitas Kesehatan (No percentages)
  if (appData.statistik.fasilitas_kesehatan) {
    sheetData.push(["VII. DATA SARANA PRASARANA KESEHATAN"]);
    sheetData.push(["Jenis Fasilitas Kesehatan", "Jumlah Unit", "Satuan"]);
    Object.keys(appData.statistik.fasilitas_kesehatan).forEach(k => {
      const val = appData.statistik.fasilitas_kesehatan[k];
      sheetData.push([k, val, "Unit"]);
    });
    sheetData.push(["TOTAL UNIT KESEHATAN", getSum(appData.statistik.fasilitas_kesehatan), "Unit"]);
    sheetData.push([]);
  }

  // Generate sheet
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Set nice styling column width
  const max_cols = sheetData.reduce((w, r) => Math.max(w, r.length), 0);
  const wscols = [];
  for (let i = 0; i < max_cols; i++) {
    wscols.push({ wch: 35 }); // Width of 35 characters
  }
  ws['!cols'] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, "Statistik Tiakur");
  XLSX.writeFile(wb, "Laporan_Statistik_Kelurahan_Tiakur.xlsx");
}

// 4. Statistik (Fokus Utama)
function renderStatistik(container) {
  container.innerHTML = `
    <div class="statistik-page-wrapper">
      <div class="section-container">
      <div class="section-title-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <h1 class="section-title">Demografi & Data Statistik</h1>
        <p class="section-subtitle">Visualisasi terperinci mengenai kependudukan, sarana prasarana, agama, dan data profil warga Kelurahan Tiakur.</p>
        <button id="btn-download-public-excel" class="btn btn-primary" style="margin-top: 1rem; background: linear-gradient(135deg, #2ec4b6, #2d6a4f); box-shadow: 0 4px 15px rgba(46, 196, 182, 0.3); font-size: 0.95rem; padding: 0.7rem 1.8rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Unduh Laporan Excel (.xlsx)
        </button>
      </div>

      <div class="stats-highlight-row">
        <div class="stats-card-main">
          <div class="stats-main-info">
            <h3>Jumlah Penduduk Tiakur</h3>
            <div class="stats-main-num" id="stat-total-p">0</div>
            <div class="stats-main-desc">Jiwa terdaftar secara administratif</div>
          </div>
          <div class="stats-main-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>

        <div class="stats-card-main blue-theme">
          <div class="stats-main-info">
            <h3>Jumlah Kepala Keluarga</h3>
            <div class="stats-main-num" id="stat-total-kk">0</div>
            <div class="stats-main-desc">Kepala keluarga terdata secara sah</div>
          </div>
          <div class="stats-main-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>
      </div>

      <div class="stats-charts-grid">
        <!-- 1. Gender -->
        <div class="chart-card">
          <div class="chart-card-header" style="background: linear-gradient(135deg, #ade8f4, #90e0ef); padding: 1.5rem; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md) var(--radius-md) 0 0; margin: -2rem -2rem 1.5rem -2rem; color: var(--primary-ocean);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3>Jumlah dan persentase penduduk berdasarkan jenis kelamin</h3>
          <div class="chart-box" style="height: 250px; margin-bottom: 1.5rem;">
            <canvas id="genderChart"></canvas>
          </div>
          <div id="genderTableContainer"></div>
        </div>

        <!-- 2. Marital Status -->
        <div class="chart-card">
          <div class="chart-card-header" style="background: linear-gradient(135deg, #d8f3dc, #b7e4c7); padding: 1.5rem; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md) var(--radius-md) 0 0; margin: -2rem -2rem 1.5rem -2rem; color: var(--primary-forest);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h3>Jumlah dan persentase penduduk berdasarkan status perkawinan</h3>
          <div class="chart-box" style="height: 250px; margin-bottom: 1.5rem;">
            <canvas id="maritalChart"></canvas>
          </div>
          <div id="maritalTableContainer"></div>
        </div>

        <!-- 3. Jobs -->
        <div class="chart-card" style="grid-column: span 2;">
          <div class="chart-card-header" style="background: linear-gradient(135deg, #e2d1f9, #c8b6ff); padding: 1.5rem; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md) var(--radius-md) 0 0; margin: -2rem -2rem 1.5rem -2rem; color: #5e548e;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h3>Jumlah dan persentase penduduk berdasarkan pekerjaan</h3>
          <div class="chart-table-flex">
            <div class="chart-box" style="height: 320px;">
              <canvas id="jobChart"></canvas>
            </div>
            <div id="jobTableContainer"></div>
          </div>
        </div>

        <!-- 4. Religion -->
        <div class="chart-card" style="grid-column: span 2;">
          <div class="chart-card-header" style="background: linear-gradient(135deg, #fdf0d5, #fddcbb); padding: 1.5rem; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md) var(--radius-md) 0 0; margin: -2rem -2rem 1.5rem -2rem; color: #780000;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h3>jumlah dan persentase penduduk berdasarkan Agama</h3>
          <div class="chart-table-flex">
            <div class="chart-box" style="height: 320px;">
              <canvas id="religionChart"></canvas>
            </div>
            <div id="religionTableContainer"></div>
          </div>
        </div>

        <!-- 5. Fasilitas Pendidikan -->
        <div class="chart-card" style="grid-column: span 2;">
          <div class="chart-card-header" style="background: linear-gradient(135deg, #ffedd5, #fed7aa); padding: 1.5rem; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md) var(--radius-md) 0 0; margin: -2rem -2rem 1.5rem -2rem; color: #ea580c;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
          </div>
          <h3>Jumlah dan Persentase Fasilitas Pendidikan : TK,SD, SMP, SMA dan Perguruan Tinggi</h3>
          <div class="chart-table-flex">
            <div class="chart-box" style="height: 280px;">
              <canvas id="educationChart"></canvas>
            </div>
            <div id="educationTableContainer"></div>
          </div>
        </div>

        <!-- 6. Fasilitas Kesehatan -->
        <div class="chart-card" style="grid-column: span 2;">
          <div class="chart-card-header" style="background: linear-gradient(135deg, #fee2e2, #fecaca); padding: 1.5rem; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md) var(--radius-md) 0 0; margin: -2rem -2rem 1.5rem -2rem; color: #dc2626;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="13" rx="2" ry="2"/><path d="M12 5V9M5 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M12 12v6M9 15h6"/></svg>
          </div>
          <h3>Jumlah fasilitas Kesehatan</h3>
          <div class="chart-table-flex">
            <div class="chart-box" style="height: 380px;">
              <canvas id="healthChart"></canvas>
            </div>
            <div id="healthTableContainer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // Animate dynamic highlights
  animateCounter('stat-total-p', appData.statistik.total_penduduk);
  animateCounter('stat-total-kk', appData.statistik.total_keluarga);

  // Render Charts
  renderStatCharts();

  // Attach Excel Download click listener
  document.getElementById('btn-download-public-excel').addEventListener('click', downloadExcelReport);
}

function renderStatCharts() {
  const data = appData.statistik;

  // Helper to calculate total of object values
  const getSum = obj => Object.values(obj).reduce((a, b) => a + b, 0);

  const totalGender = getSum(data.jenis_kelamin);
  const totalMarital = getSum(data.status_perkawinan);
  const totalJobs = getSum(data.pekerjaan);
  const totalReligion = getSum(data.agama);
  const totalEducation = getSum(data.fasilitas_pendidikan || {});
  const totalHealth = getSum(data.fasilitas_kesehatan || {});

  // Inject Tables
  document.getElementById('genderTableContainer').innerHTML = generateStatsTable(data.jenis_kelamin, totalGender);
  document.getElementById('maritalTableContainer').innerHTML = generateStatsTable(data.status_perkawinan, totalMarital);
  document.getElementById('jobTableContainer').innerHTML = generateStatsTable(data.pekerjaan, totalJobs);
  document.getElementById('religionTableContainer').innerHTML = generateStatsTable(data.agama, totalReligion);
  
  if (data.fasilitas_pendidikan) {
    document.getElementById('educationTableContainer').innerHTML = generateStatsTable(data.fasilitas_pendidikan, totalEducation, true);
  }
  if (data.fasilitas_kesehatan) {
    document.getElementById('healthTableContainer').innerHTML = generateStatsTable(data.fasilitas_kesehatan, totalHealth, false);
  }

  // Custom plugin to draw leader lines with horizontal tick pointers
  const doughnutLeaderLinesPlugin = {
    id: 'doughnutLeaderLines',
    afterDraw(chart) {
      const { ctx } = chart;
      ctx.save();
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (meta.hidden) return;
        meta.data.forEach((element, index) => {
          const { x, y, startAngle, endAngle, outerRadius } = element;
          const value = dataset.data[index];
          if (!value || value === 0) return;
          
          const midAngle = startAngle + (endAngle - startAngle) / 2;
          const startX = x + Math.cos(midAngle) * outerRadius;
          const startY = y + Math.sin(midAngle) * outerRadius;
          const endX = x + Math.cos(midAngle) * (outerRadius + 12);
          const endY = y + Math.sin(midAngle) * (outerRadius + 12);
          
          const isRightSide = Math.cos(midAngle) > 0;
          const bendX = endX + (isRightSide ? 8 : -8);
          
          ctx.strokeStyle = '#005f73';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.lineTo(bendX, endY);
          ctx.stroke();
        });
      });
      ctx.restore();
    }
  };

  // High Quality Beach-Themed Colors (Teal, Aqua, Warm Sand, Coral, Sunset Gold)
  const genderColors = ['#0081a7', '#f07167']; // Deep Ocean Teal vs Vibrant Coral Pink
  const maritalColors = ['#00afb9', '#0077b6', '#fdf0d5', '#f07167']; // Aqua, Ocean Blue, Warm Sand, Coral Red
  const jobColors = ['#005f73', '#0a9396', '#94d2bd', '#e9c46a', '#f4a261', '#e76f51']; // Ocean Teal/Sand/Sunset spectrum
  const religionColors = ['#005f73', '#0081a7', '#00afb9', '#fdf0d5', '#f07167']; 
  const educationColors = ['#00afb9', '#fdf0d5', '#f07167', '#0077b6', '#005f73'];
  const healthColors = ['#f07167', '#f19c79', '#f4b26f', '#f7c59f', '#fed9b7', '#a8dadc', '#457b9d', '#1d3557', '#005f73'];

  // Chart 1: Gender (Doughnut)
  const genderCtx = document.getElementById('genderChart').getContext('2d');
  currentCharts['gender'] = new Chart(genderCtx, {
    type: 'doughnut',
    plugins: [ChartDataLabels, doughnutLeaderLinesPlugin],
    data: {
      labels: Object.keys(data.jenis_kelamin),
      datasets: [{
        data: Object.values(data.jenis_kelamin),
        backgroundColor: genderColors,
        borderColor: '#ffffff',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 35,
          bottom: 35,
          left: 80,
          right: 80
        }
      },
      plugins: {
        legend: { display: false }, // Hide legend to prevent overlap at the bottom
        datalabels: {
          anchor: 'end',
          align: 'end',
          offset: 14,
          color: '#005f73',
          font: { weight: 'bold', size: 9 },
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            const percentage = totalGender > 0 ? ((value * 100) / totalGender).toFixed(1) + "%" : "0%";
            return `${label}: ${value.toLocaleString('id-ID')} (${percentage})`;
          },
          textAlign: 'center'
        }
      }
    }
  });

  // Chart 2: Marital Status (Doughnut)
  const maritalCtx = document.getElementById('maritalChart').getContext('2d');
  currentCharts['marital'] = new Chart(maritalCtx, {
    type: 'doughnut',
    plugins: [ChartDataLabels, doughnutLeaderLinesPlugin],
    data: {
      labels: Object.keys(data.status_perkawinan),
      datasets: [{
        data: Object.values(data.status_perkawinan),
        backgroundColor: maritalColors,
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      rotation: 90, // Rotate chart so small segments move to the side
      layout: {
        padding: {
          top: 35,
          bottom: 35,
          left: 80,
          right: 80
        }
      },
      plugins: {
        legend: { display: false }, // Hide legend to prevent overlap at the bottom
        datalabels: {
          anchor: 'end',
          align: 'end',
          offset: 14,
          color: '#005f73',
          font: { weight: 'bold', size: 9 },
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            const percentage = totalMarital > 0 ? ((value * 100) / totalMarital).toFixed(1) + "%" : "0%";
            return `${label}: ${value.toLocaleString('id-ID')} (${percentage})`;
          },
          textAlign: 'center'
        }
      }
    }
  });

  // Chart 3: Jobs (Horizontal Bar Chart)
  const jobCtx = document.getElementById('jobChart').getContext('2d');
  currentCharts['job'] = new Chart(jobCtx, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
      labels: Object.keys(data.pekerjaan),
      datasets: [{
        data: Object.values(data.pekerjaan),
        backgroundColor: jobColors,
        borderRadius: 6,
        barThickness: 20
      }]
    },
    options: {
      indexAxis: 'y', // Makes it horizontal
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: '#1e293b',
          font: { weight: 'bold', size: 10 },
          formatter: (value) => {
            const percentage = totalJobs > 0 ? ((value * 100) / totalJobs).toFixed(1) + "%" : "0%";
            return `${value.toLocaleString('id-ID')} (${percentage})`;
          }
        }
      },
      scales: {
        x: { beginAtZero: true, grid: { display: false } }
      }
    }
  });

  // Chart 4: Religion (Vertical Bar Chart)
  const religionCtx = document.getElementById('religionChart').getContext('2d');
  currentCharts['religion'] = new Chart(religionCtx, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
      labels: Object.keys(data.agama),
      datasets: [{
        data: Object.values(data.agama),
        backgroundColor: religionColors,
        borderRadius: 8,
        barThickness: 35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#1e293b',
          font: { weight: 'bold', size: 10 },
          formatter: (value) => {
            const percentage = totalReligion > 0 ? ((value * 100) / totalReligion).toFixed(1) + "%" : "0%";
            return `${value.toLocaleString('id-ID')}\n(${percentage})`;
          },
          textAlign: 'center'
        }
      },
      scales: {
        y: { beginAtZero: true, grid: { display: false } }
      }
    }
  });

  // Chart 5: Education Facilities (Doughnut Chart)
  if (data.fasilitas_pendidikan) {
    const eduCtx = document.getElementById('educationChart').getContext('2d');
    currentCharts['education'] = new Chart(eduCtx, {
      type: 'doughnut',
      plugins: [ChartDataLabels, doughnutLeaderLinesPlugin],
      data: {
        labels: Object.keys(data.fasilitas_pendidikan),
        datasets: [{
          data: Object.values(data.fasilitas_pendidikan),
          backgroundColor: educationColors,
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 35,
            bottom: 35,
            left: 80,
            right: 80
          }
        },
        plugins: {
          legend: { display: false }, // Hide legend to prevent overlap at the bottom
          datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 14,
            color: '#005f73',
            font: { weight: 'bold', size: 9 },
            formatter: (value, ctx) => {
              const label = ctx.chart.data.labels[ctx.dataIndex];
              const percentage = totalEducation > 0 ? ((value * 100) / totalEducation).toFixed(1) + "%" : "0%";
              return `${label}: ${value} Unit (${percentage})`;
            },
            textAlign: 'center'
          }
        }
      }
    });
  }

  // Chart 6: Health Facilities (Horizontal Bar Chart, NO PERCENTAGES)
  if (data.fasilitas_kesehatan) {
    const healthCtx = document.getElementById('healthChart').getContext('2d');
    currentCharts['health'] = new Chart(healthCtx, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        labels: Object.keys(data.fasilitas_kesehatan),
        datasets: [{
          data: Object.values(data.fasilitas_kesehatan),
          backgroundColor: healthColors,
          borderRadius: 6,
          barThickness: 16
        }]
      },
      options: {
        indexAxis: 'y', // Horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#1e293b',
            font: { weight: 'bold', size: 10 },
            formatter: (value) => {
              return `${value} Unit`; // Just the count, e.g. "1 Unit"
            }
          }
        },
        scales: {
          x: { beginAtZero: true, grid: { display: false } }
        }
      }
    });
  }
}

// 5. Admin Panel (Control Center)
function renderAdmin(container) {
  const isLogged = sessionStorage.getItem('tiakur_admin_logged') === 'true';

  if (!isLogged) {
    renderAdminLogin(container);
  } else {
    renderAdminDashboard(container);
  }
}

// Admin Login Form
function renderAdminLogin(container) {
  container.innerHTML = `
    <div class="section-container">
      <div class="admin-login-container">
        <div class="admin-login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2>Pintu Masuk Admin</h2>
        <p>Gunakan Kode Unik Kelurahan untuk masuk dan mengelola konten serta data statistik kependudukan.</p>
        
        <form id="admin-login-form">
          <div class="form-group">
            <label for="admin-passcode">Kode Unik Administrator</label>
            <input type="password" id="admin-passcode" class="form-input" placeholder="Masukkan kode unik..." required autocomplete="off">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Masuk Dashboard</button>
        </form>
        <p style="margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-muted);">Default Code: <strong>tiakur123</strong></p>
      </div>
    </div>
  `;

  // Attach login listener
  const form = document.getElementById('admin-login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputCode = document.getElementById('admin-passcode').value;
    const inputHash = await hashAdminCode(inputCode);
    const targetHash = appData.admin.code_hash;

    if (inputHash === targetHash) {
      sessionStorage.setItem('tiakur_admin_logged', 'true');
      alert('Login berhasil! Selamat datang di Panel Admin Kelurahan Tiakur.');
      router(); // Refresh view
    } else {
      alert('Kode Administrator Salah! Silakan coba lagi.');
    }
  });
}

// Admin Dashboard Area
function renderAdminDashboard(container) {
  container.innerHTML = `
    <div class="section-container">
      <div class="section-title-wrapper" style="margin-bottom: 2rem;">
        <h1 class="section-title">Dashboard Pengelola</h1>
        <p class="section-subtitle">Kelola dan perbarui seluruh data profil desa, APBDes, serta statistik kependudukan secara langsung.</p>
      </div>

      <div class="admin-dashboard-container">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
          <ul class="admin-nav">
            <li>
              <button class="admin-nav-link active" data-tab="admin-tab-profil">
                Profil & Aparatur
              </button>
            </li>
            <li>
              <button class="admin-nav-link" data-tab="admin-tab-statistik">
                Statistik Penduduk
              </button>
            </li>
            <li>
              <button class="admin-nav-link" data-tab="admin-tab-anggaran">
                APBDes (Anggaran)
              </button>
            </li>
            <li>
              <button class="admin-nav-link" data-tab="admin-tab-github">
                Integrasi & Simpan
              </button>
            </li>
          </ul>

          <div class="admin-sidebar-footer">
            <button class="btn-logout" id="admin-logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Keluar Dashboard
            </button>
          </div>
        </aside>

        <!-- Dynamic Admin Content Areas -->
        <main class="admin-content-area">
          <!-- 1. Profil & Aparatur -->
          <div class="admin-content-section active" id="admin-tab-profil">
            <div class="admin-section-header">
              <h2>Profil & Aparatur Kelurahan</h2>
            </div>
            
            <div class="form-group">
              <label for="edit-sejarah">Sejarah Kelurahan</label>
              <textarea id="edit-sejarah" class="form-input" rows="5" style="resize:vertical;"></textarea>
            </div>
            
            <div class="form-group">
              <label for="edit-visi">Visi Kelurahan</label>
              <input type="text" id="edit-visi" class="form-input">
            </div>

            <div class="form-group">
              <label>Misi Kelurahan (Pisahkan per baris)</label>
              <textarea id="edit-misi" class="form-input" rows="4" style="resize:vertical;"></textarea>
            </div>

            <div class="form-group" style="margin-top: 2rem;">
              <label style="border-bottom: 2px solid var(--border-light); padding-bottom: 0.5rem; display: block; margin-bottom: 1rem;">Daftar Aparatur Kelurahan</label>
              <div class="aparatur-edit-list" id="edit-aparatur-container">
                <!-- Appended dynamically -->
              </div>
              <button type="button" class="btn-add-item" id="btn-add-aparatur">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Tambah Aparatur Baru
              </button>
            </div>
          </div>

          <!-- 2. Statistik Penduduk -->
          <div class="admin-content-section" id="admin-tab-statistik">
            <div class="admin-section-header">
              <h2>Statistik Kependudukan</h2>
            </div>
            
            <div class="admin-form-grid">
              <div class="form-group">
                <label for="edit-stat-total">Total Jumlah Penduduk</label>
                <input type="number" id="edit-stat-total" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-kk">Total Kepala Keluarga</label>
                <input type="number" id="edit-stat-kk" class="form-input">
              </div>

              <!-- Gender -->
              <div class="admin-form-full">
                <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.25rem; color: var(--primary-ocean);">Rincian Jenis Kelamin</h4>
              </div>
              <div class="form-group">
                <label for="edit-stat-gender-l">Laki-Laki</label>
                <input type="number" id="edit-stat-gender-l" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-gender-p">Perempuan</label>
                <input type="number" id="edit-stat-gender-p" class="form-input">
              </div>

              <!-- Marriage -->
              <div class="admin-form-full">
                <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.25rem; color: var(--primary-ocean);">Status Pernikahan (Jiwa)</h4>
              </div>
              <div class="form-group">
                <label for="edit-stat-kawin-belum">Belum Kawin</label>
                <input type="number" id="edit-stat-kawin-belum" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-kawin-sudah">Kawin</label>
                <input type="number" id="edit-stat-kawin-sudah" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-kawin-cerai">Cerai Hidup</label>
                <input type="number" id="edit-stat-kawin-cerai" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-kawin-mati">Cerai Mati</label>
                <input type="number" id="edit-stat-kawin-mati" class="form-input">
              </div>

              <!-- Jobs -->
              <div class="admin-form-full">
                <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.25rem; color: var(--primary-ocean);">Mata Pencaharian (Jiwa)</h4>
              </div>
              <div class="form-group">
                <label for="edit-stat-job-pns">PNS / TNI / Polri</label>
                <input type="number" id="edit-stat-job-pns" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-job-swasta">Pegawai Swasta / BUMN</label>
                <input type="number" id="edit-stat-job-swasta" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-job-petani">Petani / Peternak</label>
                <input type="number" id="edit-stat-job-petani" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-job-nelayan">Nelayan</label>
                <input type="number" id="edit-stat-job-nelayan" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-job-dagang">Pedagang / Wiraswasta</label>
                <input type="number" id="edit-stat-job-dagang" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-job-tidak">Belum / Tidak Bekerja</label>
                <input type="number" id="edit-stat-job-tidak" class="form-input">
              </div>

              <!-- Religion -->
              <div class="admin-form-full">
                <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.25rem; color: var(--primary-ocean);">Pemeluk Agama (Jiwa)</h4>
              </div>
              <div class="form-group">
                <label for="edit-stat-rel-protestan">Kristen Protestan</label>
                <input type="number" id="edit-stat-rel-protestan" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-rel-katolik">Katolik</label>
                <input type="number" id="edit-stat-rel-katolik" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-rel-islam">Islam</label>
                <input type="number" id="edit-stat-rel-islam" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-rel-hindu">Hindu</label>
                <input type="number" id="edit-stat-rel-hindu" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-stat-rel-buddha">Buddha</label>
                <input type="number" id="edit-stat-rel-buddha" class="form-input">
              </div>

              <!-- Education -->
              <div class="admin-form-full">
                <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.25rem; color: var(--primary-ocean); margin-top: 1.5rem;">Fasilitas Pendidikan (Unit)</h4>
              </div>
              <div class="form-group">
                <label for="edit-edu-tk">Taman Kanak-Kanak (TK)</label>
                <input type="number" id="edit-edu-tk" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-edu-sd">Sekolah Dasar (SD)</label>
                <input type="number" id="edit-edu-sd" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-edu-smp">Sekolah Menengah Pertama (SMP)</label>
                <input type="number" id="edit-edu-smp" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-edu-sma">Sekolah Menengah Atas (SMA)</label>
                <input type="number" id="edit-edu-sma" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-edu-pt">Perguruan Tinggi</label>
                <input type="number" id="edit-edu-pt" class="form-input">
              </div>
              <div class="form-group"></div>

              <!-- Health -->
              <div class="admin-form-full">
                <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.25rem; color: var(--primary-ocean); margin-top: 1.5rem;">Fasilitas Kesehatan (Unit)</h4>
              </div>
              <div class="form-group">
                <label for="edit-health-rs">Rumah Sakit</label>
                <input type="number" id="edit-health-rs" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-health-puskes">Puskesmas</label>
                <input type="number" id="edit-health-puskes" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-health-pustu">Puskesmas Pembantu (Pustu)</label>
                <input type="number" id="edit-health-pustu" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-health-poli">Poliklinik</label>
                <input type="number" id="edit-health-poli" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-health-pos">Poskesdes</label>
                <input type="number" id="edit-health-pos" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-health-polindes">Polindes</label>
                <input type="number" id="edit-health-polindes" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-health-dr">Tempat Praktik Dokter</label>
                <input type="number" id="edit-health-dr" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-health-bidan">Tempat Praktik Bidan</label>
                <input type="number" id="edit-health-bidan" class="form-input">
              </div>
              <div class="form-group">
                <label for="edit-health-apotek">Apotek</label>
                <input type="number" id="edit-health-apotek" class="form-input">
              </div>
            </div>
          </div>

          <!-- 3. APBDes Anggaran -->
          <div class="admin-content-section" id="admin-tab-anggaran">
            <div class="admin-section-header">
              <h2>Transparansi Anggaran Kelurahan (APBDes)</h2>
            </div>
            
            <div class="form-group">
              <label for="edit-budget-year">Tahun Anggaran</label>
              <input type="text" id="edit-budget-year" class="form-input" style="max-width: 200px;">
            </div>

            <!-- Income editor table -->
            <div class="form-group" style="margin-top: 1.5rem;">
              <label style="border-bottom: 2px solid var(--border-light); padding-bottom: 0.5rem; display: block; margin-bottom: 1rem;">Pos Pendapatan Kelurahan</label>
              <div id="edit-income-container" class="aparatur-edit-list"></div>
              <button type="button" class="btn-add-item" id="btn-add-income">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Tambah Pos Pendapatan
              </button>
            </div>

            <!-- Expense editor table -->
            <div class="form-group" style="margin-top: 2rem;">
              <label style="border-bottom: 2px solid var(--border-light); padding-bottom: 0.5rem; display: block; margin-bottom: 1rem;">Pos Pembelanjaan Kelurahan</label>
              <div id="edit-expense-container" class="aparatur-edit-list"></div>
              <button type="button" class="btn-add-item" id="btn-add-expense">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Tambah Pos Belanja
              </button>
            </div>
          </div>

          <!-- 4. GitHub Integration and Save Options -->
          <div class="admin-content-section" id="admin-tab-github">
            <div class="admin-section-header">
              <h2>Integrasi & Sinkronisasi GitHub</h2>
            </div>
            
            <div class="github-config-banner">
              <p><strong>Bagaimana cara mengupdate data website secara gratis?</strong></p>
              <p>Hubungkan website dengan repositori GitHub Anda. Menggunakan <em>GitHub Personal Access Token</em>, website akan otomatis memposting file data yang diperbarui langsung ke repositori Anda. GitHub Pages akan otomatis memperbarui situs web dalam waktu 1 menit.</p>
              <p style="margin-top: 0.5rem; color: var(--primary-ocean);">Token Anda hanya disimpan secara lokal di browser Anda sendiri (Local Storage) dan tidak akan pernah dibagikan atau diunggah ke publik.</p>
            </div>

            <div class="admin-form-grid">
              <div class="form-group">
                <label for="gh-owner">Pemilik Repositori GitHub (Username/Org)</label>
                <input type="text" id="gh-owner" class="form-input" placeholder="Contoh: rinaldbutarbutar">
              </div>
              <div class="form-group">
                <label for="gh-repo">Nama Repositori GitHub</label>
                <input type="text" id="gh-repo" class="form-input" placeholder="Contoh: website-tiakur">
              </div>
              <div class="form-group">
                <label for="gh-branch">Branch Utama (Default: main)</label>
                <input type="text" id="gh-branch" class="form-input" placeholder="main">
              </div>
              <div class="form-group">
                <label for="gh-token">GitHub Personal Access Token (Fine-grained / Classic)</label>
                <input type="password" id="gh-token" class="form-input" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx">
              </div>
              <div class="form-group admin-form-full">
                <label for="edit-admin-code">Ubah Kode Unik Admin Baru (Kosongkan jika tidak ingin ganti)</label>
                <input type="password" id="edit-admin-code" class="form-input" placeholder="Masukkan kode unik baru...">
              </div>
            </div>
          </div>

          <!-- General Save Action Buttons -->
          <div class="btn-save-container">
            <button type="button" class="btn btn-secondary" id="btn-download-json">
              Unduh Backup JSON
            </button>
            <button type="button" class="btn btn-save-github" id="btn-save-data">
              Simpan & Update Live
            </button>
          </div>
        </main>
      </div>
    </div>
  `;

  // Populate form fields with current appData
  populateAdminForm();

  // Attach tab switching logic
  const tabLinks = document.querySelectorAll('.admin-nav-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Remove active classes
      tabLinks.forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.admin-content-section').forEach(sec => sec.classList.remove('active'));

      // Add active to current target
      link.classList.add('active');
      const tabId = link.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
      activeAdminTab = tabId;
    });
  });

  // Keep active tab state on rerender
  if (activeAdminTab) {
    const activeLink = document.querySelector(`.admin-nav-link[data-tab="${activeAdminTab}"]`);
    if (activeLink) activeLink.click();
  }

  // Logout button handler
  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('tiakur_admin_logged');
    alert('Anda telah keluar dari Dashboard Administrator.');
    router();
  });

  // Download local backup JSON handler
  document.getElementById('btn-download-json').addEventListener('click', () => {
    const updatedData = compileFormData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(updatedData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "site_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Save/Commit Data to GitHub Handler
  document.getElementById('btn-save-data').addEventListener('click', async () => {
    const updatedData = compileFormData();
    
    // Save locally to browser memory instantly
    appData = updatedData;

    // Check if GitHub Configuration is set
    let owner = document.getElementById('gh-owner').value.trim();
    let repo = document.getElementById('gh-repo').value.trim();
    const branch = document.getElementById('gh-branch').value.trim() || 'main';
    const token = document.getElementById('gh-token').value.trim();

    // Automatically parse if user pasted the full URL instead of just the names
    if (owner.includes('github.com')) {
      const cleanUrl = owner.replace('https://', '').replace('http://', '');
      const parts = cleanUrl.split('/');
      if (parts.length >= 2) {
        owner = parts[1];
      }
    }
    if (repo.includes('github.com')) {
      const cleanUrl = repo.replace('https://', '').replace('http://', '');
      const parts = cleanUrl.split('/');
      if (parts.length >= 3) {
        repo = parts[2].replace('.git', '');
      } else if (parts.length >= 2) {
        repo = parts[1].replace('.git', '');
      }
    }

    // Clean any trailing slashes or spaces
    owner = owner.replace(/\/+$/, "");
    repo = repo.replace(/\/+$/, "");

    // Save cleaned token configuration to localStorage for convenience
    localStorage.setItem('tiakur_gh_owner', owner);
    localStorage.setItem('tiakur_gh_repo', repo);
    localStorage.setItem('tiakur_gh_branch', branch);
    if (token) localStorage.setItem('tiakur_gh_token', token);

    if (!owner || !repo || !token) {
      alert("⚠️ Konfigurasi GitHub tidak lengkap! Perubahan telah disimpan sementara di memori browser Anda, namun data TIDAK dapat dikirim secara otomatis ke GitHub. \n\nSilakan unduh file backup JSON menggunakan tombol 'Unduh Backup JSON' untuk diunggah secara manual, atau lengkapi konfigurasi GitHub Anda di tab 'Integrasi & Simpan'.");
      return;
    }

    // Attempt auto-commit via GitHub API
    const saveBtn = document.getElementById('btn-save-data');
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = "Sedang Menyimpan...";

    try {
      const filePath = 'data/site_data.json';
      const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      
      // Step 1: Get file metadata (we need the current blob SHA)
      let sha = "";
      const getResponse = await fetch(fileUrl, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (getResponse.ok) {
        const metadata = await getResponse.json();
        sha = metadata.sha;
      } else if (getResponse.status === 404) {
        // If 404, verify if the repository itself is not found or it's just the file
        const repoCheck = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            'Authorization': `token ${token}`
          }
        });
        if (!repoCheck.ok) {
          throw new Error(`Repositori tidak ditemukan di GitHub.\n\nDetail:\n1. Pemilik: "${owner}"\n2. Repositori: "${repo}"\n\nSilakan pastikan Anda tidak memasukkan spasi di ujung teks, tidak memasukkan link/URL penuh, dan penulisan nama repositori sudah 100% sama dengan di GitHub.`);
        } else {
          // Repo exists, file doesn't exist yet on this branch
          sha = "";
        }
      } else {
        throw new Error(`Gagal membaca file dari repositori. Status HTTP: ${getResponse.status}`);
      }

      // Step 2: Push/PUT the updated content
      const putResponse = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: "Update site data via Admin Panel",
          content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedData, null, 2)))), // UTF-8 safe base64
          sha: sha || undefined,
          branch: branch
        })
      });

      if (putResponse.ok) {
        alert("🎉 Data berhasil di-update dan di-commit langsung ke repositori GitHub! \n\nSitus web akan terupdate otomatis dalam 1 menit saat GitHub Pages selesai mem-build.");
      } else {
        const errorData = await putResponse.json();
        throw new Error(errorData.message || "Gagal melakukan update ke GitHub.");
      }

    } catch (err) {
      console.error(err);
      alert(`⚠️ Terjadi kesalahan saat menyimpan ke GitHub:\n\n${err.message}\n\nPerubahan tetap tersimpan di memori lokal browser Anda sementara.`);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  });

  // Apparatus list buttons hooks
  document.getElementById('btn-add-aparatur').addEventListener('click', () => {
    addAparaturRow();
  });

  document.getElementById('btn-add-income').addEventListener('click', () => {
    addBudgetRow('income');
  });

  document.getElementById('btn-add-expense').addEventListener('click', () => {
    addBudgetRow('expense');
  });
}

// Helpers for Admin Dashboard Forms
function populateAdminForm() {
  // Profil & Sejarah
  document.getElementById('edit-sejarah').value = appData.profil.sejarah;
  document.getElementById('edit-visi').value = appData.profil.visi;
  document.getElementById('edit-misi').value = appData.profil.misi.join('\n');

  // Populate Apparatus
  const aparaturContainer = document.getElementById('edit-aparatur-container');
  aparaturContainer.innerHTML = "";
  appData.aparatur.forEach(staff => addAparaturRow(staff));

  // Populate Statistics
  const stat = appData.statistik;
  document.getElementById('edit-stat-total').value = stat.total_penduduk;
  document.getElementById('edit-stat-kk').value = stat.total_keluarga;
  
  document.getElementById('edit-stat-gender-l').value = stat.jenis_kelamin['Laki-laki'] || 0;
  document.getElementById('edit-stat-gender-p').value = stat.jenis_kelamin['Perempuan'] || 0;

  document.getElementById('edit-stat-kawin-belum').value = stat.status_perkawinan['Belum Kawin'] || 0;
  document.getElementById('edit-stat-kawin-sudah').value = stat.status_perkawinan['Kawin'] || 0;
  document.getElementById('edit-stat-kawin-cerai').value = stat.status_perkawinan['Cerai Hidup'] || 0;
  document.getElementById('edit-stat-kawin-mati').value = stat.status_perkawinan['Cerai Mati'] || 0;

  document.getElementById('edit-stat-job-pns').value = stat.pekerjaan['PNS / TNI / Polri'] || 0;
  document.getElementById('edit-stat-job-swasta').value = stat.pekerjaan['Pegawai Swasta / BUMN'] || 0;
  document.getElementById('edit-stat-job-petani').value = stat.pekerjaan['Petani / Peternak'] || 0;
  document.getElementById('edit-stat-job-nelayan').value = stat.pekerjaan['Nelayan'] || 0;
  document.getElementById('edit-stat-job-dagang').value = stat.pekerjaan['Pedagang / Wiraswasta'] || 0;
  document.getElementById('edit-stat-job-tidak').value = stat.pekerjaan['Belum / Tidak Bekerja'] || 0;

  document.getElementById('edit-stat-rel-protestan').value = stat.agama['Kristen Protestan'] || 0;
  document.getElementById('edit-stat-rel-katolik').value = stat.agama['Katolik'] || 0;
  document.getElementById('edit-stat-rel-islam').value = stat.agama['Islam'] || 0;
  document.getElementById('edit-stat-rel-hindu').value = stat.agama['Hindu'] || 0;
  document.getElementById('edit-stat-rel-buddha').value = stat.agama['Buddha'] || 0;

  // Populate Education Facilities
  const edu = stat.fasilitas_pendidikan || {};
  document.getElementById('edit-edu-tk').value = edu['Taman Kanak-Kanak (TK)'] || 0;
  document.getElementById('edit-edu-sd').value = edu['Sekolah Dasar (SD)'] || 0;
  document.getElementById('edit-edu-smp').value = edu['Sekolah Menengah Pertama (SMP)'] || 0;
  document.getElementById('edit-edu-sma').value = edu['Sekolah Menengah Atas (SMA)'] || 0;
  document.getElementById('edit-edu-pt').value = edu['Perguruan Tinggi'] || 0;

  // Populate Health Facilities
  const health = stat.fasilitas_kesehatan || {};
  document.getElementById('edit-health-rs').value = health['Rumah Sakit'] || 0;
  document.getElementById('edit-health-puskes').value = health['Puskesmas'] || 0;
  document.getElementById('edit-health-pustu').value = health['Puskesmas Pembantu (Pustu)'] || 0;
  document.getElementById('edit-health-poli').value = health['Poliklinik'] || 0;
  document.getElementById('edit-health-pos').value = health['Poskesdes'] || 0;
  document.getElementById('edit-health-polindes').value = health['Polindes'] || 0;
  document.getElementById('edit-health-dr').value = health['Tempat Praktik Dokter'] || 0;
  document.getElementById('edit-health-bidan').value = health['Tempat Praktik Bidan'] || 0;
  document.getElementById('edit-health-apotek').value = health['Apotek'] || 0;

  // Populate APBDes
  document.getElementById('edit-budget-year').value = appData.transparansi_anggaran.tahun;
  
  const incomeContainer = document.getElementById('edit-income-container');
  incomeContainer.innerHTML = "";
  appData.transparansi_anggaran.pendapatan.forEach(item => addBudgetRow('income', item));

  const expenseContainer = document.getElementById('edit-expense-container');
  expenseContainer.innerHTML = "";
  appData.transparansi_anggaran.belanja.forEach(item => addBudgetRow('expense', item));

  // Populate GitHub settings from localStorage
  document.getElementById('gh-owner').value = localStorage.getItem('tiakur_gh_owner') || "";
  document.getElementById('gh-repo').value = localStorage.getItem('tiakur_gh_repo') || "";
  document.getElementById('gh-branch').value = localStorage.getItem('tiakur_gh_branch') || "main";
  document.getElementById('gh-token').value = localStorage.getItem('tiakur_gh_token') || "";
}

function addAparaturRow(staff = null) {
  const container = document.getElementById('edit-aparatur-container');
  const div = document.createElement('div');
  div.className = 'aparatur-edit-item';
  div.innerHTML = `
    <input type="text" class="form-input ap-nama" placeholder="Nama Lengkap & Gelar" value="${staff ? staff.nama : ''}">
    <input type="text" class="form-input ap-jabatan" placeholder="Jabatan" value="${staff ? staff.jabatan : ''}">
    <button type="button" class="btn-remove">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  // Add remove hook
  div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
  container.appendChild(div);
}

function addBudgetRow(type, item = null) {
  const container = document.getElementById(type === 'income' ? 'edit-income-container' : 'edit-expense-container');
  const div = document.createElement('div');
  div.className = 'aparatur-edit-item';
  
  const textPlaceholder = type === 'income' ? 'Sumber Dana' : 'Bidang Belanja';
  const textVal = item ? (type === 'income' ? item.sumber : item.bidang) : '';
  const numVal = item ? item.jumlah : '';

  div.innerHTML = `
    <input type="text" class="form-input bg-text" placeholder="${textPlaceholder}" value="${textVal}">
    <input type="number" class="form-input bg-amount" placeholder="Jumlah Anggaran (Rupiah)" value="${numVal}">
    <button type="button" class="btn-remove">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  // Add remove hook
  div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
  container.appendChild(div);
}

function compileFormData() {
  const data = JSON.parse(JSON.stringify(appData)); // Deep clone target

  // Compile Profil Info
  data.profil.sejarah = document.getElementById('edit-sejarah').value.trim();
  data.profil.visi = document.getElementById('edit-visi').value.trim();
  data.profil.misi = document.getElementById('edit-misi').value.trim().split('\n').filter(line => line.trim() !== '');

  // Compile Apparatus list
  const aparaturRows = document.querySelectorAll('#edit-aparatur-container .aparatur-edit-item');
  const newAparatur = [];
  const palette = ['#005f73', '#0077b6', '#0a9396', '#f4a261', '#94d2bd', '#00b4d8', '#e76f51'];
  
  aparaturRows.forEach((row, index) => {
    const nama = row.querySelector('.ap-nama').value.trim();
    const jabatan = row.querySelector('.ap-jabatan').value.trim();
    if (nama && jabatan) {
      newAparatur.push({
        id: index + 1,
        nama: nama,
        jabatan: jabatan,
        avatar_color: palette[index % palette.length]
      });
    }
  });
  data.aparatur = newAparatur;

  // Compile Statistics
  data.statistik.total_penduduk = parseInt(document.getElementById('edit-stat-total').value) || 0;
  data.statistik.total_keluarga = parseInt(document.getElementById('edit-stat-kk').value) || 0;

  data.statistik.jenis_kelamin['Laki-laki'] = parseInt(document.getElementById('edit-stat-gender-l').value) || 0;
  data.statistik.jenis_kelamin['Perempuan'] = parseInt(document.getElementById('edit-stat-gender-p').value) || 0;

  data.statistik.status_perkawinan['Belum Kawin'] = parseInt(document.getElementById('edit-stat-kawin-belum').value) || 0;
  data.statistik.status_perkawinan['Kawin'] = parseInt(document.getElementById('edit-stat-kawin-sudah').value) || 0;
  data.statistik.status_perkawinan['Cerai Hidup'] = parseInt(document.getElementById('edit-stat-kawin-cerai').value) || 0;
  data.statistik.status_perkawinan['Cerai Mati'] = parseInt(document.getElementById('edit-stat-kawin-mati').value) || 0;

  data.statistik.pekerjaan['PNS / TNI / Polri'] = parseInt(document.getElementById('edit-stat-job-pns').value) || 0;
  data.statistik.pekerjaan['Pegawai Swasta / BUMN'] = parseInt(document.getElementById('edit-stat-job-swasta').value) || 0;
  data.statistik.pekerjaan['Petani / Peternak'] = parseInt(document.getElementById('edit-stat-job-petani').value) || 0;
  data.statistik.pekerjaan['Nelayan'] = parseInt(document.getElementById('edit-stat-job-nelayan').value) || 0;
  data.statistik.pekerjaan['Pedagang / Wiraswasta'] = parseInt(document.getElementById('edit-stat-job-dagang').value) || 0;
  data.statistik.pekerjaan['Belum / Tidak Bekerja'] = parseInt(document.getElementById('edit-stat-job-tidak').value) || 0;

  data.statistik.agama['Kristen Protestan'] = parseInt(document.getElementById('edit-stat-rel-protestan').value) || 0;
  data.statistik.agama['Katolik'] = parseInt(document.getElementById('edit-stat-rel-katolik').value) || 0;
  data.statistik.agama['Islam'] = parseInt(document.getElementById('edit-stat-rel-islam').value) || 0;
  data.statistik.agama['Hindu'] = parseInt(document.getElementById('edit-stat-rel-hindu').value) || 0;
  data.statistik.agama['Buddha'] = parseInt(document.getElementById('edit-stat-rel-buddha').value) || 0;

  // Compile Education Facilities
  if (!data.statistik.fasilitas_pendidikan) data.statistik.fasilitas_pendidikan = {};
  data.statistik.fasilitas_pendidikan['Taman Kanak-Kanak (TK)'] = parseInt(document.getElementById('edit-edu-tk').value) || 0;
  data.statistik.fasilitas_pendidikan['Sekolah Dasar (SD)'] = parseInt(document.getElementById('edit-edu-sd').value) || 0;
  data.statistik.fasilitas_pendidikan['Sekolah Menengah Pertama (SMP)'] = parseInt(document.getElementById('edit-edu-smp').value) || 0;
  data.statistik.fasilitas_pendidikan['Sekolah Menengah Atas (SMA)'] = parseInt(document.getElementById('edit-edu-sma').value) || 0;
  data.statistik.fasilitas_pendidikan['Perguruan Tinggi'] = parseInt(document.getElementById('edit-edu-pt').value) || 0;

  // Compile Health Facilities
  if (!data.statistik.fasilitas_kesehatan) data.statistik.fasilitas_kesehatan = {};
  data.statistik.fasilitas_kesehatan['Rumah Sakit'] = parseInt(document.getElementById('edit-health-rs').value) || 0;
  data.statistik.fasilitas_kesehatan['Puskesmas'] = parseInt(document.getElementById('edit-health-puskes').value) || 0;
  data.statistik.fasilitas_kesehatan['Puskesmas Pembantu (Pustu)'] = parseInt(document.getElementById('edit-health-pustu').value) || 0;
  data.statistik.fasilitas_kesehatan['Poliklinik'] = parseInt(document.getElementById('edit-health-poli').value) || 0;
  data.statistik.fasilitas_kesehatan['Poskesdes'] = parseInt(document.getElementById('edit-health-pos').value) || 0;
  data.statistik.fasilitas_kesehatan['Polindes'] = parseInt(document.getElementById('edit-health-polindes').value) || 0;
  data.statistik.fasilitas_kesehatan['Tempat Praktik Dokter'] = parseInt(document.getElementById('edit-health-dr').value) || 0;
  data.statistik.fasilitas_kesehatan['Tempat Praktik Bidan'] = parseInt(document.getElementById('edit-health-bidan').value) || 0;
  data.statistik.fasilitas_kesehatan['Apotek'] = parseInt(document.getElementById('edit-health-apotek').value) || 0;

  // Compile APBDes
  data.transparansi_anggaran.tahun = document.getElementById('edit-budget-year').value.trim();

  const incomeRows = document.querySelectorAll('#edit-income-container .aparatur-edit-item');
  const newIncome = [];
  incomeRows.forEach(row => {
    const sumber = row.querySelector('.bg-text').value.trim();
    const jumlah = parseInt(row.querySelector('.bg-amount').value) || 0;
    if (sumber) {
      newIncome.push({ sumber, jumlah });
    }
  });
  data.transparansi_anggaran.pendapatan = newIncome;

  const expenseRows = document.querySelectorAll('#edit-expense-container .aparatur-edit-item');
  const newExpense = [];
  expenseRows.forEach(row => {
    const bidang = row.querySelector('.bg-text').value.trim();
    const jumlah = parseInt(row.querySelector('.bg-amount').value) || 0;
    if (bidang) {
      newExpense.push({ bidang, jumlah });
    }
  });
  data.transparansi_anggaran.belanja = newExpense;

  // Compile and calculate new admin password code if requested
  const newCode = document.getElementById('edit-admin-code').value.trim();
  if (newCode) {
    // Note: Since hashing is async, we would ideally await it.
    // However, since we cannot easily await it inside a sync compilation function, 
    // we handle the code hashing in the submit handler separately.
    // So here we only store the hash if it was already updated, or do it during form submission.
    // Let's implement a secure way to capture and update this code.
    // We will hash it beforehand or we can block and update the hash asynchronously in the save handler.
    // For simplicity, we calculate the hash asynchronously in the save handler before sending,
    // and this compileFormData is just the baseline.
    // Let's update data.admin.code_hash in the save handler directly.
  }

  return data;
}

// Intercept save button click to calculate password code hash if entered
document.addEventListener('click', async (e) => {
  if (e.target && e.target.id === 'btn-save-data') {
    // This runs in parallel/addition to the main handler.
    // To ensure the new admin passcode hash is recorded:
    const newCodeField = document.getElementById('edit-admin-code');
    if (newCodeField && newCodeField.value.trim()) {
      const newHash = await hashAdminCode(newCodeField.value.trim());
      appData.admin.code_hash = newHash;
      newCodeField.value = ""; // Clear field after hashing
      alert("🔐 Kode unik Admin berhasil diperbarui! Gunakan kode baru ini untuk login berikutnya.");
    }
  }
});
