
const correctPassword = "1224";
let enteredPassword = "";
let unlocked = false;

const dots = document.querySelectorAll(".password-dots span");
const errorMessage = document.getElementById("error-message");
const flowerContainer = document.getElementById("flower-container");

document.querySelectorAll("[data-key]").forEach(button => {
  button.addEventListener("click", () => {
    enterDigit(button.dataset.key);
  });
});

document.getElementById("delete-key").addEventListener("click", () => {
  if (unlocked) return;
  enteredPassword = enteredPassword.slice(0, -1);
  updateDots();
  errorMessage.textContent = "";
});

document.addEventListener("keydown", event => {
  if (/^[0-9]$/.test(event.key)) {
    enterDigit(event.key);
  } else if (event.key === "Backspace" && !unlocked) {
    enteredPassword = enteredPassword.slice(0, -1);
    updateDots();
  }
});

function enterDigit(digit) {
  if (unlocked || enteredPassword.length >= 4) return;

  enteredPassword += digit;
  errorMessage.textContent = "";
  updateDots();

  if (enteredPassword.length === 4) {
    if (enteredPassword === correctPassword) {
      unlocked = true;
      startFlowerAnimation();

      setTimeout(() => {
        document.getElementById("login-screen")
          .classList.remove("active");

        document.getElementById("welcome-screen")
          .classList.add("active");
      }, 3200);

    } else {
      errorMessage.textContent = "Bir daha dene, sevgilim ♡";

      setTimeout(() => {
        enteredPassword = "";
        updateDots();
      }, 700);
    }
  }
}

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPassword.length);
  });
}



function createDaisy() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="48" height="48" viewBox="0 0 48 48">
      ${Array.from({ length: 9 }, (_, i) => `
        <ellipse cx="24" cy="12" rx="5" ry="10"
          fill="#f4d43b"
          transform="rotate(${i * 40} 24 24)"/>
      `).join("")}
      <circle cx="24" cy="24" r="7" fill="#e6a526"/>
      <circle cx="22" cy="22" r="2" fill="#ffe78a"
              opacity="0.7"/>
    </svg>
  `;

  return "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svg);
}

function createCactus() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="48" height="48" viewBox="0 0 48 48">

      <path d="M19 30 H15 Q10 30 10 24 V18
               Q10 15 13 15 Q16 15 16 18 V23
               Q16 25 19 25"
            fill="none" stroke="#368e4b"
            stroke-width="7" stroke-linecap="round"/>

      <path d="M29 28 H33 Q38 28 38 22 V17
               Q38 14 35 14 Q32 14 32 17 V21
               Q32 23 29 23"
            fill="none" stroke="#368e4b"
            stroke-width="7" stroke-linecap="round"/>

      <rect x="18" y="7" width="12" height="36"
            rx="6" fill="#42a65a"/>

      <path d="M22 10 V40 M26 10 V40"
            stroke="#287b40" stroke-width="1.3"
            opacity="0.7"/>

      <g stroke="#e6e6a5" stroke-width="1.2"
         stroke-linecap="round">
        <path d="M19 15 l-4 -2 M19 23 l-4 1
                 M19 32 l-4 -1 M19 38 l-3 2
                 M29 14 l4 -2 M29 22 l4 1
                 M29 31 l4 -1 M29 38 l3 2
                 M23 18 l-2 -3 M26 28 l2 -3
                 M23 35 l-2 2"/>
      </g>
    </svg>
  `;

  return "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svg);
}

const yellowDaisy = createDaisy();
const greenCactus = createCactus();

