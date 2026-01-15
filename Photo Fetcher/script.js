
const grid = document.querySelector('.grid');
const fetchBtn = document.getElementById('fetch-btn');
const moreBtn = document.getElementById('morePhotos');
const toggle = document.querySelector('.toggle input');

let photos = [];
let displayedPhotos = [];
const photosPerLoad = 4;

let page = 1;
const limit = 100;

toggle.checked = localStorage.getItem('grayscale') === 'true';

function showLoader(count = photosPerLoad) {
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="loader"></div>`;
    grid.appendChild(card);
  }
}

async function getRandomPhotos(count) {
  const selected = [];

  while (selected.length < count) {
    if (photos.length === 0) {
      page++;
      await fetchPhotos(false); 
    }

    const index = Math.floor(Math.random() * photos.length);
    selected.push(photos.splice(index, 1)[0]);
  }

  return selected;
}

async function fetchPhotos(render = true) {
  showLoader();

  const res = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
  );
  const data = await res.json();

  photos = photos.concat(data);

  if (render) {
    displayedPhotos = await getRandomPhotos(photosPerLoad);
    renderPhotos();
  }
}

function renderPhotos() {
  grid.innerHTML = '';

  displayedPhotos.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = `https://picsum.photos/id/${photo.id}/600/400`;
    img.alt = photo.author;
    img.style.filter = toggle.checked ? 'grayscale(100%)' : 'none';
    img.style.display = 'none';

    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const author = document.createElement('div');
    author.className = 'author';
    author.textContent = photo.author;

    const link = document.createElement('a');
    link.className = 'link';
    link.href = photo.url;
    link.target = '_blank';
    link.textContent = photo.url;

    overlay.appendChild(author);
    overlay.appendChild(link);

    const loader = document.createElement('div');
    loader.className = 'loader';

    img.onload = () => {
      loader.remove();
      img.style.display = 'block';
    };

    card.appendChild(img);
    card.appendChild(overlay);
    card.appendChild(loader);
    grid.appendChild(card);
  });
}

toggle.addEventListener('change', () => {
  const isGray = toggle.checked;
  localStorage.setItem('grayscale', isGray);

  document.querySelectorAll('.card img').forEach(img => {
    img.style.filter = isGray ? 'grayscale(100%)' : 'none';
  });
});

fetchBtn.addEventListener('click', () => {
  page = 1;
  photos = [];
  displayedPhotos = [];
  fetchPhotos();
});

moreBtn.addEventListener('click', async () => {
  const newPhotos = await getRandomPhotos(photosPerLoad);
  displayedPhotos = displayedPhotos.concat(newPhotos);
  renderPhotos();
});

fetchPhotos();
