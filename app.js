document.addEventListener('DOMContentLoaded', () => {
  // --- STATE & DATA ---
  const state = {
    calculator: {
      model: 'bambu-p1s'
    }
  };

  // Realistic side-hustle monthly estimated net earnings (hobi scale)
  const printerRates = {
    'bambu-p1s': { name: 'Bambu Lab P1S / P1P', monthlyEarnings: 3850 },
    'ender3': { name: 'Creality Ender 3 / Pro / V2', monthlyEarnings: 1540 },
    'k1': { name: 'Creality K1 / K1 Max', monthlyEarnings: 3120 },
    'bambu-x1c': { name: 'Bambu Lab X1-Carbon', monthlyEarnings: 4500 },
    'voron': { name: 'Voron 2.4 / Trident', monthlyEarnings: 4950 },
    'elegoo': { name: 'Elegoo Neptune 3 / 4 (Tüm seriler)', monthlyEarnings: 1650 },
    'anycubic': { name: 'Anycubic Kobra (Tüm seriler)', monthlyEarnings: 1680 },
    'prusa': { name: 'Prusa i3 MK3S+ / MK4', monthlyEarnings: 2900 },
    'bambu-a1': { name: 'Bambu Lab A1 / A1 Mini', monthlyEarnings: 2450 },
    'other-fdm': { name: 'Diğer (Standart FDM Yazıcılar)', monthlyEarnings: 1800 },
    'other-sla': { name: 'Diğer (Reçineli SLA Yazıcılar)', monthlyEarnings: 2600 }
  };

  // --- programMATIC 100-JOB SIMULATOR POOL ---
  const jobTemplates = [
    "Drone Motor Bağlantı Aparatı",
    "Mimari Ölçekli Kolon Parçası",
    "Tıbbi Cihaz Prototip Kabuğu",
    "Otomotiv Torpido Dişli Seti",
    "RC Helikopter İniş Takımı",
    "GoPro Kask Bağlantı Aparatı",
    "Mekanik Dişli Çark (PETG)",
    "Kulaklık Askısı (Masa Tipi)",
    "Kamera Tripod Taban Tablası",
    "Akıllı Telefon Standı",
    "Duş Başlığı Tutucu Braket",
    "Kahve Kapsülü Düzenleyici",
    "Diş Fırçası Duvar Askısı",
    "Kablo Klipsi Düzenleme Seti",
    "Bisiklet Suluk Kafesi Yuvası",
    "Kutu Oyunu Kart Düzenleyici",
    "Cosplay Maske Kulak Detayı",
    "Özel Tasarım Çekmece Kulpu",
    "Masa Ayak Koruyucu Tapası",
    "Klavye Yükseltici Aparat",
    "Matkap Ucu Düzenleme Standı",
    "Saksı Sulama Hunisi",
    "Laboratuvar Tüpü Standı",
    "Mini CNC Kablo Zincir Halkası",
    "3D Yazıcı Rulman Yuvası",
    "Drone Pervane Koruyucu Set",
    "Akrobat Lamba Masası Mengenesi",
    "Özel Boyutlu Somun Sıkma Kolu",
    "Masa Altı Priz Düzenleyici",
    "Monitör Yükseltici Destek Kolu",
    "Raspberry Pi 4 Muhafaza Kutusu",
    "Arduino Prototip Montaj Plakası",
    "Özel Tasarım USB Bellek Kabuğu",
    "Hassas Ölçü Mastarı Şablonu",
    "RC Araba Ön Tampon Plakası",
    "Klima Kumandası Duvar Askısı",
    "Gitar Penası Kutusu (Masaüstü)",
    "Lehim Havya Sehpası Tabanı"
  ];

  const cities = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya",
    "Kocaeli", "Adana", "Konya", "Mersin", "Gaziantep",
    "Eskişehir", "Samsun", "Denizli", "Sakarya", "Kayseri",
    "Muğla", "Aydın", "Balıkesir", "Tekirdağ", "Manisa"
  ];

  // Simple LCG PRNG for deterministic seed-based generation
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Populate 100 jobs pool
  const jobPool = [];
  for (let i = 0; i < 100; i++) {
    const cityIdx = Math.floor(seededRandom(i * 12 + 5) * cities.length);
    const templateIdx = Math.floor(seededRandom(i * 37 + 11) * jobTemplates.length);
    // Price between 320 TL and 1750 TL in increments of 10 TL
    const priceVal = 320 + Math.floor(seededRandom(i * 89 + 17) * 143) * 10;
    
    jobPool.push({
      city: cities[cityIdx],
      job: jobTemplates[templateIdx],
      amount: priceVal.toLocaleString('tr-TR') + ' TL'
    });
  }

  // --- ELEMENT SELECTORS ---
  // Calculator elements
  const calcModel = document.getElementById('calc-model');
  const calcEarnVal = document.getElementById('calc-earnings-val');
  const weeklySub = document.getElementById('weekly-sub');
  
  // Simulator elements
  const simulatorList = document.getElementById('simulator-list');
  const activePrintersCount = document.getElementById('active-printers-count');
  
  // FAQ elements
  const faqItems = document.querySelectorAll('.faq-item');

  // --- INCOME CALCULATOR LOGIC ---
  function calculateEarnings() {
    if (!calcModel) return;
    const printerKey = calcModel.value;
    const modelData = printerRates[printerKey];
    
    const monthlyEarnings = modelData.monthlyEarnings;
    const weeklyEarnings = Math.round(monthlyEarnings / 4.33);
    
    // Animate counter
    animateCounter(calcEarnVal, parseInt(calcEarnVal.textContent.replace(/[^0-9]/g, '')) || 0, monthlyEarnings, 400);
    animateCounter(weeklySub, parseInt(weeklySub.textContent.replace(/[^0-9]/g, '')) || 0, weeklyEarnings, 400);
  }

  // Counter animation helper
  function animateCounter(element, start, end, duration) {
    if (!element) return;
    if (start === end) {
      element.textContent = end.toLocaleString('tr-TR') + ' TL';
      return;
    }
    
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.max(Math.abs(Math.floor(duration / range)), 1);
    
    const timer = setInterval(() => {
      current += increment * Math.max(1, Math.floor(Math.abs(range) / 30));
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        clearInterval(timer);
        element.textContent = end.toLocaleString('tr-TR') + ' TL';
      } else {
        element.textContent = Math.round(current).toLocaleString('tr-TR') + ' TL';
      }
    }, stepTime);
  }

  // --- Deterministic Hourly Rotation completed jobs selector ---
  function getCompletedJobsForCurrentHour() {
    const msInHour = 60 * 60 * 1000;
    const currentHourStamp = Math.floor(Date.now() / msInHour);
    
    const uniqueIndices = [];
    const times = ["Bugün", "Dün", "2 gün önce", "3 gün önce"];
    
    for (let i = 0; i < 4; i++) {
      const slotHourStamp = Math.floor((currentHourStamp - i) / 4);
      let jobIdx = (slotHourStamp * 4 + i) % 100;
      
      let offset = 0;
      while (uniqueIndices.includes(jobIdx)) {
        offset++;
        jobIdx = (slotHourStamp * 4 + i + offset * 13) % 100;
      }
      uniqueIndices.push(jobIdx);
    }
    
    return uniqueIndices.map((jobIdx, i) => {
      const baseJob = jobPool[jobIdx];
      return {
        city: baseJob.city,
        job: baseJob.job,
        status: 'Ödendi',
        amount: baseJob.amount,
        time: times[i]
      };
    });
  }

  // --- COMPLETED JOBS LIST SIMULATOR ---
  function renderCompletedJobs() {
    if (!simulatorList) return;
    
    const currentJobs = getCompletedJobsForCurrentHour();
    simulatorList.innerHTML = '';
    
    currentJobs.forEach((job) => {
      const jobEl = document.createElement('div');
      jobEl.className = 'flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-white hover:border-indigo-500/20 hover:shadow-sm transition-all duration-300';
      jobEl.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="flex h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">${job.city}</span>
              <span class="text-xs text-slate-400">${job.time}</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 mt-0.5">${job.job}</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded-full">${job.amount}</span>
        </div>
      `;
      simulatorList.appendChild(jobEl);
    });
  }

  // Initialize initial state
  if (calcModel) {
    calcModel.value = state.calculator.model;
    
    calcModel.addEventListener('change', () => {
      state.calculator.model = calcModel.value;
      calculateEarnings();
    });
    
    calculateEarnings();
  }

  // Initial render
  renderCompletedJobs();
  // Check and refresh completed jobs list every 60 seconds (for page persistence)
  setInterval(renderCompletedJobs, 60000);

  // --- FAQ ACCORDION LOGIC ---
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('button');
    const content = item.querySelector('.accordion-content');
    const arrow = item.querySelector('svg');

    if (questionBtn && content && arrow) {
      questionBtn.addEventListener('click', () => {
        const isOpen = content.classList.contains('open');
        
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.accordion-content');
          const otherArrow = otherItem.querySelector('svg');
          if (otherContent && otherArrow) {
            otherContent.classList.remove('open');
            otherContent.style.maxHeight = null;
            otherArrow.classList.remove('rotate-180');
          }
        });

        if (!isOpen) {
          content.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
          arrow.classList.add('rotate-180');
        }
      });
    }
  });
});