function startFlowerAnimation() {
  const numberOfFlowers = 250;

  for (let i = 0; i < numberOfFlowers; i++) {
    const flower = document.createElement("img");
    flower.className = "falling-flower";

    const isCactus = Math.random() < 0.35;

    flower.src = isCactus ? greenCactus : yellowDaisy;

    // Kaktüsler papatyalardan biraz daha büyük
    const size = 16 + Math.random() * 23;
    const finalSize = isCactus ? size * 1.22 : size;

    flower.style.width = finalSize + "px";
    flower.style.height = finalSize + "px";

    flower.style.left = Math.random() * 100 + "vw";

    flower.style.animationDuration =
      (3 + Math.random() * 2) + "s";

    flower.style.animationDelay =
      (Math.random() * 1.5) + "s";

    flower.style.setProperty(
      "--drift",
      (Math.random() * 180 - 90) + "px"
    );

    flower.style.setProperty(
      "--rotation",
      (Math.random() * 720 - 360) + "deg"
    );

    flowerContainer.appendChild(flower);

    flower.addEventListener("animationend", () => {
      flower.remove();
    });
  }
}


// KARŞILAMA SAYFASINDAN PUZZLE'A GEÇİŞ

document.getElementById("next-button")
  .addEventListener("click", () => {
    document.getElementById("welcome-screen")
      .classList.remove("active");

    document.getElementById("puzzle-screen")
      .classList.add("active");

    window.scrollTo(0, 0);
  });


// 16 PARÇALIK PUZZLE

const puzzleBoard = document.getElementById("puzzle-board");
const puzzleStatus = document.getElementById("puzzle-status");
const puzzleSuccess = document.getElementById("puzzle-success");
const shuffleButton = document.getElementById("shuffle-button");

const gridSize = 4;
const totalPieces = 16;

let puzzlePieces = [];
let selectedPiece = null;
let puzzleCompleted = false;

// Parçaları rastgele karıştır
function shufflePuzzle() {
  puzzlePieces = Array.from(
    { length: totalPieces },
    (_, i) => i
  );

  // Fisher-Yates karıştırma algoritması
  for (let i = puzzlePieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [puzzlePieces[i], puzzlePieces[j]] =
      [puzzlePieces[j], puzzlePieces[i]];
  }

  // Başlangıçta çözülmüş olmasın
  if (isPuzzleSolved()) {
    [puzzlePieces[0], puzzlePieces[1]] =
      [puzzlePieces[1], puzzlePieces[0]];
  }

  selectedPiece = null;
  puzzleCompleted = false;

  puzzleSuccess.hidden = true;
  shuffleButton.hidden = false;

  puzzleStatus.textContent =
    "İki parçaya sırayla dokunarak yerlerini değiştir.";

  renderPuzzle();
}

// Puzzle çözülmüş mü?
function isPuzzleSolved() {
  return puzzlePieces.every(
    (piece, index) => piece === index
  );
}

// Parçaları ekrana çiz
function renderPuzzle() {
  puzzleBoard.innerHTML = "";

  puzzlePieces.forEach((pieceId, position) => {
    const piece = document.createElement("button");

    piece.type = "button";
    piece.className = "puzzle-piece";

    const row = Math.floor(pieceId / gridSize);
    const col = pieceId % gridSize;

    piece.style.backgroundPosition =
      `${col * 100 / (gridSize - 1)}% ` +
      `${row * 100 / (gridSize - 1)}%`;

    piece.setAttribute(
      "aria-label",
      `Konum ${position + 1}, parça ${pieceId + 1}`
    );

    if (selectedPiece === position) {
      piece.classList.add("selected");
    }

    piece.addEventListener("click", () => {
      handlePieceClick(position);
    });

    puzzleBoard.appendChild(piece);
  });
}

// İki parçayı seçerek yer değiştir
function handlePieceClick(position) {
  if (puzzleCompleted) return;

  if (selectedPiece === null) {
    selectedPiece = position;
    renderPuzzle();
    return;
  }

  if (selectedPiece === position) {
    selectedPiece = null;
    renderPuzzle();
    return;
  }

  [puzzlePieces[selectedPiece], puzzlePieces[position]] =
    [puzzlePieces[position], puzzlePieces[selectedPiece]];

  selectedPiece = null;
  renderPuzzle();

  if (isPuzzleSolved()) {
    completePuzzle();
  }
}

