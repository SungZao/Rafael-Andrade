const params = new URLSearchParams(window.location.search);
const idFicha = params.get("doc") || "perso11";

const ref = db.collection("personagens2").doc(idFicha);


const vidaTexto = document.getElementById("vidaTexto");
const esforcoTexto = document.getElementById("esforcoTexto");
const nome = document.getElementById("nome");
const fotoIcon = document.getElementById("fotoIcon");

ref.onSnapshot(doc => {
  if (!doc.exists) return;

  const d = doc.data();

  const vidaPct = Math.min((d.vidaAtual / d.vidaMax) * 100, 100);
  const esforcoPct = Math.min((d.esforcoAtual / d.esforcoMax) * 100, 100);
  const nomePct = d.nome


  vidaTexto.textContent = `${d.vidaAtual}/${d.vidaMax}`;
  esforcoTexto.textContent = `${d.esforcoAtual}`;
  nome.textContent = nomePct;

  if (d.fotoURL) fotoIcon.src = d.fotoURL;
});
