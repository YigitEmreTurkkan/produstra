document.addEventListener('DOMContentLoaded', () => {
  // --- STATE & DATA ---
  const state = {
    activeTab: 'maker', // 'maker' or 'customer'
    // Calculator State
    calculator: {
      model: 'bambu-p1s',
      hours: 4
    },
    // Quote Estimator State
    estimator: {
      fileName: '',
      weight: 75, // default grams
      material: 'pla', // 'pla', 'petg', 'abs'
      isAnalyzing: false,
      isUploaded: false
    }
  };

  // Realistic side-hustle rates (representing actual wear & tear + margins)
  const printerRates = {
    'ender3': { name: 'Creality Ender 3 (Standart)', rate: 20 },
    'k1': { name: 'Creality K1 (Hızlı)', rate: 40 },
    'bambu-p1s': { name: 'Bambu Lab P1S (Yüksek Hız)', rate: 50 },
    'bambu-x1c': { name: 'Bambu Lab X1-Carbon (Premium)', rate: 58 },
    'voron': { name: 'Voron 2.4 (Özel Montaj)', rate: 65 }
  };

  const materialRates = {
    'pla': { name: 'PLA (Standart)', rate: 1.5 },
    'petg': { name: 'PETG (Fonksiyonel)', rate: 2.0 },
    'abs': { name: 'ABS/ASA (Endüstriyel)', rate: 2.5 }
  };

  // Dispatched Jobs History Database (Static Showcase)
  const completedJobs = [
    { city: 'İstanbul', job: 'Drone Motor Bağlantı Aparatı', status: 'Ödendi', amount: '120 TL', time: 'Bugün' },
    { city: 'Ankara', job: 'Mimari Ölçekli Kolon (2 Adet)', status: 'Ödendi', amount: '340 TL', time: 'Dün' },
    { city: 'İzmir', job: 'Tıbbi Cihaz Prototip Kabuğu', status: 'Ödendi', amount: '260 TL', time: '2 gün önce' },
    { city: 'Bursa', job: 'Otomotiv Torpido Dişli Seti', status: 'Ödendi', amount: '190 TL', time: '3 gün önce' }
  ];

  // --- ELEMENT SELECTORS ---
  const tabMakerBtn = document.getElementById('tab-maker-btn');
  const tabCustomerBtn = document.getElementById('tab-customer-btn');
  const flowMaker = document.getElementById('flow-maker');
  const flowCustomer = document.getElementById('flow-customer');
  
  // Hero Dynamic elements
  const heroSubheadline = document.getElementById('hero-subheadline');
  const heroCtaMain = document.getElementById('hero-cta-main');
  const heroCtaSec = document.getElementById('hero-cta-sec');
  
  // Calculator elements
  const calcModel = document.getElementById('calc-model');
  const calcHours = document.getElementById('calc-hours');
  const calcHoursVal = document.getElementById('calc-hours-val');
  const calcEarnVal = document.getElementById('calc-earnings-val');
  const weeklySub = document.getElementById('weekly-sub');
  
  // Simulator elements
  const simulatorList = document.getElementById('simulator-list');
  const activePrintersCount = document.getElementById('active-printers-count');
  
  // Estimator elements
  const dropZone = document.getElementById('drop-zone');
  const uploadInput = document.getElementById('upload-input');
  const uploadProgress = document.getElementById('upload-progress');
  const estimatorControls = document.getElementById('estimator-controls');
  const fileDetails = document.getElementById('file-details');
  const fileNameDisplay = document.getElementById('file-name-display');
  const fileWeightDisplay = document.getElementById('file-weight-display');
  
  const weightSlider = document.getElementById('weight-slider');
  const weightVal = document.getElementById('weight-val');
  const materialSelect = document.getElementById('material-select');
  const estCost = document.getElementById('estimator-cost');
  const estTime = document.getElementById('estimator-time');
  const resetUpload = document.getElementById('reset-upload');

  // FAQ elements
  const faqItems = document.querySelectorAll('.faq-item');

  // --- TAB TOGGLE LOGIC ---
  function setTab(tabName) {
    state.activeTab = tabName;
    if (tabName === 'maker') {
      // Toggle button active states
      tabMakerBtn.className = 'flex-1 sm:flex-initial px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-orange-600 text-white shadow-md';
      tabCustomerBtn.className = 'flex-1 sm:flex-initial px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-slate-500 hover:text-slate-900';
      
      // Update Hero Content
      heroSubheadline.textContent = 'Boşta duran yazıcını topluluk işleri için üretime aç. Cihazını doğrula, e-posta ile iletilen STL dosyalarını basıp ek gelir kazan.';
      heroCtaMain.textContent = 'Yazıcını Ağa Kaydet';
      heroCtaMain.href = '#calculator-section';
      heroCtaSec.textContent = 'Katılım Koşulları';
      heroCtaSec.href = '#trust-section';
      
      // Toggle flow containers
      flowMaker.classList.remove('hidden-fade');
      flowMaker.classList.add('active-fade');
      flowCustomer.classList.remove('active-fade');
      flowCustomer.classList.add('hidden-fade');
      
    } else {
      // Toggle button active states
      tabCustomerBtn.className = 'flex-1 sm:flex-initial px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-orange-600 text-white shadow-md';
      tabMakerBtn.className = 'flex-1 sm:flex-initial px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-slate-500 hover:text-slate-900';
      
      // Update Hero Content
      heroSubheadline.textContent = 'Prototipler, yedek parçalar veya hobi ürünleri. Tasarımını yükle, sana en yakın yerel üretici basıp adresine göndersin.';
      heroCtaMain.textContent = 'Hemen Fiyat Teklifi Al';
      heroCtaMain.href = '#estimator-section';
      heroCtaSec.textContent = 'Kalite Güvencemiz';
      heroCtaSec.href = '#quality-section';
      
      // Toggle flow containers
      flowCustomer.classList.remove('hidden-fade');
      flowCustomer.classList.add('active-fade');
      flowMaker.classList.remove('active-fade');
      flowMaker.classList.add('hidden-fade');
    }
  }

  tabMakerBtn.addEventListener('click', () => setTab('maker'));
  tabCustomerBtn.addEventListener('click', () => setTab('customer'));

  // --- INCOME CALCULATOR LOGIC ---
  function calculateEarnings() {
    const printerKey = calcModel.value;
    const hours = parseInt(calcHours.value);
    
    const rate = printerRates[printerKey].rate;
    // Grounded Calculation: hours * baseRate * 30 days * 45% occupancy rate (realistic load)
    const occupancyRate = 0.45;
    const monthlyEarnings = Math.round(hours * rate * 30 * occupancyRate);
    const weeklyEarnings = Math.round(monthlyEarnings / 4.33);
    
    // Update text content
    calcHoursVal.textContent = hours;
    
    // Animate counter
    animateCounter(calcEarnVal, parseInt(calcEarnVal.textContent.replace(/[^0-9]/g, '')) || 0, monthlyEarnings, 400);
    animateCounter(weeklySub, parseInt(weeklySub.textContent.replace(/[^0-9]/g, '')) || 0, weeklyEarnings, 400);
  }

  function animateCounter(element, start, end, duration) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      element.textContent = new Intl.NumberFormat('tr-TR').format(currentValue) + ' TL';
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = new Intl.NumberFormat('tr-TR').format(end) + ' TL';
      }
    }
    window.requestAnimationFrame(step);
  }

  calcModel.addEventListener('change', calculateEarnings);
  calcHours.addEventListener('input', calculateEarnings);
  
  // Initialize Calculator on start
  calculateEarnings();

  // --- MOCK DISPATCH HISTORY RENDERING ---
  function renderCompletedJobs() {
    simulatorList.innerHTML = '';
    completedJobs.forEach((job) => {
      const jobEl = document.createElement('div');
      jobEl.className = 'flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-white hover:border-orange-500/20 hover:shadow-sm transition-all duration-300';
      jobEl.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="flex h-2.5 w-2.5 rounded-full bg-orange-500"></span>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">${job.city}</span>
              <span class="text-xs text-slate-400">${job.time}</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 mt-0.5">${job.job}</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/50 px-2 py-0.5 rounded-full">${job.amount}</span>
        </div>
      `;
      simulatorList.appendChild(jobEl);
    });
  }

  // Periodic fluctuation of active maker count for immersion
  function fluctuateMakers() {
    const delta = Math.floor(Math.random() * 3) - 1;
    const current = parseInt(activePrintersCount.textContent) || 312;
    activePrintersCount.textContent = Math.max(300, current + delta);
  }

  // Initial render
  renderCompletedJobs();
  setInterval(fluctuateMakers, 6000);

  // --- INTERACTIVE QUOTE ESTIMATOR LOGIC ---
  function calculateQuote() {
    const grams = parseInt(weightSlider.value);
    const materialKey = materialSelect.value;
    
    const materialRate = materialRates[materialKey].rate;
    const baseFee = 20; // Setup, machine prep, and dispatch fee
    const rawCost = baseFee + (grams * materialRate);
    
    const estimatedCost = Math.round(rawCost);
    estCost.textContent = estimatedCost + ' TL';
    
    // Print time calculation (approx 0.08 hours per gram for high speed, plus 0.5hr base overhead)
    const hoursTotal = (grams * 0.08) + 0.5;
    const h = Math.floor(hoursTotal);
    const m = Math.round((hoursTotal - h) * 60);
    
    estTime.textContent = `~ ${h} saat ${m} dakika`;
    weightVal.textContent = grams;
  }

  weightSlider.addEventListener('input', calculateQuote);
  materialSelect.addEventListener('change', calculateQuote);

  // File Upload Handlers (Drag & Drop Mockup)
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('border-orange-500', 'bg-orange-50/20');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-orange-500', 'bg-orange-50/20');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleMockUpload(files[0]);
    }
  });

  dropZone.addEventListener('click', () => {
    uploadInput.click();
  });

  uploadInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleMockUpload(e.target.files[0]);
    }
  });

  function handleMockUpload(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'stl' && ext !== 'obj' && ext !== '3mf') {
      alert('Lütfen geçerli bir 3D model dosyası (.stl, .obj, .3mf) yükleyin.');
      return;
    }

    state.estimator.fileName = file.name;
    state.estimator.isAnalyzing = true;
    state.estimator.isUploaded = false;

    // Show progress ui
    dropZone.classList.add('hidden');
    uploadProgress.classList.remove('hidden');
    
    const progressBar = document.getElementById('progress-bar');
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        state.estimator.isAnalyzing = false;
        state.estimator.isUploaded = true;
        
        const mockWeight = Math.floor(Math.random() * 150) + 15;
        weightSlider.value = mockWeight;
        state.estimator.weight = mockWeight;
        
        uploadProgress.classList.add('hidden');
        estimatorControls.classList.remove('hidden');
        fileDetails.classList.remove('hidden');
        
        fileNameDisplay.textContent = state.estimator.fileName;
        fileWeightDisplay.textContent = `${mockWeight} gr`;
        
        calculateQuote();
      } else {
        width += 10;
        progressBar.style.width = width + '%';
      }
    }, 100);
  }

  resetUpload.addEventListener('click', () => {
    state.estimator.fileName = '';
    state.estimator.isUploaded = false;
    state.estimator.isAnalyzing = false;
    
    estimatorControls.classList.add('hidden');
    fileDetails.classList.add('hidden');
    uploadProgress.classList.add('hidden');
    dropZone.classList.remove('hidden');
    
    uploadInput.value = '';
  });

  // Initialize initial estimator cost
  calculateQuote();

  // --- FAQ ACCORDION LOGIC ---
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('button');
    const content = item.querySelector('.accordion-content');
    const arrow = item.querySelector('svg');

    questionBtn.addEventListener('click', () => {
      const isOpen = content.classList.contains('open');
      
      faqItems.forEach(otherItem => {
        otherItem.querySelector('.accordion-content').classList.remove('open');
        otherItem.querySelector('.accordion-content').style.maxHeight = null;
        otherItem.querySelector('svg').classList.remove('rotate-180');
      });

      if (!isOpen) {
        content.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        arrow.classList.add('rotate-180');
      }
    });
  });
});
