// Máscara de moeda para input valor
function maskMoedaInput(input) {
  input.addEventListener("input", function () {
    let v = input.value.replace(/\D/g, "");
    v = (parseInt(v, 10) / 100).toFixed(2) + "";
    v = v.replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    input.value = v ? "R$ " + v : "";
  });
}

window.addEventListener("DOMContentLoaded", function () {
  const valorInput = document.getElementById("valor");
  if (valorInput) maskMoedaInput(valorInput);
});

const myModal = new bootstrap.Modal(document.getElementById("modalTransacao"));

window.addEventListener("DOMContentLoaded", function () {
  const formTransacao = document.getElementById("formTransacao");
  if (formTransacao) {
    formTransacao.addEventListener("submit", function (ev) {
      ev.preventDefault();
      let valor = document.getElementById("valor").value.replace(/\D/g, "");
      valor = valor ? (parseInt(valor, 10) / 100).toFixed(2) : "";
      const descricao = document.getElementById("descricao").value.trim();
      const dataLanc = document.getElementById("data").value;
      const tipo = document.querySelector('input[name="tipo"]:checked').value;
      const erroDiv = document.getElementById("transacaoErro");
      erroDiv.textContent = "";
      if (!valor || !descricao || !dataLanc || !tipo) {
        erroDiv.textContent = "Preencha todos os campos.";
        setTimeout(() => {
          erroDiv.textContent = "";
        }, 2000);
        return;
      }
      let logged =
        localStorage.getItem("nikel_session") ||
        sessionStorage.getItem("nikel_session");
      let dataUser = localStorage.getItem(logged);
      let userData = dataUser ? JSON.parse(dataUser) : { transactions: [] };
      const transacao = { valor, descricao, data: dataLanc, tipo };
      userData.transactions = userData.transactions || [];
      userData.transactions.push(transacao);
      localStorage.setItem(logged, JSON.stringify(userData));
      data = userData;
      renderLancamentos();
      myModal.hide();
      formTransacao.reset();
      // Modal de sucesso
      const modalSucesso = new bootstrap.Modal(
        document.getElementById("modalSucesso")
      );
      modalSucesso.show();
      setTimeout(() => {
        modalSucesso.hide();
      }, 2000);
    });
  }
  renderLancamentos();
});

let data = {
  transactions: [],
};

function renderLancamentos() {
  let logged =
    localStorage.getItem("nikel_session") ||
    sessionStorage.getItem("nikel_session");
  let dataUser = localStorage.getItem(logged);
  let userData = dataUser ? JSON.parse(dataUser) : { transactions: [] };
  const entradasCol = document.querySelector("#col-entradas");
  const saidasCol = document.querySelector("#col-saidas");
  const valorTotalEl = document.getElementById("valorTotal");

  if (!entradasCol || !saidasCol || !valorTotalEl) return;
  entradasCol.innerHTML = "";
  saidasCol.innerHTML = "";
  const entradas = userData.transactions.filter((t) => t.tipo === "Entrada");
  const saidas = userData.transactions.filter((t) => t.tipo === "Saída");
  entradas.slice(-4).forEach((t) => {
    const valorFormatado = Number(t.valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    entradasCol.innerHTML += `<div class='mb-3' tabindex='0'><span class='fs-4 fw-bold'>${valorFormatado}</span><div class='d-flex justify-content-between'><span>${t.descricao}</span><span>${t.data}</span></div></div>`;
  });
  saidas.slice(-4).forEach((t) => {
    const valorFormatado = Number(t.valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    saidasCol.innerHTML += `<div class='mb-3' tabindex='0'><span class='fs-4 fw-bold'>${valorFormatado}</span><div class='d-flex justify-content-between'><span>${t.descricao}</span><span>${t.data}</span></div></div>`;
  });
  const totalEntradas = entradas.reduce((acc, t) => acc + Number(t.valor), 0);
  const totalSaidas = saidas.reduce((acc, t) => acc + Number(t.valor), 0);
  const valorTotal = totalEntradas - totalSaidas;
  valorTotalEl.textContent = Number(valorTotal).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

document.getElementById("nav-home").onclick = function () {
  window.location.href = "home.html";
};
document.getElementById("nav-transactions").onclick = function () {
  window.location.href = "transactions.html";
};
document.getElementById("nav-logout").onclick = function () {
  if (typeof clearSession === "function") clearSession();
  window.location.href = "index.html";
};