// Puzzle tamamlanınca
function completePuzzle() {
  puzzleCompleted = true;

  puzzleStatus.textContent =
    "Bütün parçalar doğru yerinde! ♡";

  shuffleButton.hidden = true;
  puzzleSuccess.hidden = false;

  // Kutlama için papatyalar
  startFlowerAnimation();
}

// Yeniden karıştırma
shuffleButton.addEventListener("click", shufflePuzzle);


// PUZZLE'DAN MEKTUBA GEÇİŞ

document.getElementById("puzzle-next")
  .addEventListener("click", () => {
    document.getElementById("puzzle-screen")
      .classList.remove("active");

    document.getElementById("letter-screen")
      .classList.add("active");

    window.scrollTo(0, 0);
  });


// ZARF AÇILMA ANİMASYONU

const envelope = document.getElementById("envelope");
const letterPaper = document.getElementById("letter-paper");
const letterNext = document.getElementById("letter-next");

let letterOpened = false;

envelope.addEventListener("click", () => {
  if (letterOpened) return;

  letterOpened = true;
  envelope.classList.add("open");
  envelope.setAttribute("aria-expanded", "true");

  setTimeout(() => {
    document.getElementById("envelope-scene").style.display = "none";
    document.querySelector(".letter-instruction").style.display = "none";

   letterPaper.hidden = false;
   letterNext.hidden = true;

    letterPaper.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 1600);
});



// MEKTUPTAN SCRAPBOOK'A GEÇİŞ

document.getElementById("letter-next")
  .addEventListener("click", () => {
    document.getElementById("letter-screen")
      .classList.remove("active");

    document.getElementById("scrapbook-screen")
      .classList.add("active");

    window.scrollTo(0, 0);
  });


// SCRAPBOOK İÇERİĞİ
// TOPLAM FOTOĞRAF SAYISI
const totalPhotos = 30;

// İsteğe bağlı başlık ve notlar
// İstemediğin sayfaları buraya eklemene gerek yok.
const pageTexts = {
  1: {
    title: "Biz.",
    note: "beraber geçirdiğimiz günlerden kesitler"
  }, 
  2: {
    title: "",
    note: ""
  },
   3: {
    title: "",
    note: ""
  },
  16: {
    title: "Devamı gelecek",
    note: "defterin sonu değil, daha sonsuz sayfamız var"
  }
};

// FOTOĞRAFLARI OTOMATİK SAYFALARA YERLEŞTİR
const scrapbookPages = [];

// İlk sayfa: tek büyük fotoğraf
scrapbookPages.push({
  title: pageTexts[1]?.title || "",
  note: pageTexts[1]?.note || "",
  photos: [
    { src: "photos/foto1.jpg", caption: "İlk vedamız birbirimize" }
  ]
});

const photoNotes = {
  1: "İlk vedamız birbirimize",
  2: "VUTUTUTUTUTUTUTU",
  3: "Benim için bu kadarsın, demiştin. İnsanın kalbi, yumruğu kadarmış",
  4: "Hastane günlüklerimiz başlamadan önce",
  5: "Az yoğun bakımda çok yoğun sevgi :D",
  6: "Arabanın arka camları filmlidir ya içerisi gözükmez",
  7: "Ellerimi nasıl çekebilirim ki üstünden",
  8: "Sbucks gidip boykota ara vermiştik, mlsf",
  9: "Hareketsizliğimden faydalanan lavuk",
  10: "En biz fotoğrafımız bu, demiştin. Başın omzumda ama elin belimde",
  11: "Hale ile böyle tanışmak iyi oldu, galiba???",
  12: "Aman nereye baktığımız belli olmasın, güneş gözlükleri o yüzden",
  13: "Bir gelenek başlattım kendim için, her geldiğimde burada fotoğraf çekmek hoşuma gidiyor",
  14: "Ufak bir çkale turu yaptırmıştın burda, çanakkale kahvaltısı yapmıştık bir de",
  15: "Sonra biralandık, ilk konuştuğumuz zamanlar beni buraya getireceğini söylemiştin, fıçı Blanc olduğu için",
  16: "bööööö",
  17: "şahsi lavuğum ile günbatımı, parkta biralanıp nöbetçi eczane aradıktan sonra",
  18: "Aşkından öldüğüm lavuğun bana verdiği çiçek",
  19: "Galiba seninle çıktığımız ilk uzun yol öncesi. Çkale-İstanbul",
  20: "Seni hyundai ile gezdirdiğim için üzgünüm... Bunu söylediğimde Toggla midyeci ararken iyiydi, demiştin. O zaman bir kere daha hayatımı seninle geçirmek istediğimi anladım",
  21: "Beni öptüğün ilk ve tek foto bu herhalde",
  22: "Öylesine buluştuğumuz bir gün. Yüzümüzdeki gülümseme gerçek.",
  23: "Gerçekten sevildiğimi hissetmiştim bu gün. Gerçekten sevildiğimi o kadar iyi hissettirdin ki...",
  24: "Başım omzunda, hep bu kadar yakın olabilsem sana keşke",
  25: "Ellerini bırakmayacağım, hiçbir zaman.",
  26: "İkinci yolculuğumuz mu bu? İstanbul çkale bu sefer, arabayı test ettik",
  27: "Mola verdik, defalarca mola versek de önemli değildi. Yürüyüş yaptık, güldük, sadece biz vardık. Önemli olan sadece biz",
  28: "Benim sensörüm, yine bana ötmek için arabayı almaya geliyor benimle",
  29: "Hediyeni çaldığım için özür dilerim :D",

  // Diğer fotoğrafları da buraya ekleyebilirsin
  30: ""
};


 // Ortadaki fotoğraflar: ikişerli
for (let i = 2; i < totalPhotos; i += 2) {
  const pageNumber = scrapbookPages.length + 1;
  const pageText = pageTexts[pageNumber] || {};

  scrapbookPages.push({
    title: pageText.title || "",
    note: pageText.note || "",
    photos: [
      {
        src: `photos/foto${i}.jpg`,
        caption: photoNotes[i] || ""
      },
      {
        src: `photos/foto${i + 1}.jpg`,
        caption: photoNotes[i + 1] || ""
      }
    ]
  });
}

// Son sayfa: tek büyük fotoğraf
const lastPageNumber = scrapbookPages.length + 1;
const lastPageText = pageTexts[lastPageNumber] || {};

scrapbookPages.push({
  title: lastPageText.title || "",
  note: lastPageText.note || "",
  photos: [
    { src: `photos/foto${totalPhotos}.jpg`, caption: "" }
  ]
});


const bookPagesContainer = document.getElementById("book-pages");
const bookCounter = document.getElementById("book-counter");
const bookPrev = document.getElementById("book-prev");
const bookNext = document.getElementById("book-next");
const scrapbookBook = document.getElementById("scrapbook-book");

let currentBookPage = 0;

function renderBookPage(direction = "next") {
  const pageData = scrapbookPages[currentBookPage];

  bookPagesContainer.replaceChildren();

  const page = document.createElement("div");
  page.className = "book-page";
  // Sayfalara sırayla farklı el yapımı stiller ver
const handmadeStyles = [
  "tape",
  "corners",
  "paper",
  "simple"
];

page.dataset.style =
  handmadeStyles[currentBookPage % handmadeStyles.length];
  if (currentBookPage === 0) {
  page.classList.add("first-page");
}

  if (pageData.title) {
  const heading = document.createElement("h3");
  heading.className = "page-heading";
  heading.textContent = pageData.title;
  page.appendChild(heading);
}

  const photoLayout = document.createElement("div");
  photoLayout.className = "photo-layout";

  pageData.photos.forEach(photo => {
    const figure = document.createElement("figure");
    figure.className = "polaroid";
    figure.style.margin = "0";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = photo.caption;

    figure.appendChild(img);
    figure.appendChild(caption);
    photoLayout.appendChild(figure);
  });

  // Tek fotoğraflı sayfada fotoğraf ortalansın
  

  page.appendChild(photoLayout);

 if (pageData.note) {
  const note = document.createElement("p");
  note.className = "page-note";
  note.textContent = pageData.note;
  page.appendChild(note);
}

  const pageNumber = document.createElement("span");
  pageNumber.className = "page-number";
  pageNumber.textContent = currentBookPage + 1;
  page.appendChild(pageNumber);

  bookPagesContainer.appendChild(page);

  // Sayfa çevirme animasyonu
  page.classList.add(
    direction === "next"
      ? "page-turn-next"
      : "page-turn-prev"
  );

  bookCounter.textContent =
    `${currentBookPage + 1} / ${scrapbookPages.length}`;

  bookPrev.disabled = currentBookPage === 0;
  bookNext.disabled =
    currentBookPage === scrapbookPages.length - 1;
}

function changeBookPage(direction) {
  const newPage = currentBookPage + direction;

  if (newPage < 0 || newPage >= scrapbookPages.length) {
    return;
  }

  currentBookPage = newPage;
  renderBookPage(direction > 0 ? "next" : "prev");
}

bookNext.addEventListener("click", () => {
  changeBookPage(1);
});

bookPrev.addEventListener("click", () => {
  changeBookPage(-1);
});

// Bilgisayar için
document.addEventListener("keydown", event => {
  const scrapbookVisible =
    document.getElementById("scrapbook-screen")
      .classList.contains("active");

  if (!scrapbookVisible) return;

  if (event.key === "ArrowRight") {
    changeBookPage(1);
  }

  if (event.key === "ArrowLeft") {
    changeBookPage(-1);
  }
});

// Telefon için 
let touchStartX = 0;
let touchStartY = 0;

scrapbookBook.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

scrapbookBook.addEventListener("touchend", event => {
  const touchEndX = event.changedTouches[0].screenX;
  const touchEndY = event.changedTouches[0].screenY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  if (Math.abs(diffX) > 50 &&
      Math.abs(diffX) > Math.abs(diffY)) {
    changeBookPage(diffX > 0 ? 1 : -1);
  }
}, { passive: true });

// İlk sayfayı hazırla
renderBookPage();

const backgroundMusic = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");

backgroundMusic.volume = 0.25;

function startMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
}

document.querySelectorAll("[data-key]").forEach(button => {
  button.addEventListener("click", startMusic, { once: true });
});

musicToggle.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    startMusic();
  } else {
    backgroundMusic.pause();
  }
});

backgroundMusic.addEventListener("play", () => {
  musicToggle.textContent = "♫";
  musicToggle.setAttribute("aria-label", "Müziği durdur");
});

backgroundMusic.addEventListener("pause", () => {
  musicToggle.textContent = "♪";
  musicToggle.setAttribute("aria-label", "Müziği başlat");
});

/* MEKTUBUN KATLARINI TEK TEK AÇ */

const foldingLetter = document.getElementById("letter-paper");
const foldInstruction = document.getElementById("fold-instruction");
const foldingNextButton = document.getElementById("letter-next");

let openedFolds = 1;

foldingLetter.dataset.fold = "1";

foldingLetter.addEventListener("click", () => {
  if (openedFolds >= 3) return;

  openedFolds++;
  foldingLetter.dataset.fold = String(openedFolds);

  if (openedFolds === 3) {
    foldInstruction.textContent = "";
    foldingNextButton.hidden = false;
  }
});
