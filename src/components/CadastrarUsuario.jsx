import React, { useState } from "react";
import "./CadastrarUsuario.css";
import api from "../api";

const CadastrarUsuario = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    matricula: "",
    password: "",
    nome: "",
    email: "",
    telefone: "",
    tipoUsuario: "aluno",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/usuario", formData);
      setSuccess("Usuário cadastrado com sucesso!");
      setFormData({
        matricula: "",
        password: "",
        nome: "",
        email: "",
        telefone: "",
        tipoUsuario: "aluno",
      });
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setError(
        error.response?.data?.message ||
          "Erro ao cadastrar usuário. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="container-modal">
      <div className="conteudo">
        <div className="btn-close">
          <button onClick={onClose}>✕</button>
        </div>
        <div className="form-container">
          <h2 className="text">Cadastrar Usuário</h2>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              placeholder="Matrícula"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password} 
              onChange={handleChange}
              placeholder="Senha"
              required
            />

            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Telefone"
              required
              pattern="[0-9]{10,11}"
              title="Digite um telefone válido (10 ou 11 dígitos)"
            />
            
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="bibliotecario">Bibliotecário</option>
              <option value="professor">Professor</option>
              <option value="aluno">Aluno</option>
            </select>

            <div className="send">
              <button
                type="submit"
                disabled={loading}
                className={loading ? "loading" : ""}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar Usuário"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastrarUsuario;
