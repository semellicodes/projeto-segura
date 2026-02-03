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
