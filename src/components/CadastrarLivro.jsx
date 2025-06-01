import React, { useState } from "react";
import axios from "axios";
import "./CadastrarUsuario.css";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const areas = [
  { label: "Ciências da Computação", value: "computacao" },
  { label: "Direito", value: "direito" },
  { label: "Educação Física", value: "edfisica" },
  { label: "Marketing", value: "marketing" },
  { label: "Matemática", value: "matematica" },
];

const CadastrarLivro = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    area: "",
    autor: "",
    quantidade: "",
    sinopse: "",
    editora: "",
    anoPublicado: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAreaSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      area: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.area) {
      setMessage("Por favor, selecione uma área.");
      return;
    }

    try {
      await api.post("/livro", {
        ...formData,
        quantidade: Number(formData.quantidade),
        anoPublicado: Number(formData.anoPublicado)
      });

      setMessage("Livro cadastrado com sucesso!");
      setFormData({
        titulo: "",
        area: "",
        autor: "",
        quantidade: "",
        sinopse: "",
        editora: "",
        anoPublicado: ""
      });

      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Erro ao cadastrar livro. Tente novamente."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Cadastrar Livro</h2>
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={formData.titulo}
            onChange={handleChange}
            required
          />

          <div className="area-selector">
            <p>Selecione a Área:</p>
            <ul>
              {areas.map(({ label, value }) => (
                <li
                  key={value}
                  className={formData.area === value ? "selected" : ""}
                  onClick={() => handleAreaSelect(value)}
                  style={{ cursor: "pointer", padding: "5px 10px" }}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <input
            type="text"
            name="autor"
            placeholder="Autor"
            value={formData.autor}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantidade"
            placeholder="Quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            min="1"
            required
          />
          <textarea
            name="sinopse"
            placeholder="Sinopse"
            value={formData.sinopse}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="editora"
            placeholder="Editora"
            value={formData.editora}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="anoPublicado"
            placeholder="Ano de Publicação"
            value={formData.anoPublicado}
            onChange={handleChange}
            min="1990"
            required
          />

          <button type="submit">Cadastrar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CadastrarLivro;
