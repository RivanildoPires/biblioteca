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

  const carregarDadosUsuario = async () => {
    try {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) throw new Error("Usuário não autenticado");

      const localData = localStorage.getItem(`userData-${usuarioId}`);
      if (localData) {
        const userData = JSON.parse(localData);
        setFormData({
          nome: userData.nome || "",
          email: userData.email || "",
          telefone: userData.telefone || "",
          matricula: userData.matricula || "",
          tipoUsuario: userData.tipoUsuario || userData.tipo || "",
        });
      } else {
        const response = await api.get(`/usuario/${usuarioId}`);
        const userData = response.data;

        localStorage.setItem(`userData-${usuarioId}`, JSON.stringify(userData));

        setFormData({
          nome: userData.nome,
          email: userData.email,
          telefone: userData.telefone,
          matricula: userData.matricula,
          tipoUsuario: userData.tipoUsuario,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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
      if (!usuarioId) throw new Error("Usuário não autenticado");

      const localData = localStorage.getItem(`userData-${usuarioId}`);
      const userData = localData ? JSON.parse(localData) : null;

      if (
        userData &&
        userData.nome === formData.nome &&
        userData.email === formData.email &&
        userData.telefone === formData.telefone
      ) {
        setSuccess("Nenhuma alteração detectada");
        return;
      }

      await api.put(`/usuario/${usuarioId}`, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      });

      const updatedUser = {
        ...userData,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      };

      localStorage.setItem(`userData-${usuarioId}`, JSON.stringify(updatedUser));

      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Erro na atualização:", error);
      setError(
        error.response?.data?.message ||
          "Erro ao atualizar perfil. Tente novamente."
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
        <div className="cont-info">
          <img
            src={MacianoYasuo}
            alt="Foto do perfil"
            className="profile-img"
          />
          <div className="form-container">
            <h2 className="text">Meu Perfil</h2>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <input
                id="nome"
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                id="telefone"
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                pattern="[0-9]{10,11}"
                title="Digite um telefone válido (10 ou 11 dígitos)"
              />

              <div className="send">
                <button
                  type="submit"
                  disabled={loading}
                  className={loading ? "loading" : ""}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
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
