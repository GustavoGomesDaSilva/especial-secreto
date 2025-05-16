// // Data do início do relacionamento
// const startDate = new Date("2025-02-02T00:00:00");
// const counter = document.getElementById("counter");

// function updateTimeTogether() {
//   const now = new Date();
//   const diff = now - startDate;

//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//   const minutes = Math.floor((diff / (1000 * 60)) % 60);
//   const seconds = Math.floor((diff / 1000) % 60);

//   counter.innerText = `Estamos juntos há ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos 💕`;
// }

// setInterval(updateTimeTogether, 1000);
// updateTimeTogether();

// function showSurprise() {
//   document.getElementById("surprise").style.display = "block";
// }

// --------------------------------------------
// imgs slide
window.onload = function () {
  const images = [
    "img/1.jpeg", "img/2.jpeg", "img/3.jpeg", "img/4.jpeg", "img/5.jpeg",
    "img/6.jpeg", "img/7.jpeg", "img/8.jpeg", "img/9.jpeg", "img/10.jpeg",
    "img/11.jpeg", "img/12.jpeg", "img/13.jpeg", "img/14.jpeg", "img/15.jpeg",
    "img/16.jpeg", "img/17.jpeg", "img/18.jpeg", "img/19.jpeg", 
    "img/21.jpeg", "img/22.jpeg", "img/23.jpeg", "img/24.jpeg", "img/25.jpeg",
    "img/26.jpeg"

  ];

  let shuffledImages = [...images];
  shuffle(shuffledImages);

  const slideImage = document.getElementById("slideImage");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  let current = 0;
  let history = [];
  let autoSlideInterval;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function showImage(index) {
    slideImage.style.opacity = 0;
    setTimeout(() => {
      slideImage.src = shuffledImages[index];
      slideImage.style.opacity = 1;
    }, 200);
  }

  function nextImage() {
    current++;
    if (current >= shuffledImages.length) {
      shuffle(shuffledImages);
      current = 0;
    }
    history.push(current);
    showImage(current);
  }

  function prevImage() {
    if (history.length > 1) {
      history.pop();
      current = history[history.length - 1];
      showImage(current);
    }
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextImage, 4000);
  }

  showImage(current);
  history.push(current);
  autoSlideInterval = setInterval(nextImage, 4000);

  nextBtn.addEventListener("click", () => {
    nextImage();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    prevImage();
    resetAutoSlide();
  });
};


// timeline
const timelineItems = document.querySelectorAll(".timeline-item");
const progressBar = document.getElementById("progressBar");
const dotsContainer = document.getElementById("timelineDots");
const container = document.getElementById("timelineScroll");

let currentIndex = 0;
let autoScrollInterval;

// === cria as bolinhas ===
timelineItems.forEach((_, idx) => {
  const dot = document.createElement("span");
  if (idx === 0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
});

// === atualiza barra e bolinhas ===
function updateTimelineProgress() {
  const total = timelineItems.length;
  const pct = ((currentIndex + 1) / total) * 100;
  progressBar.style.width = `${pct}%`;

  dotsContainer.querySelectorAll("span").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

// === função de scroll, loop infinito ===
function scrollTimeline(direction = 1) {
  const total = timelineItems.length;
  currentIndex = (currentIndex + direction + total) % total;

  const itemWidth = container.clientWidth;
  container.scrollTo({
    left: currentIndex * itemWidth,
    behavior: "smooth"
  });
  updateTimelineProgress();
  resetAutoScroll();
}

// === define o intervalo automático conforme largura ===
function resetAutoScroll() {
  clearInterval(autoScrollInterval);

  const isSmall = window.matchMedia("(max-width: 480px)").matches;
  const delay = isSmall ? 5000 : 10000;

  autoScrollInterval = setInterval(() => scrollTimeline(1), delay);
}

// === conecta botões ===
document.querySelector(".scroll-btn.left")
  .addEventListener("click", () => scrollTimeline(-1));
document.querySelector(".scroll-btn.right")
  .addEventListener("click", () => scrollTimeline(1));

// === inicia tudo ao carregar ===
window.addEventListener("DOMContentLoaded", () => {
  updateTimelineProgress();
  resetAutoScroll();
});

// === também ajusta se o usuário redimensionar a janela ===
window.addEventListener("resize", resetAutoScroll);


// Atualizar ao carregar
updateTimelineProgress();


// modal

const envelopeBtn = document.querySelector('.envelope-button');
const modalOverlay = document.getElementById('modal-overlay');
const closeBtn = document.querySelector('.close-btn');

envelopeBtn.addEventListener('click', () => {
  modalOverlay.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});


// musicas

const listEl = document.getElementById('musicList');
const detailArt = document.getElementById('trackArt');
const detailAudio = document.getElementById('trackAudio');
const detailLyrics = document.getElementById('lyrics');

listEl.addEventListener('click', async e => {
  if (e.target.tagName !== 'LI') return;

  // marca ativo
  document
    .querySelectorAll('.music-list li')
    .forEach(li => li.classList.remove('active'));
  e.target.classList.add('active');

  const artist = e.target.dataset.artist;
  const title = e.target.dataset.title;

  // 1) buscar capa e preview no iTunes
  const itunes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + title)}&limit=1`)
    .then(r => r.json());
  if (itunes.results.length) {
    const track = itunes.results[0];
    detailArt.src = track.artworkUrl100.replace('100x100', '300x300');
    detailAudio.src = track.previewUrl;
    detailAudio.play().catch(() => { });
  } else {
    detailArt.src = '';
    detailAudio.src = '';
  }

  // 2) buscar letra via Lyrics.ovh
  detailLyrics.textContent = 'Carregando letra...';
  fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`)
    .then(r => r.json())
    .then(data => {
      detailLyrics.textContent = data.lyrics || 'Letra não encontrada.';
    })
    .catch(() => {
      detailLyrics.textContent = 'Erro ao buscar letra.';
    });
});