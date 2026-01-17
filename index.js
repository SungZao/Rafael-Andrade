// ===== FIREBASE =====
const urlParams = new URLSearchParams(window.location.search);
const idFicha = urlParams.get("doc") || "perso11";
const personagemRef = db.collection("personagens2").doc(idFicha);

let escrevendoLocal = false;
let fichaAtual = {};

// ===== INPUTS =====
const nomeInput = document.getElementById("nome");
const jogadorInput = document.getElementById("jogador");
const origemInput = document.getElementById("origem");
const classeInput = document.getElementById("classe");
const nexInput = document.getElementById("nex");

const atributosInputs = {
  for: document.getElementById("for"),
  agi: document.getElementById("agi"),
  int: document.getElementById("int"),
  pre: document.getElementById("pre"),
  vig: document.getElementById("vig")
};

// ===== STATS =====
const stats = {
  vida: { atual: 0, max: 1 },
  esforco: { atual: 0, max: 1 }
};

function numSeguro(v, f = 0) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : f;
}

function updateStat(nome) {
  const s = stats[nome];
  document.getElementById(nome + "Atual").value = s.atual;
  document.getElementById(nome + "Max").value = s.max;

  document.getElementById(nome + "Fill").style.width =
    Math.min((s.atual / s.max) * 100, 100) + "%";
}

["vida", "esforco"].forEach(stat => {
  const atual = document.getElementById(stat + "Atual");
  const max = document.getElementById(stat + "Max");

  atual.oninput = () => {
    stats[stat].atual = numSeguro(atual.value);
    updateStat(stat);
    salvarAuto();
  };

  max.oninput = () => {
    stats[stat].max = numSeguro(max.value, 1);
    updateStat(stat);
    salvarAuto();
  };
});

function changeStat(nome, delta) {
  stats[nome].atual = Math.max(0, stats[nome].atual + delta);
  updateStat(nome);
  salvarAuto();
}
personagemRef.get().then(doc => {
  if (!doc.exists) {
    personagemRef.set({
      nome: "",
      atributos: {
        for: 0, agi: 0, int: 0, pre: 0, vig: 0
      },
      vidaAtual: 10,
      vidaMax: 10,
      esforcoAtual: 5,
      esforcoMax: 5
    });
  }
});


// ===== SNAPSHOT =====
personagemRef.onSnapshot(doc => {
  if (!doc.exists || escrevendoLocal) return;

  fichaAtual = doc.data();

  nomeInput.value = fichaAtual.nome || "";
  jogadorInput.value = fichaAtual.jogador || "";
  origemInput.value = fichaAtual.origem || "";
  classeInput.value = fichaAtual.classe || "";
  nexInput.value = fichaAtual.nex || 0;

  if (fichaAtual.fotoURL) fotoIcon.src = fichaAtual.fotoURL;

const atr = fichaAtual.atributos || {
  for: 0,
  agi: 0,
  int: 0,
  pre: 0,
  vig: 0
};

  Object.keys(atributosInputs).forEach(k => {
    atributosInputs[k].value = atr[k] || 0;
  });

  ["vida", "esforco"].forEach(stat => {
  stats[stat].max = numSeguro(fichaAtual[stat + "Max"], 10);
  stats[stat].atual = numSeguro(fichaAtual[stat + "Atual"], stats[stat].max);
  updateStat(stat);
});

});

// ===== AUTOSAVE =====
let saveTimeout = null;

function salvarAuto() {
  escrevendoLocal = true;
  clearTimeout(saveTimeout);

  saveTimeout = setTimeout(async () => {
    fichaAtual = {
      nome: nomeInput.value,
      jogador: jogadorInput.value,
      origem: origemInput.value,
      classe: classeInput.value,
      nex: numSeguro(nexInput.value),
      atributos: Object.fromEntries(
        Object.entries(atributosInputs).map(([k, i]) => [k, numSeguro(i.value)])
      ),
      vidaAtual: stats.vida.atual,
      vidaMax: stats.vida.max,
      esforcoAtual: stats.esforco.atual,
      esforcoMax: stats.esforco.max
    };

    await personagemRef.set(fichaAtual, { merge: true });
    escrevendoLocal = false;
  }, 300);
}

document.querySelectorAll("input").forEach(i =>
  i.addEventListener("input", salvarAuto)
);
