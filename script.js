let map;

const iconeAzul = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconeVioleta = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconeVerde = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function iniciarMapa() {
  abrirTela("tela-mapa");

  setTimeout(() => {
    if (map) {
      map.remove();
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        sucessoLocalizacao,
        erroLocalizacao,
      );
    } else {
      alert("Geolocalização não suportada.");
      carregarMapaLeaflet(-23.55052, -46.6333);
    }
  }, 300);
}

function carregarMapaLeaflet(lat, lng) {
  document.getElementById("map").style.height = "100%";

  map = L.map("map").setView([lat, lng], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("<b>Você está aqui</b>")
    .openPopup();

  map.invalidateSize();

  buscarDelegacias(lat, lng);
}

function sucessoLocalizacao(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  carregarMapaLeaflet(lat, lng);
}

function erroLocalizacao() {
  alert("Não conseguimos sua localização. Mostrando mapa geral.");
  carregarMapaLeaflet(-15.793889, -47.882778);
}

function carregarMapaLeaflet(lat, lng) {
  map = L.map("map").setView([lat, lng], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("<b>Você está aqui</b>")
    .openPopup();

  buscarDelegacias(lat, lng);
}

function buscarDelegacias(lat, lng) {
  const query = `
    [out:json];
    (
      node["amenity"="police"](around:15000, ${lat}, ${lng});
      way["amenity"="police"](around:15000, ${lat}, ${lng});
      relation["amenity"="police"](around:15000, ${lat}, ${lng});
    );
    out center;
  `;

  const url =
    "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.elements.forEach((local) => {
        let latitude = local.lat;
        let longitude = local.lon;

        // Se for um prédio (way), pega o centro
        if (!latitude && local.center) {
          latitude = local.center.lat;
          longitude = local.center.lon;
        }

        if (latitude && longitude) {
          criarPino(latitude, longitude, local.tags);
        }
      });
    })
    .catch((err) => console.error("Erro ao buscar delegacias:", err));
}

function criarPino(lat, lng, tags) {
  const nome = (tags.name || "Delegacia sem nome").toLowerCase();
  let iconeUsado = iconeVerde; // Padrão Civil/Outros

  // Lógica de cores
  if (
    nome.includes("mulher") ||
    nome.includes("deam") ||
    nome.includes("ddm")
  ) {
    iconeUsado = iconeVioleta;
  } else if (
    nome.includes("militar") ||
    nome.includes("pm") ||
    nome.includes("batalhão")
  ) {
    iconeUsado = iconeAzul;
  }

  L.marker([lat, lng], { icon: iconeUsado }).addTo(map).bindPopup(`
      <b>${tags.name || "Posto Policial"}</b><br>
      ${tags.phone ? "📞 " + tags.phone : ""}
    `);
}

function abrirTela(idTela) {
  document.getElementById("menu-principal").style.display = "none";

  document
    .querySelectorAll(".tela-conteudo")
    .forEach((t) => (t.style.display = "none"));

  document.getElementById(idTela).style.display = "block";
  window.scrollTo(0, 0);
}

function voltarInicio() {
  document
    .querySelectorAll(".tela-conteudo")
    .forEach((t) => (t.style.display = "none"));
  document.getElementById("menu-principal").style.display = "flex";
}
