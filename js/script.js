// Interações simples do site: abrir o presente, ampliar fotos e revelar uma mensagem.
const openGiftButton = document.querySelector("#open-gift");
const presentContent = document.querySelector("#present-content");
const surpriseButton = document.querySelector("#surprise-button");
const surpriseMessage = document.querySelector("#surprise-message");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeLightboxButton = document.querySelector("#close-lightbox");

openGiftButton.addEventListener("click", () => {
  presentContent.hidden = false;
  openGiftButton.textContent = "aberto ♡";
  openGiftButton.disabled = true;
  presentContent.scrollIntoView({ behavior: "smooth", block: "start" });
  rain(16);
});

surpriseButton.addEventListener("click", () => {
  const isHidden = surpriseMessage.hidden;
  surpriseMessage.hidden = !isHidden;
  surpriseButton.textContent = isHidden ? "esconder a informação" : "tem mais uma coisa";
  if (isHidden) rain(14);
});

document.querySelectorAll(".photo-button").forEach((photoButton) => {
  photoButton.addEventListener("click", () => {
    const imagePath = photoButton.dataset.photo;
    const caption = photoButton.dataset.caption;
    const image = photoButton.querySelector("img");
    lightboxImage.src = imagePath;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption;

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      window.open(imagePath, "_blank", "noopener");
    }
  });
});

closeLightboxButton.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});


// ---- Memes no fundo, na fita e na "chuva" ----
const MEMES = ["papoi", "gato-pirulito", "leao", "desenho", "yorkshire", "cachorro", "unicornio", "chihuahua", "doguinhos", "meowl", "bebe", "gato", "tung"].map((n) => `assets/fotos/meme-${n}.jpg`);
const rng = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const bg = document.createElement("div");
bg.className = "meme-bg";
bg.setAttribute("aria-hidden", "true");
document.body.prepend(bg);

let lastKey = "";
function buildBackground() {
  bg.style.height = "0";
  const h = document.documentElement.scrollHeight;
  const w = window.innerWidth;
  if (`${w}x${h}` === lastKey) { bg.style.height = h + "px"; return; }
  lastKey = `${w}x${h}`;
  bg.style.height = h + "px";
  bg.innerHTML = "";
  const small = w < 720, rand = rng(7), step = small ? 230 : 330;
  let i = 0;
  for (let y = 60; y < h - 120; y += step) {
    [0, 1].forEach((side) => {
      const size = small ? 105 + rand() * 45 : 160 + rand() * 90;
      const img = new Image();
      img.src = MEMES[i++ % MEMES.length];
      img.alt = "";
      img.className = "meme-sticker";
      img.decoding = "async";
      img.style.width = img.style.height = size + "px";
      img.style.top = y + side * (step / 2) + rand() * 60 + "px";
      img.style.left = (side ? w - size * (small ? 0.55 : 0.7) - rand() * w * 0.05 : -size * (small ? 0.45 : 0.3) + rand() * w * 0.05) + "px";
      img.style.transform = `rotate(${(rand() - 0.5) * 40}deg)`;
      img.style.animationDelay = -rand() * 6 + "s";
      bg.appendChild(img);
    });
  }
}

const strip = document.createElement("div");
strip.className = "meme-strip";
strip.setAttribute("aria-hidden", "true");
const track = document.createElement("div");
track.className = "meme-strip-track";
[...MEMES, ...MEMES, ...MEMES, ...MEMES].forEach((src) => {
  const img = new Image();
  img.src = src; img.alt = "";
  track.appendChild(img);
});
strip.appendChild(track);
document.querySelector(".memories").after(strip);

function rain(n) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let k = 0; k < n; k++) {
    const img = new Image();
    img.src = MEMES[k % MEMES.length]; img.alt = "";
    img.className = "meme-rain";
    img.style.left = Math.random() * 92 + "vw";
    img.style.width = 60 + Math.random() * 60 + "px";
    img.style.setProperty("--spin", (Math.random() - 0.5) * 160 + "deg");
    img.style.animationDuration = 2.2 + Math.random() * 2 + "s";
    img.style.animationDelay = Math.random() * 0.9 + "s";
    document.body.appendChild(img);
    setTimeout(() => img.remove(), 5500);
  }
}

let t;
const refresh = () => { clearTimeout(t); t = setTimeout(buildBackground, 150); };
new ResizeObserver(refresh).observe(document.body);
window.addEventListener("load", refresh);
window.addEventListener("resize", refresh);
