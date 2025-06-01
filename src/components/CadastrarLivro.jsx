import React, { useState } from "react";
import "./CadastrarUsuario.css";
import api from "../api";

const CadastrarLivro = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    autor: "",
    titulo: "",
    area: "computacao",
    editora: "",
    anoPublicado: "",
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
      const response = await api.post("/livro", {
        ...formData,
        anoPublicado: parseInt(formData.anoPublicado),
      });
      setSuccess("Livro cadastrado com sucesso!");
      setFormData({
        autor: "",
        titulo: "",
        area: "computacao",
        editora: "",
        anoPublicado: "",
      });
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setError(
        error.response?.data?.message ||
          "Erro ao cadastrar livro. Tente novamente."
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
          <h2 className="text">Cadastrar Livro</h2>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              placeholder="Autor"
              required
            />

            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Título"
              required
            />

            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            >
              <option value="computacao">Computação</option>
              <option value="direito">Direito</option>
              <option value="marketing">Marketing</option>
              <option value="edfisica">Educação Física</option>
            </select>

            <input
              type="text"
              name="editora"
              value={formData.editora}
              onChange={handleChange}
              placeholder="Editora"
              required
            />

            <input
              type="number"
              name="anoPublicado"
              value={formData.anoPublicado}
              onChange={handleChange}
              placeholder="Ano de Publicação"
              required
              min="1000"
              max={new Date().getFullYear()}
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
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar Livro"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastrarLivro;
