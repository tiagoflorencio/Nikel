// Funções utilitárias globais para o sistema Nikel

// Máscara de moeda para input tipo text
export function maskMoedaInput(input) {
  input.addEventListener("input", function () {
    let v = input.value.replace(/\D/g, "");
    if (!v) {
      input.value = "";
      return;
    }
    v = (parseInt(v, 10) / 100).toFixed(2);
    v = v.replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    input.value = "R$ " + v;
  });
}

// Validação de e-mail
export function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// Validação de senha (mínimo 6 caracteres)
export function isValidPassword(password) {
  return password && password.length >= 6;
}

// Formata valor para moeda brasileira
export function formatBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Extrai valor numérico de input mascarado
export function extractNumberFromMasked(value) {
  let v = value.replace(/\D/g, "");
  return v ? (parseInt(v, 10) / 100).toFixed(2) : "";
}

// Exibe mensagem de feedback
export function showFeedback(
  element,
  message,
  type = "success",
  duration = 2000
) {
  element.textContent = message;
  element.classList.add("alert", `alert-${type}`);
  setTimeout(() => {
    element.textContent = "";
    element.classList.remove("alert", `alert-${type}`);
  }, duration);
}
