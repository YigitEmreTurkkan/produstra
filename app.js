document.addEventListener('DOMContentLoaded', () => {
  // --- STATE & DATA ---
  const state = {
    calculator: {
      model: 'bambu-p1s',
      hours: 4
    }
  };

  // Realistic side-hustle rates (representing actual wear & tear + margins)
  const printerRates = {
    'ender3': { name: 'Creality Ender 3 (Standart)', rate: 35 },
    'k1': { name: 'Creality K1 (Hızlı)', rate: 55 },
    'bambu-p1s': { name: 'Bambu Lab P1S (Yüksek Hız)', rate: 68 },
    'bambu-x1c': { name: 'Bambu Lab X1-Carbon (Premium)', rate: 78 },
    'voron': { name: 'Voron 2.4 (Özel Montaj)', rate: 85 }
  };

  // Dispatched Jobs History Database (Static Showcase)
  const completedJobs = [
    { city: 'İstanbul', job: 'Drone Motor Bağlantı Aparatı', status: 'Ödendi', amount: '480 TL', time: 'Bugün' },
    { city: 'Ankara', job: 'Mimari Ölçekli Kolon (2 Adet)', status: 'Ödendi', amount: '1,250 TL', time: 'Dün' },
    { city: 'İzmir', job: 'Tıbbi Cihaz Prototip Kabuğu', status: 'Ödendi', amount: '860 TL', time: '2 gün önce' },
    { city: 'Bursa', job: 'Otomotiv Torpido Dişli Seti', status: 'Ödendi', amount: '620 TL', time: '3 gün önce' }
  ];

  // --- ELEMENT SELECTORS ---
  // Calculator elements
  const calcModel = document.getElementById('calc-model');
  const calcHours = document.getElementById('calc-hours');
  const calcHoursVal = document.getElementById('calc-hours-val');
  const calcEarnVal = document.getElementById('calc-earnings-val');
  const weeklySub = document.getElementById('weekly-sub');
  
  // Simulator elements
  const simulatorList = document.getElementById('simulator-list');
  const activePrintersCount = document.getElementById('active-printers-count');
  
  // FAQ elements
  const faqItems = document.querySelectorAll('.faq-item');

  // --- INCOME CALCULATOR LOGIC ---
  function calculateEarnings() {
    const printerKey = calcModel.value;
    const hours = parseInt(calcHours.value);
    
    const rate = printerRates[printerKey].rate;
    // Grounded Calculation: hours * baseRate * 30 days * 30% occupancy rate (realistic load)
    const occupancyRate = 0.30;
    const monthlyEarnings = Math.round(hours * rate * 30 * occupancyRate);
    const weeklyEarnings = Math.round(monthlyEarnings / 4.33);
    
    // Update text content
    calcHoursVal.textContent = hours;
    
    // Animate counter
    animateCounter(calcEarnVal, parseInt(calcEarnVal.textContent.replace(/[^0-9]/g, '')) || 0, monthlyEarnings, 400);
    animateCounter(weeklySub, parseInt(weeklySub.textContent.replace(/[^0-9]/g, '')) || 0, weeklyEarnings, 400);
  }

  // Counter animation helper
  function animateCounter(element, start, end, duration) {
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

  // --- COMPLETED JOBS LIST SIMULATOR ---
  function renderCompletedJobs() {
    if (!simulatorList) return;
    
    simulatorList.innerHTML = '';
    completedJobs.forEach((job) => {
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
  if (calcModel && calcHours) {
    calcModel.value = state.calculator.model;
    calcHours.value = state.calculator.hours;
    
    calcModel.addEventListener('change', () => {
      state.calculator.model = calcModel.value;
      calculateEarnings();
    });
    
    calcHours.addEventListener('input', () => {
      state.calculator.hours = calcHours.value;
      calculateEarnings();
    });
    
    calculateEarnings();
  }

  // Initial render
  renderCompletedJobs();

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
