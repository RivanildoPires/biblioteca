import React, { useState } from "react";
import axios from "axios";
import { supabase } from "../supabase";
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
    anoPublicado: "",
  });

  const [imagem, setImagem] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const uploadImagem = async () => {
    if (!imagem) return null;

    const fileExt = imagem.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `livros/${fileName}`;

    const { error } = await supabase.storage
      .from('livros')
      .upload(filePath, imagem);

    if (error) {
      throw new Error('Erro ao enviar imagem: ' + error.message);
    }

    const { data } = supabase.storage
      .from('livros')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.area) {
      setMessage("Por favor, selecione uma área.");
      return;
    }

    try {
      let imagemUrl = null;

      if (imagem) {
        imagemUrl = await uploadImagem();
      }

      await api.post("/livro", {
        ...formData,
        quantidade: Number(formData.quantidade),
        anoPublicado: Number(formData.anoPublicado),
        imagemUrl,
      });

      setMessage("Livro cadastrado com sucesso!");
      setFormData({
        titulo: "",
        area: "",
        autor: "",
        quantidade: "",
        sinopse: "",
        editora: "",
        anoPublicado: "",
      });
      setImagem(null);

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
    <div className="container-modal">
      <div className="conteudo">
        <div className="btn-close">
          <button onClick={onClose}>&times;</button>
        </div>

        <div className="text">Cadastrar Livro</div>

        <div className="form-container">
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
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              >
                <option value=""> Selecione </option>
                {areas.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
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

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="send">
              <button type="submit">Cadastrar</button>
            </div>

            <div className="send" style={{ marginTop: "10px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{ backgroundColor: "#6e6e6e" }}
              >
                Cancelar
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`alert ${
                message.includes("sucesso") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadastrarLivro;
