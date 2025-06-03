import React, { useState } from "react";
import "./TelaLogin.css";
import telalogin from "../assets/tela-login.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TelaLogin = () => {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { matricula, password }
      );

      const data = response.data;

      localStorage.setItem("userData", JSON.stringify({
        id: data.idUsuario,
        tipo: data.tipoUsuario,
        nome: data.nome,
        email: data.email || "",
        telefone: data.telefone || "",
      }));

      const tipoUsuario = data.tipoUsuario?.toLowerCase();

      switch (tipoUsuario) {
        case "bibliotecario":
        case "professor":
        case "aluno":
          navigate("/telaInicial");
          break;
        default:
          setError("Tipo de usuário desconhecido.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Login inválido. Verifique a matrícula e a senha.");
    }
  };

  return (
    <div>
      <main>
        <div id="main-container">
          <div id="form-container">
            <div id="form-box">
              <img id="logo-faculdade" src={telalogin} alt="Logo da bibliteca" />
              <form id="login-form" onSubmit={handleSubmit}>
                <input
                  id="login"
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="Matricula"
                  required
                />
                <input
                  id="senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  required
                />
                {error && <p className="error-message">{error}</p>}
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
