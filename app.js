const stems = [
  "01-IMG_3965", "02-IMG_3966", "03-IMG_3967", "04-IMG_3968", "05-IMG_3969",
  "06-IMG_3973", "07-IMG_3974", "08-IMG_3976", "09-IMG_3979", "10-IMG_3980",
  "11-IMG_3981", "12-IMG_3982", "13-IMG_3988", "14-IMG_3992", "15-IMG_3995",
  "16-IMG_3996", "17-IMG_3999", "18-IMG_4003", "19-IMG_4004", "20-IMG_4008",
  "21-IMG_4009", "22-IMG_4010", "23-IMG_4011", "24-IMG_4012", "25-IMG_4013",
  "26-IMG_4014", "27-IMG_4016", "28-IMG_4019", "29-IMG_4020", "30-IMG_4023",
  "31-IMG_4026", "32-IMG_4027", "33-IMG_4028", "34-IMG_4029", "35-IMG_4034",
  "36-IMG_4036", "37-IMG_4039", "38-IMG_4040", "39-IMG_4041", "40-IMG_4042",
  "41-IMG_4043", "42-IMG_4044", "43-IMG_4045", "44-IMG_4049", "45-IMG_4052",
  "46-IMG_4055", "47-IMG_4058", "48-IMG_4059", "49-IMG_4060", "50-IMG_4068",
];

const solos = new Set(["01-IMG_3965", "12-IMG_3982", "21-IMG_4009", "33-IMG_4028", "50-IMG_4068"]);
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

const photos = stems.map((stem, index) => {
  const n = String(index + 1).padStart(2, "0");
  return {
    n,
    stem,
    solo: solos.has(stem),
    thumb: `photos/thumb/${stem}.jpg`,
    full: `photos/full/${stem}.jpg`,
    alt: `Registro ${n} do Kickoff de Vendas ADN. Camisetas amarelas: é agora ou nunca, não amarela.`,
  };
});

const chunks = [photos.slice(0, 16), photos.slice(16, 34), photos.slice(34)];
const film = document.querySelector("[data-film]");
const counter = document.querySelector("[data-counter]");
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu");
const registro = document.querySelector(".registro");
const progress = document.querySelector("[data-progress]");
const dialog = document.querySelector("[data-lightbox]");
const stage = dialog.querySelector("[data-stage]");
const lbImg = dialog.querySelector("[data-lb-img]");
const lbCap = dialog.querySelector("[data-lb-cap]");
const intro = document.querySelector("[data-intro]");

const thumbLinks = [];
let active = -1;
let current = 0;
let touchX = null;
let zoom = 1;
let panX = 0;
let panY = 0;
let dragging = false;
let dragStart = null;

function applyZoom() {
  lbImg.style.setProperty("--z", String(zoom));
  lbImg.style.setProperty("--x", `${panX}px`);
  lbImg.style.setProperty("--y", `${panY}px`);
}

function resetZoom() {
  zoom = 1;
  panX = 0;
  panY = 0;
  applyZoom();
}

function plate(photo, eager) {
  const figure = document.createElement("figure");
  figure.className = photo.solo ? "plate solo" : "plate";
  figure.id = `foto-${photo.n}`;

  const shot = document.createElement("div");
  shot.className = "shot";

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.open = photo.n;
  button.setAttribute("aria-label", `Abrir foto ${photo.n}`);

  const img = document.createElement("img");
  img.src = photo.thumb;
  img.srcset = `${photo.thumb} 640w, ${photo.full} 1600w`;
  img.sizes = photo.solo ? "(max-width: 860px) 92vw, 40rem" : "(max-width: 860px) 92vw, 36vw";
  img.width = 1600;
  img.height = 2400;
  img.alt = photo.alt;
  img.decoding = "async";
  if (!eager) img.loading = "lazy";

  const caption = document.createElement("p");
  caption.className = "plate-meta";
  const number = document.createElement("span");
  number.textContent = photo.n;
  const name = document.createElement("span");
  name.textContent = "Não amarela";
  caption.append(number, name);

  button.append(img);
  shot.append(button, caption);
  figure.append(shot);

  if (finePointer.matches && !motion.matches) {
    button.addEventListener("pointermove", (event) => {
      const r = button.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - 0.5;
      const y = (event.clientY - r.top) / r.height - 0.5;
      button.style.setProperty("--ry", `${x * 10}deg`);
      button.style.setProperty("--rx", `${-y * 8}deg`);
    });
    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--ry", "0deg");
      button.style.setProperty("--rx", "0deg");
    });
  }

  return figure;
}

function thumbLink(photo) {
  const link = document.createElement("a");
  link.href = `#foto-${photo.n}`;
  link.setAttribute("aria-label", `Foto ${photo.n}`);

  const img = document.createElement("img");
  img.src = photo.thumb;
  img.alt = "";
  img.width = 640;
  img.height = 960;
  img.decoding = "async";
  img.loading = "lazy";

  const number = document.createElement("span");
  number.textContent = photo.n;
  link.append(img, number);
  return link;
}

document.querySelectorAll("[data-album]").forEach((album) => {
  const group = chunks[Number(album.dataset.album)];
  group.forEach((photo, index) => {
    const eager = album.dataset.album === "0" && index < 2;
    album.append(plate(photo, eager));
  });
});

