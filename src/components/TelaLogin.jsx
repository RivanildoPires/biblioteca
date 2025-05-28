import React from "react";
import "./TelaLogin.css"
import livros from "../assets/livros.jpeg"
import logo from "../assets/logologin.png"

const TelaLogin = () => {
  return (
    <div>
      <main>
        <div id="main-container">
          <div id="banner-container">
            <img
              src={livros}
              alt="Livros"
            />
          </div>
          <div id="form-container">
            <div id="form-box">
              <img
                id="logo-faculdade"
                src={logo}
                alt="Logo da faculdade"
              />
              <form id="login-form">
                <p>E-mail</p>
                <input id="login" type="text" alt="e-mail" required="" />
                <p>Senha</p>
                <input id="senha" type="password" name="password" required="" />
                <a href="#">Esqueceu a sua senha?</a>
                <input id="submit" type="submit" name="Entrar" />
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TelaLogin;
