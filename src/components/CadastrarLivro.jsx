import React, { useState } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
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
    imagemUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("livros")
        .upload(filePath, imageFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("livros")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      setMessage("Erro ao fazer upload da imagem");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.area) {
      setMessage("Por favor, selecione uma área.");
      return;
    }

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return;
      }

      await api.post("/livro", {
        ...formData,
        quantidade: Number(formData.quantidade),
        anoPublicado: Number(formData.anoPublicado),
        imagemUrl: imageUrl || "https://placehold.co/600x400?text=Sem+Imagem",
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
        imagemUrl: "",
      });
      setImageFile(null);

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
          <button onClick={onClose}>✕</button>
        </div>

        <h2 className="text">Cadastrar Livro</h2>

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
              <label htmlFor="area"></label>
              <select
                name="area"
                id="area"
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
              style={{
                width: "400px",
                padding: "15px",
                marginBottom: "15px",
                border: "none",
                borderBottom: "1px solid #dbd9d9",
                backgroundColor: "#ffffff",
              }}
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

            <div className="image-upload-container">
              <label htmlFor="imagem" className="image-upload-label">
                {imageFile ? imageFile.name : "Selecione uma imagem para a capa"}
              </label>
              <input
                type="file"
                id="imagem"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />
              {isUploading && <div className="uploading-text">Enviando imagem...</div>}
            </div>

            <div className="send">
              <button type="submit" disabled={isUploading}>
                {isUploading ? "Enviando..." : "Cadastrar"}
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