photos.forEach((photo) => {
  const link = thumbLink(photo);
  film.append(link);
  thumbLinks.push(link);
});

const rise = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-in");
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
);
document.querySelectorAll(".plate").forEach((item) => rise.observe(item));

function centerThumb(link) {
  const left = link.offsetLeft - (film.clientWidth - link.clientWidth) / 2;
  film.scrollTo({ left, behavior: motion.matches ? "auto" : "smooth" });
}

function setActive(index) {
  if (index === active || index < 0) return;
  active = index;
  thumbLinks.forEach((link, i) => {
    const on = i === index;
    link.classList.toggle("is-active", on);
    if (on) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  counter.hidden = false;
  counter.textContent = `${photos[index].n} / ${photos.length}`;
  centerThumb(thumbLinks[index]);
}

const plateObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = photos.findIndex((photo) => `foto-${photo.n}` === visible.target.id);
    if (index >= 0) setActive(index);
  },
  { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.25, 0.6] },
);

document.querySelectorAll(".plate").forEach((item) => plateObserver.observe(item));

const registroObserver = new IntersectionObserver(
  ([entry]) => {
    counter.hidden = !entry.isIntersecting;
  },
  { threshold: 0 },
);
registroObserver.observe(registro);

function paintProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${value})`;
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    paintProgress();
    ticking = false;
  });
}, { passive: true });
paintProgress();

function setMenu(open) {
  header.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "Fechar" : "Menu";
}

menuButton.addEventListener("click", () => {
  setMenu(!header.classList.contains("is-open"));
});

header.querySelectorAll(".toc a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("is-open") && !dialog.open) {
    setMenu(false);
  }
});

window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

let filmDrag = null;
film.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse") {
    filmDrag = { x: event.clientX, left: film.scrollLeft };
    film.setPointerCapture(event.pointerId);
  }
});
film.addEventListener("pointermove", (event) => {
  if (!filmDrag) return;
  film.scrollLeft = filmDrag.left - (event.clientX - filmDrag.x);
});
film.addEventListener("pointerup", () => {
  filmDrag = null;
});

function preload(index) {
  const photo = photos[(index + photos.length) % photos.length];
  const img = new Image();
  img.src = photo.full;
}

function show(index) {
  current = (index + photos.length) % photos.length;
  const photo = photos[current];
  resetZoom();
  lbImg.classList.remove("is-in");
  lbImg.alt = photo.alt;
  lbCap.textContent = `${photo.n} / ${photos.length} · Não amarela`;

  const reveal = () => lbImg.classList.add("is-in");
  lbImg.onload = reveal;
  lbImg.src = photo.full;
  if (lbImg.complete) reveal();
  preload(current + 1);
  preload(current - 1);
}

function openAt(n) {
  const index = photos.findIndex((photo) => photo.n === n);
  show(index < 0 ? 0 : index);
  if (!dialog.open) dialog.showModal();
  dialog.querySelector("[data-close]").focus();
}

document.body.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-open]");
  if (!opener) return;
  openAt(opener.dataset.open);
});

dialog.querySelector("[data-prev]").addEventListener("click", () => show(current - 1));
dialog.querySelector("[data-next]").addEventListener("click", () => show(current + 1));
dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog || event.target === stage) dialog.close();
});

dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    show(current + 1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    show(current - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    show(0);
  } else if (event.key === "End") {
    event.preventDefault();
    show(photos.length - 1);
  } else if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    zoom = Math.min(3.2, zoom + 0.2);
    applyZoom();
  } else if (event.key === "-") {
    event.preventDefault();
    zoom = Math.max(1, zoom - 0.2);
    if (zoom === 1) {
      panX = 0;
      panY = 0;
    }
    applyZoom();
  }
});

stage.addEventListener("wheel", (event) => {
  if (!dialog.open) return;
  event.preventDefault();
  const next = Math.min(3.2, Math.max(1, zoom + (event.deltaY < 0 ? 0.12 : -0.12)));
  zoom = next;
  if (zoom === 1) {
    panX = 0;
    panY = 0;
  }
  applyZoom();
}, { passive: false });

lbImg.addEventListener("pointerdown", (event) => {
  if (zoom <= 1) return;
  dragging = true;
  dragStart = { x: event.clientX - panX, y: event.clientY - panY };
  lbImg.setPointerCapture(event.pointerId);
});

lbImg.addEventListener("pointermove", (event) => {
  if (!dragging || !dragStart) return;
  panX = event.clientX - dragStart.x;
  panY = event.clientY - dragStart.y;
  applyZoom();
});

lbImg.addEventListener("pointerup", () => {
  dragging = false;
  dragStart = null;
});

dialog.addEventListener("touchstart", (event) => {
  touchX = event.changedTouches[0].clientX;
}, { passive: true });

dialog.addEventListener("touchend", (event) => {
  if (touchX == null || zoom > 1) return;
  const delta = event.changedTouches[0].clientX - touchX;
  if (Math.abs(delta) > 48) show(current + (delta < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

dialog.addEventListener("close", () => {
  lbImg.classList.remove("is-in");
  resetZoom();
});

if (intro && !motion.matches) {
  intro.addEventListener("animationend", () => intro.classList.add("is-gone"));
} else if (intro) {
  intro.classList.add("is-gone");
}

if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) target.scrollIntoView();
}
