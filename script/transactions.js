// Função para abrir modal de edição de transação
function abrirModalEditarTransacao(idx) {
  let logged =
    localStorage.getItem("nikel_session") ||
    sessionStorage.getItem("nikel_session");
  let dataUser = localStorage.getItem(logged);
  let userData = dataUser ? JSON.parse(dataUser) : { transactions: [] };
  const t = userData.transactions[idx];
  if (!t) return;
  // Preenche campos do modal
  document.getElementById("editarValor").value = t.valor
    ? `R$ ${Number(t.valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`
    : "";
  document.getElementById("editarDescricao").value = t.descricao;
  document.getElementById("editarData").value = t.data;
  document.getElementById("editarEntrada").checked = t.tipo === "Entrada";
  document.getElementById("editarSaida").checked = t.tipo === "Saída";
  document.getElementById("editarTransacaoErro").textContent = "";
  document.getElementById("formEditarTransacao").setAttribute("data-idx", idx);
  const modalEditar = new bootstrap.Modal(
    document.getElementById("modalEditarTransacao")
  );
  modalEditar.show();
}

// Máscara para campo de valor no modal de edição
window.addEventListener("DOMContentLoaded", function () {
  // Adição de transação
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
      renderLancamentosTransactions();
      const modalTransacao = bootstrap.Modal.getInstance(
        document.getElementById("modalTransacao")
      );
      modalTransacao.hide();
      formTransacao.reset();
      setTimeout(() => {
        const modalSucesso = new bootstrap.Modal(
          document.getElementById("modalSucesso")
        );
        modalSucesso.show();
        setTimeout(() => {
          modalSucesso.hide();
        }, 2000);
      }, 300);
    });
  }
  const editarValorInput = document.getElementById("editarValor");
  if (editarValorInput) maskMoedaInput(editarValorInput);
});

// Evento de salvar edição
window.addEventListener("DOMContentLoaded", function () {
  const formEditar = document.getElementById("formEditarTransacao");
  if (formEditar) {
    formEditar.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const idx = this.getAttribute("data-idx");
      let valor = document
        .getElementById("editarValor")
        .value.replace(/\D/g, "");
      valor = valor ? (parseInt(valor, 10) / 100).toFixed(2) : "";
      const descricao = document.getElementById("editarDescricao").value.trim();
      const dataLanc = document.getElementById("editarData").value;
      const tipo = document.querySelector(
        'input[name="editarTipo"]:checked'
      ).value;
      const erroDiv = document.getElementById("editarTransacaoErro");
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
      userData.transactions[idx] = { valor, descricao, data: dataLanc, tipo };
      localStorage.setItem(logged, JSON.stringify(userData));
      renderLancamentosTransactions();
      const modalEditar = bootstrap.Modal.getInstance(
        document.getElementById("modalEditarTransacao")
      );
      modalEditar.hide();
      setTimeout(() => {
        const modalSucessoEdicao = new bootstrap.Modal(
          document.getElementById("modalSucessoEdicao")
        );
        modalSucessoEdicao.show();
        setTimeout(() => {
          modalSucessoEdicao.hide();
        }, 2000);
      }, 300);
    });
    // Evento de excluir
    document.getElementById("btnExcluirTransacao").onclick = function () {
      const idx = formEditar.getAttribute("data-idx");
      let logged =
        localStorage.getItem("nikel_session") ||
        sessionStorage.getItem("nikel_session");
      let dataUser = localStorage.getItem(logged);
      let userData = dataUser ? JSON.parse(dataUser) : { transactions: [] };
      userData.transactions.splice(idx, 1);
      localStorage.setItem(logged, JSON.stringify(userData));
      renderLancamentosTransactions();
      const modalEditar = bootstrap.Modal.getInstance(
        document.getElementById("modalEditarTransacao")
      );
      modalEditar.hide();
      setTimeout(() => {
        const modalSucessoExclusao = new bootstrap.Modal(
          document.getElementById("modalSucessoExclusao")
        );
        modalSucessoExclusao.show();
        setTimeout(() => {
          modalSucessoExclusao.hide();
        }, 2000);
      }, 300);
    };
  }
});
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
  renderLancamentosTransactions();
});

function renderLancamentosTransactions() {
  let logged =
    localStorage.getItem("nikel_session") ||
    sessionStorage.getItem("nikel_session");
  let dataUser = localStorage.getItem(logged);
  let userData = dataUser ? JSON.parse(dataUser) : { transactions: [] };
  const tbody = document.querySelector(".table-group-divider");
  if (!tbody) return;
  tbody.innerHTML = "";
  userData.transactions.forEach((t, idx) => {
    const valorFormatado = Number(t.valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    tbody.innerHTML += `<tr>
      <th scope='row'>${t.data}</th>
      <td>${valorFormatado}</td>
      <td>${t.tipo}</td>
      <td>${t.descricao}</td>
      <td>
        <button class='btn btn-link p-0 edit-transacao' data-idx='${idx}' title='Editar'>
          <i class='fa fa-pencil-alt' style='color:#5c02b1;font-size:1.2rem;'></i>
        </button>
      </td>
    </tr>`;
  });
  // Adiciona evento aos botões de editar
  document.querySelectorAll(".edit-transacao").forEach((btn) => {
    btn.onclick = function () {
      const idx = this.getAttribute("data-idx");
      abrirModalEditarTransacao(idx);
    };
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
