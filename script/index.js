window.addEventListener("DOMContentLoaded", function () {
  // Limpa sessão temporária ao abrir tela de login
  sessionStorage.removeItem("nikel_session");

  var formCadastro = document.getElementById("formCadastro");
  if (formCadastro) {
    formCadastro.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const email = document.getElementById("cadEmail").value.trim();
      const nome = document.getElementById("cadNome").value.trim();
      const senha = document.getElementById("cadSenha").value;
      const erroDiv = document.getElementById("cadastroErro");
      erroDiv.textContent = "";
      if (!email || !nome || !senha) {
        erroDiv.textContent = "Preencha todos os campos.";
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        erroDiv.textContent = "E-mail inválido.";
        return;
      }
      if (emailExists(email)) {
        erroDiv.textContent = "E-mail já cadastrado.";
        return;
      }
      saveUser({ email, nome, password: senha });
      // Salva dados do usuário usando o e-mail como chave
      localStorage.setItem(
        email,
        JSON.stringify({ email, nome, password: senha, transactions: [] })
      );
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalCadastro")
      );
      modal.hide();
      alert("Conta criada com sucesso!");
    });
  }

  // Login
  var btnLogin = document.querySelector(".button-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", function () {
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("password").value;
      const remember = document.getElementById("remember").checked;
      let erroMsg = "";
      if (!email) erroMsg = "E-mail é obrigatório.";
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
        erroMsg = "E-mail inválido.";
      else if (!senha) erroMsg = "Senha é obrigatória.";
      else {
        const user = findUser(email, senha);
        if (!user)
          erroMsg = "E-mail ou senha incorretos ou usuário não cadastrado.";
      }
      let erroDiv = document.getElementById("loginErro");
      if (!erroMsg) {
        setSession(email, remember);
        // Garante que os dados do usuário estão salvos
        const user = findUser(email, senha);
        if (user) {
          // Mantém os dados e transações já salvos no localStorage
          const userLocal = localStorage.getItem(email);
          if (!userLocal) {
            localStorage.setItem(
              email,
              JSON.stringify({ ...user, transactions: user.transactions || [] })
            );
          }
        }
        window.location.href = "home.html";
      } else {
        if (!erroDiv) {
          erroDiv = document.createElement("div");
          erroDiv.id = "loginErro";
          erroDiv.className = "text-danger mb-2";
          document.querySelector("form").prepend(erroDiv);
        }
        erroDiv.textContent = erroMsg;
      }
    });
  }

  // Autologin apenas se "permanecer conectado" (localStorage)
  const persistentSession = localStorage.getItem("nikel_session");
  if (persistentSession && !sessionStorage.getItem("nikel_session")) {
    sessionStorage.setItem("nikel_session", persistentSession);
    window.location.href = "home.html";
  }

  // Funções de autenticação e manipulação de usuários no localStorage

  function getUsers() {
    return JSON.parse(localStorage.getItem("nikel_users") || "[]");
  }

  function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("nikel_users", JSON.stringify(users));
  }

  function findUser(email, password) {
    const users = getUsers();
    return users.find((u) => u.email === email && u.password === password);
  }

  function emailExists(email) {
    const users = getUsers();
    return users.some((u) => u.email === email);
  }

  function setSession(email, remember) {
    // Remove apenas a chave de sessão, não apaga dados do usuário
    localStorage.removeItem("nikel_session");
    sessionStorage.removeItem("nikel_session");
    if (remember) {
      localStorage.setItem("nikel_session", email);
    } else {
      sessionStorage.setItem("nikel_session", email);
    }
  }

  function getSession() {
    return (
      localStorage.getItem("nikel_session") ||
      sessionStorage.getItem("nikel_session")
    );
  }

  function clearSession() {
    // Apenas remove a sessão, não apaga dados do usuário
    localStorage.removeItem("nikel_session");
    sessionStorage.removeItem("nikel_session");
  }
});
