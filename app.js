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

    // AI Intent Engine Responses (Smart, Persuasive & Detailed)
    function generateAIResponse(userText) {
      const query = userText.toLowerCase();

      // 0. Selamlaşma & Nezaket (Greetings)
      if (query.includes('selam') || query.includes('merhaba') || query === 'sa' || query.includes('günaydın') || query.includes('iyi günler') || query.includes('hey') || query.includes('nasılsın') || query.includes('merhabalar')) {
        return `<p>Selam! 👋 <strong>Produstra 3D Üretici Kolektifi</strong>'ne hoş geldiniz!</p>
          <p>Ben Produstra Yapay Zeka Asistanıyım. Yazıcınızı üretime açma, 2.000 TL akreditasyon, hammadde (filament) tedariği, Cuma ödemeleri veya süreç hakkında merak ettiğiniz tüm soruları yanıtlamaya hazırım!</p>`;
      }

      // 1. Filament & Hammadde Süreci
      if (query.includes('filament') || query.includes('hammadde') || query.includes('malzeme') || query.includes('gram') || query.includes('pla') || query.includes('petg') || query.includes('abs')) {
        return `<p>🧵 <strong>Filament ve Malzeme Süreci Hakkında:</strong></p>
          <p>• <strong>Maliyet Hak Edişinize Eklenir:</strong> Müşterinin talep ettiği malzeme (PLA, PETG, ABS vb.) ve gramaj sipariş detaylarında size iletilir. Harcanan her gram hammadde bedeli + makine saat ücreti ödemenize eksiksiz eklenir.</p>
          <p>• <strong>Kendi Stoklarınızı Kullanın:</strong> Elinizdeki standart kaliteli filamentleri kullanabileceğiniz gibi, dilerseniz topluluğumuzun indirimli hammadde tedarikçilerinden de faydalanabilirsiniz.</p>
          <p>• Karmaşık dilimleme ile uğraşmazsınız; basıma hazır STL ve renk kodları doğrudan size ulaştırılır.</p>`;
      }

      // 2. Fire Baskı & Risk Yönetimi
      if (query.includes('fire') || query.includes('hatalı') || query.includes('tıkanma') || query.includes('elektrik') || query.includes('hasar') || query.includes('warping') || query.includes('zarar') || query.includes('risk')) {
        return `<p>⚠️ <strong>Fire Baskı ve Risk Analizi:</strong></p>
          <p>• <strong>%1'in Altında Fire Oranı:</strong> Katılım aşamasında kumpas doğrulaması yapıldığı için kalibrasyon hataları ve basım kaza riskleri sıfırlanır.</p>
          <p>• <strong>Yüksek Kâr Marjı:</strong> Başarılı teslim edilen tek bir iş dahi hammadde maliyetinizin çok üzerinde kazanç sağladığı için olası küçük mekanik hatalar aylık kârlılığınızı asla etkilemez.</p>
          <p>• Elektrik kesintisi veya tabla kalkması gibi mekanik sorunlar üretici sorumluluğundadır; ancak tescilli kalibrasyon sayesinde bu durumlar sıfıra yakın yaşanır.</p>`;
      }

      // 3. Neden Katılmalıyım? / Avantajlar & İkna
      if (query.includes('neden') || query.includes('avantaj') || query.includes('kazanç') || query.includes('mantıklı') || query.includes('kâr') || query.includes('guven') || query.includes('dolandırıcı') || query.includes('nedir')) {
        return `<p>🚀 <strong>Neden Produstra Kolektifine Katılmalısınız?</strong></p>
          <p>• <strong>Yazıcınızı Paraya Çevirin:</strong> Boşta duran cihazınız kenarda tozlanmak yerine ayda 1.500 TL - 4.950 TL arası net ek gelir üretir.</p>
          <p>• <strong>%100 Komisyonsuz:</strong> Ürettiklerinizden komisyon veya aracı ücreti kesilmez. Kazancınızın tamamı Cuma günü IBAN hesabınıza yatırılır.</p>
          <p>• <strong>Pazarlama ve Müşteri Bulma Derdi Yok:</strong> B2B kurumsal reklam bütçelerimiz sayesinde siparişler doğrudan bölgenizden e-posta ile ayağınıza gelir.</p>
          <div class="pt-2">
            <a href="https://www.shopier.com/produstra/49087280" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md inline-flex items-center space-x-1.5">
              <span>🛒 Shopier Güvencesiyle Katıl (2.000 TL)</span>
            </a>
          </div>`;
      }

      // 4. Akreditasyon / 2.000 TL Ücret / Shopier Ödeme
      if (query.includes('2000') || query.includes('2.000') || query.includes('akreditasyon') || query.includes('ücret') || query.includes('aidat') || query.includes('lisans') || query.includes('iade') || query.includes('shopier')) {
        return `<p>💰 <strong>2.000 TL Akreditasyon & Shopier Ödemesi:</strong></p>
          <p>• <strong>Ömür Boyu Tek Seferlik:</strong> Aylık, yıllık aidat veya sipariş başına komisyon kesintisi KESİNLİKLE YOKTUR.</p>
          <p>• <strong>Shopier Güvencesi:</strong> Ödemenizi 256-bit SSL korumalı Shopier altyapımız üzerinden kredi/banka kartınızla 3D Secure güvencesinde gerçekleştirebilirsiniz.</p>
          <div class="pt-2">
            <a href="https://www.shopier.com/produstra/49087280" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md inline-flex items-center space-x-1.5">
              <span>🛒 Shopier Güvencesiyle Öde (2.000 TL)</span>
            </a>
          </div>`;
      }

      // 5. Ödeme Koşulları & Cuma IBAN
      if (query.includes('ödeme') || query.includes('cuma') || query.includes('iban') || query.includes('para') || query.includes('hak ediş')) {
        return `<p>💳 <strong>Kesintisiz Cuma Ödeme Güvencesi:</strong></p>
          <p>• Müşteri teslimatını onayladığı anda (ölçü ve görsel kusur olmadığında) hak edişiniz anında havuzda kesinleşir.</p>
          <p>• Hiçbir aracı komisyonu kesilmeden her hafta <strong>Cuma günü</strong> şahsi IBAN hesabınıza havale yapılır.</p>`;
      }

      // 6. Yazıcı Modelleri (FDM / SLA)
      if (query.includes('yazıcı') || query.includes('model') || query.includes('ender') || query.includes('bambu') || query.includes('voron') || query.includes('elegoo') || query.includes('anycubic') || query.includes('prusa') || query.includes('sla') || query.includes('fdm')) {
        return `<p>🖨️ <strong>Uyumlu 3D Yazıcı Modellerimiz:</strong></p>
          <p>• <strong>FDM Yazıcılar:</strong> Ender 3 serisi, Bambu Lab (P1S, X1C, A1), Creality K1, Voron, Prusa, Elegoo Neptune, Anycubic vb.</p>
          <p>• <strong>SLA (Reçineli) Yazıcılar:</strong> Hassas prototip ve medikal parçalar için tüm reçineli cihazlar desteklenir.</p>
          <p>Cihazınızın kalibrasyonunu test mastarı basarak doğrulamanız yeterlidir.</p>`;
      }

      // 7. Sipariş & İş Dağıtımı
      if (query.includes('sipariş') || query.includes('iş') || query.includes('dağıtım') || query.includes('nasıl')) {
        return `<p>📦 <strong>Sipariş Dağıtım Süreci:</strong></p>
          <p>Siparişler otomatik değil, mesafeniz ve kumpas kalibrasyon onayınız esas alınarak koordinasyon ekibimiz tarafından <strong>e-posta veya iletişim numaranız</strong> üzerinden iletilir.</p>
          <p>Bölgenizden sipariş geldiğinde STL dosyası ve renk detayları sizinle paylaşılır. Onaylarsanız basıp kargolarsınız.</p>`;
      }

      // 8. Canlı Temsilci / İnsan / İletişim / Destek
      if (query.includes('canlı') || query.includes('temsilci') || query.includes('insan') || query.includes('yetkili') || query.includes('iletişim') || query.includes('yönetici') || query.includes('numara') || query.includes('telefon') || query.includes('bağlan') || query.includes('mail') || query.includes('destek')) {
        return `<p>✉️ <strong>Destek Ekibimize Ulaşın:</strong></p>
          <p>Adınızı, e-posta adresinizi ve telefon numaranızı bırakarak ekibimize mesaj iletebilirsiniz.</p>
          <div class="pt-2">
            <button onclick="document.getElementById('tab-email-form').click()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md inline-flex items-center space-x-2">
              <span>✉️ E-posta & Destek Formunu Aç</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>`;
      }

      // Fallback Response
      return `<p>🤖 Anladım! Bu konuda size en doğru bilgiyi vermek için sizi doğrudan iletişim formumuza ve Shopier ödeme sayfamıza yönlendiriyorum.</p>
        <div class="pt-2 flex flex-col space-y-1.5">
          <a href="https://www.shopier.com/produstra/49087280" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md inline-flex items-center justify-center space-x-1.5">
            <span>🛒 Shopier Güvencesiyle Öde (2.000 TL)</span>
          </a>
          <button onclick="document.getElementById('tab-email-form').click()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md inline-flex items-center justify-center space-x-2">
            <span>✉️ E-posta & Destek Formunu Aç</span>
          </button>
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

    // --- CHAT MODAL TAB SWITCHING & DIRECT EMAIL SUPPORT FORM LOGIC ---
    const tabAiChat = document.getElementById('tab-ai-chat');
    const tabEmailForm = document.getElementById('tab-email-form');
    const viewAiChat = document.getElementById('view-ai-chat');
    const viewEmailForm = document.getElementById('view-email-form');
    const chipSwitchEmail = document.getElementById('chip-switch-email');
    const directSuppForm = document.getElementById('direct-support-form');
    const suppFormSuccess = document.getElementById('supp-form-success');

    function switchToTab(tabName) {
      if (tabName === 'email') {
        if (viewAiChat) viewAiChat.classList.add('hidden');
        if (viewEmailForm) viewEmailForm.classList.remove('hidden');
        if (tabEmailForm) tabEmailForm.className = 'flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all bg-indigo-600 text-white flex items-center justify-center space-x-1.5 shadow-sm';
        if (tabAiChat) tabAiChat.className = 'flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-all text-slate-400 hover:text-white hover:bg-slate-900 flex items-center justify-center space-x-1.5';
      } else {
        if (viewEmailForm) viewEmailForm.classList.add('hidden');
        if (viewAiChat) viewAiChat.classList.remove('hidden');
        if (tabAiChat) tabAiChat.className = 'flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all bg-indigo-600 text-white flex items-center justify-center space-x-1.5 shadow-sm';
        if (tabEmailForm) tabEmailForm.className = 'flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-all text-slate-400 hover:text-white hover:bg-slate-900 flex items-center justify-center space-x-1.5';
        scrollToBottom();
      }
    }

    if (tabAiChat && tabEmailForm) {
      tabAiChat.addEventListener('click', () => switchToTab('ai'));
      tabEmailForm.addEventListener('click', () => switchToTab('email'));
    }

    if (chipSwitchEmail) {
      chipSwitchEmail.addEventListener('click', () => switchToTab('email'));
    }

    if (directSuppForm) {
      directSuppForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('supp-name').value;
        const email = document.getElementById('supp-email').value;
        const phone = document.getElementById('supp-phone') ? document.getElementById('supp-phone').value : '';
        const msg = document.getElementById('supp-msg').value;

        // Show confirmation success box
        if (suppFormSuccess) {
          suppFormSuccess.classList.remove('hidden');
        }
        directSuppForm.reset();

        // Formatted mailto fallback trigger with phone number
        const mailtoUri = `mailto:info@produstra.com?subject=${encodeURIComponent('Destek Talebi: ' + name)}&body=${encodeURIComponent('Ad Soyad: ' + name + '\nE-posta: ' + email + '\nTelefon: ' + phone + '\n\nMesaj:\n' + msg)}`;
        setTimeout(() => {
          window.location.href = mailtoUri;
        }, 1200);
      });
    }
  }

  // --- MAKER REGISTRATION & SHOPIER PAYMENT MODAL LOGIC ---
  window.PRODUSTRA_SHOPIER_URL = 'https://www.shopier.com/produstra/49087280'; // Official Shopier 2.000 TL Link

  const regModal = document.getElementById('registration-modal');
  const closeRegModalBtn = document.getElementById('close-reg-modal');
  const makerRegForm = document.getElementById('maker-registration-form');

  // Open Registration Modal when top-right or any CTA buttons are clicked
  document.querySelectorAll('.btn-open-reg-modal, a[href="#registration-modal"], a[href="#trust-section"], a[href="#calculator-section"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (regModal) {
        e.preventDefault();
        regModal.classList.remove('hidden');
      }
    });
  });

  // Global event delegation for any "Kolektife Katıl" button
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (target && target.innerText && target.innerText.toLowerCase().includes('kolektife katıl')) {
      if (regModal && !target.closest('#registration-modal')) {
        e.preventDefault();
        regModal.classList.remove('hidden');
      }
    }
  });

  if (closeRegModalBtn && regModal) {
    closeRegModalBtn.addEventListener('click', () => {
      regModal.classList.add('hidden');
    });
  }

  if (makerRegForm) {
    makerRegForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const phone = document.getElementById('reg-phone').value;
      const email = document.getElementById('reg-email').value;
      const city = document.getElementById('reg-city').value;
      const model = document.getElementById('reg-model').value;

      // 1. Save lead details locally
      const regData = { name, phone, email, city, model, timestamp: new Date().toISOString() };
      try {
        localStorage.setItem('produstra_last_lead', JSON.stringify(regData));
      } catch (err) {}

      // 2. Trigger mailto notification backup to info@produstra.com
      const subject = `🔔 YENİ MAKER ÜYE KAYDI: ${name} (${phone})`;
      const body = `Ad Soyad: ${name}\nTelefon: ${phone}\nE-posta: ${email}\nŞehir: ${city}\nYazıcı Modeli: ${model}\n\nKayıt Tarihi: ${new Date().toLocaleString('tr-TR')}\n\n*Bu üretici 2.000 TL Shopier ödeme sayfasına yönlendirildi.*`;
      const mailtoUri = `mailto:info@produstra.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // 3. Open Official Shopier Payment Page
      window.open(window.PRODUSTRA_SHOPIER_URL, '_blank');

      // 4. Dispatch background mailto notification
      setTimeout(() => {
        window.location.href = mailtoUri;
      }, 500);

      if (regModal) regModal.classList.add('hidden');
      makerRegForm.reset();
    });
  }
});
