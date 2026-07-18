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

  // --- AI CHATBOT & TELEGRAM HANDOFF LOGIC ---
  const openChatBtn = document.getElementById('open-chat-btn');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const typingIndicator = document.getElementById('typing-indicator');

  if (openChatBtn && closeChatBtn && chatWindow) {
    // Open chat window
    openChatBtn.addEventListener('click', () => {
      chatWindow.classList.remove('hidden');
      setTimeout(() => {
        chatWindow.classList.remove('scale-95', 'opacity-0');
        chatWindow.classList.add('scale-100', 'opacity-100');
      }, 10);
      // Remove badge counter
      const badge = openChatBtn.querySelector('span');
      if (badge) badge.style.display = 'none';
      scrollToBottom();
    });

    // Close chat window
    closeChatBtn.addEventListener('click', () => {
      chatWindow.classList.remove('scale-100', 'opacity-100');
      chatWindow.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        chatWindow.classList.add('hidden');
      }, 300);
    });

    // Scroll to bottom helper
    function scrollToBottom() {
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    // Append User Message Bubble
    function appendUserMessage(text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'flex items-start justify-end space-x-2';
      msgDiv.innerHTML = `
        <div class="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-xs leading-relaxed">
          <p>${escapeHTML(text)}</p>
        </div>
      `;
      chatMessages.appendChild(msgDiv);
      scrollToBottom();
    }

    // Append AI Message Bubble
    function appendAIMessage(htmlContent) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'flex items-start space-x-2';
      msgDiv.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">AI</div>
        <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] space-y-2 text-slate-700 text-xs leading-relaxed">
          ${htmlContent}
        </div>
      `;
      chatMessages.appendChild(msgDiv);
      scrollToBottom();
    }

    // Helper to escape HTML for user inputs
    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    }

    // Show / Hide Typing Indicator
    function showTyping(show) {
      if (!typingIndicator) return;
      if (show) {
        typingIndicator.classList.remove('hidden');
      } else {
        typingIndicator.classList.add('hidden');
      }
      scrollToBottom();
    }

    // AI Intent Engine Responses
    function generateAIResponse(userText) {
      const query = userText.toLowerCase();

      // 1. Akreditasyon / 2.000 TL / Ücret / Aidat
      if (query.includes('2000') || query.includes('2.000') || query.includes('akreditasyon') || query.includes('ücret') || query.includes('aidat') || query.includes('lisans')) {
        return `<p>💰 <strong>2.000 TL Akreditasyon Bedeli Hakkında:</strong></p>
          <p>Bu ödeme platformun <strong>tek seferlik lisans ve akreditasyon bedelidir</strong>. Aylık, yıllık aidat veya komisyon kesintisi kesinlikle bulunmaz.</p>
          <p>Ödemeniz; cihazınızın tolerans testlerinin yapılması, sunucu altyapısı ve kurumsal B2B reklam kampanyalarının finansmanında kullanılır. Ödeme tek seferliktir ve iadesi yoktur.</p>`;
      }

      // 2. Ödeme / Cuma / IBAN / Para
      if (query.includes('ödeme') || query.includes('cuma') || query.includes('iban') || query.includes('para') || query.includes('hak ediş')) {
        return `<p>💳 <strong>Ödeme Koşulları ve Takvimi:</strong></p>
          <p>Müşteri teslimatını onayladıktan sonra (baskıda ölçü ve görsel kusur bulunmadığında) hak edişiniz havuzda kesinleşir.</p>
          <p>Hak edişleriniz, hiçbir kesinti veya komisyon uygulanmadan <strong>her hafta Cuma günü</strong> profilinizde tanımlı IBAN hesabınıza yatırılır.</p>`;
      }

      // 3. Fire Baskı / Hatalı / Tıkanma / Elektrik
      if (query.includes('fire') || query.includes('hatalı') || query.includes('tıkanma') || query.includes('elektrik') || query.includes('hasar') || query.includes('warping')) {
        return `<p>⚠️ <strong>Fire ve Hatalı Baskı Kuralları:</strong></p>
          <p>Elektrik kesintileri, tabla yapışmaması (warping), nozül tıkanması veya kalibrasyon sorunları nedeniyle oluşan fire baskılar <strong>tamamen üreticinin sorumluluğundadır</strong>.</p>
          <p>Produstra fire baskılar için malzeme/elektrik maliyeti tazmini ödemez. Yalnızca müşteriye sorunsuz teslim edilen başarılı üretimler ödenir.</p>`;
      }

      // 4. Yazıcı / Model / Ender / Bambu / Voron / Elegoo / Anycubic / Prusa / SLA
      if (query.includes('yazıcı') || query.includes('model') || query.includes('ender') || query.includes('bambu') || query.includes('voron') || query.includes('elegoo') || query.includes('anycubic') || query.includes('prusa') || query.includes('sla') || query.includes('fdm')) {
        return `<p>🖨️ <strong>Uyumlu 3D Yazıcı Modelleri:</strong></p>
          <p>Produstra kolektifine Ender 3, Bambu Lab (P1S, X1C, A1), Creality K1, Voron, Prusa, Elegoo, Anycubic ve diğer tüm FDM/SLA (Reçineli) yazıcı sahipleri katılabilir.</p>
          <p>Kayıt sonrası panelden kalibrasyon test modelini basıp kumpas ölçülerinizi iletmeniz yeterlidir.</p>`;
      }

      // 5. Sipariş / İş Dağıtımı / Nasıl
      if (query.includes('sipariş') || query.includes('iş') || query.includes('dağıtım') || query.includes('nasıl')) {
        return `<p>📦 <strong>Sipariş Dağıtım Süreci:</strong></p>
          <p>Siparişler otomatik değil, mesafeniz ve kumpas kalibrasyon onayınız esas alınarak koordinasyon ekibimiz tarafından <strong>e-posta veya Telegram</strong> üzerinden iletilir.</p>
          <p>Bölgenizden sipariş geldiğinde STL dosyası ve renk detayları sizinle paylaşılır. Onaylarsanız basıp kargolarsınız.</p>`;
      }

      // 6. Canlı Temsilci / İnsan / Yetkili / Telegram / İletişim / Yönetici / Numarası
      if (query.includes('canlı') || query.includes('temsilci') || query.includes('insan') || query.includes('yetkili') || query.includes('telegram') || query.includes('iletişim') || query.includes('yönetici') || query.includes('numara') || query.includes('telefon') || query.includes('bağlan')) {
        return `<p>🚀 <strong>Canlı Temsilciye Bağlanıyorsunuz!</strong></p>
          <p>Kolektif yöneticilerimizin şahsi telefon numaralarının korunması amacıyla tüm birebir iletişim <strong>Telegram ve Resmi E-Posta</strong> üzerinden yürütülmektedir.</p>
          <div class="pt-1 space-y-1.5">
            <a href="https://t.me/produstra_destek" target="_blank" class="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-2 rounded-xl transition-colors text-center justify-center shadow-sm text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              <span>Telegram: @produstra_destek</span>
            </a>
            <p class="text-[10px] text-slate-400 text-center">✉️ E-posta: <a href="mailto:info@produstra.com" class="text-indigo-600 underline">info@produstra.com</a></p>
          </div>`;
      }

      // Fallback Response
      return `<p>🤖 Anladım! Bu konuda size en doğru bilgiyi vermek için sizi doğrudan <strong>Canlı Temsilcimize</strong> yönlendirebilirim.</p>
        <p>Şahsi numara paylaşımı gerekmeden 7/24 Telegram ve e-posta üzerinden ekibimizle iletişime geçebilirsiniz:</p>
        <div class="pt-1 space-y-1.5">
          <a href="https://t.me/produstra_destek" target="_blank" class="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-2 rounded-xl transition-colors text-center justify-center shadow-sm text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
            <span>Telegram: @produstra_destek</span>
          </a>
          <p class="text-[10px] text-slate-400 text-center">✉️ E-posta: <a href="mailto:info@produstra.com" class="text-indigo-600 underline">info@produstra.com</a></p>
        </div>`;
    }

    // Process user submission
    function handleUserSubmission(msgText) {
      if (!msgText || !msgText.trim()) return;
      const text = msgText.trim();

      // Append user msg
      appendUserMessage(text);
      if (chatInput) chatInput.value = '';

      // Show typing indicator
      showTyping(true);

      // Simulate typing delay (500-700ms)
      setTimeout(() => {
        showTyping(false);
        const replyHTML = generateAIResponse(text);
        appendAIMessage(replyHTML);
      }, 600);
    }

    // Form submit listener
    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserSubmission(chatInput.value);
      });
    }

    // Quick chips click listener using event delegation
    if (chatMessages) {
      chatMessages.addEventListener('click', (e) => {
        const chip = e.target.closest('.quick-chip');
        if (chip) {
          const msg = chip.getAttribute('data-msg');
          if (msg) {
            handleUserSubmission(msg);
          }
        }
      });
    }
  }
});
