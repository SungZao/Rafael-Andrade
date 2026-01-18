let ultimoEstado = {
  vidaAtual: null,
  esforcoAtual: null,
  nome: null
};




const params = new URLSearchParams(window.location.search);
const idFicha = params.get("doc") || "perso11";

const ref = db.collection("personagens2").doc(idFicha);


const vidaTexto = document.getElementById("vidaTexto");
const esforcoTexto = document.getElementById("esforcoTexto");
const nome = document.getElementById("nome");
const fotoIcon = document.getElementById("fotoToken");

ref.onSnapshot(doc => {
  if (!doc.exists) return;

  const d = doc.data();

  const vidaAtual = d.vidaAtual;
  const vidaMax = d.vidaMax;
  const esforcoAtual = d.esforcoAtual;
  const nomeAtual = d.nome;

  // TEXTO
  vidaTexto.textContent = `${vidaAtual}/${vidaMax}`;
  esforcoTexto.textContent = `${esforcoAtual}`;
  nome.textContent = nomeAtual;
  fotoIcon.src = "icons/" + idFicha + ".png";

  // ===== VIDA =====
  if (ultimoEstado.vidaAtual !== null) {
    if (vidaAtual < ultimoEstado.vidaAtual) {
      vidaTexto.classList.add("hit-damage");
      setTimeout(() => vidaTexto.classList.remove("hit-damage"), 500);
    }

    if (vidaAtual > ultimoEstado.vidaAtual) {
      vidaTexto.classList.add("heal");
      setTimeout(() => vidaTexto.classList.remove("heal"), 500);
    }

    if (vidaAtual === 0) {
      vidaTexto.classList.add("dead-shake");
      setTimeout(() => vidaTexto.classList.remove("dead-shake"), 600);
    }
  }

  // ===== ESFORÇO =====
  if (ultimoEstado.esforcoAtual !== null) {
    if (esforcoAtual === 0) {
      esforcoTexto.classList.add("low-effort");
      setTimeout(() => esforcoTexto.classList.remove("low-effort"), 500);
    }
  }

  // SALVA ESTADO
  ultimoEstado.vidaAtual = vidaAtual;
  ultimoEstado.esforcoAtual = esforcoAtual;
  ultimoEstado.nome = nomeAtual;
});


