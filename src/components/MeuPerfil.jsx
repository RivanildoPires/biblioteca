import React, { useState, useEffect } from "react";
import "./MeuPerfil.css";
import MacianoYasuo from "../assets/MacianoYasuo.jpg";
import api from "../api";

const MeuPerfil = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    matricula: "",
    tipoUsuario: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      carregarDadosUsuario();
    }
  }, [isOpen]);

  const carregarDadosUsuario = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!userData) {
        setError("Dados do usuário não encontrados");
        return;
      }

      setFormData({
        nome: userData.nome || "",
        email: userData.email || "",
        telefone: userData.telefone || "",
        matricula: userData.matricula || "",
        tipoUsuario: userData.tipo || "",
      });
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
      setError("Erro ao carregar perfil");
    }
  };

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
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) {
        throw new Error("Usuário não autenticado");
      }
      const dadosParaEnviar = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      };

      await api.put(`/usuario/${usuarioId}`, dadosParaEnviar);

      const updatedUserData = {
        ...JSON.parse(localStorage.getItem("userData")),
        ...dadosParaEnviar,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setError(error.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="container-modal">
      <div className="conteudo">
        <div className="btn-close">
          <button onClick={onClose}>X</button>
        </div>
        <div className="cont-info">
          <img src={MacianoYasuo} alt="Foto do perfil" />
          <div className="form-container">
            <h2 className="text">Meu Perfil</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
              />

              <div className="send">
                <button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;
