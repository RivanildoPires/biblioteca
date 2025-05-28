import React, { useState } from "react";
import "./TelaLogin.css";
import livros from "../assets/livros.jpeg";
import logo from "../assets/logologin.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TelaLogin = () => {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/usuarios/login",
        { matricula, password }
      );

      const data = response.data;

      localStorage.setItem("usuarioId", data.idUsuario);
      localStorage.setItem("tipoUsuario", data.tipoUsuario);
      localStorage.setItem("nomeUsuario", data.nome);

      if (data.tipoUsuario === "BIBLIOTECARIO") {
        navigate("/");
      } else if (data.tipoUsuario === "PROFESSOR") {
        navigate("/");
      } else if (data.tipoUsuario === "ALUNO") {
        navigate("/");
      } else {
        navigate("/material");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Login inválido. Verifique a matrícula e a senha.");
    }
  };

  return (
    <div>
      <main>
        <div id="main-container">
          <div id="banner-container">
            <img src={livros} alt="Livros" />
          </div>
          <div id="form-container">
            <div id="form-box">
              <img id="logo-faculdade" src={logo} alt="Logo da faculdade" />
              <form id="login-form" onSubmit={handleSubmit}>
                <p>Matrícula</p>
                <input
                  id="login"
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  required
                />
                <p>Senha</p>
                <input
                  id="senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <a href="#">Esqueceu a sua senha?</a>
                <input id="submit" type="submit" value="Entrar" />
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TelaLogin;
