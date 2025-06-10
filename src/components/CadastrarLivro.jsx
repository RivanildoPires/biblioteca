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
  const [modo, setModo] = useState("livro");
  const [formData, setFormData] = useState({
    titulo: "",
    area: "",
    autor: "",
    quantidade: "",
    sinopse: "",
    editora: "",
    anoPublicado: "",
  });
  const [materialData, setMaterialData] = useState({
    titulo: "",
    area: "",
    autor: "",
    sinopse: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e, isMaterial = false) => {
    const { name, value } = e.target;
    if (isMaterial) {
      setMaterialData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    if (e.target.files[0]) setPdfFile(e.target.files[0]);
  };

  const uploadToSupabase = async (file, folder) => {
    if (!file) return null;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const name = `${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from(folder).upload(name, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(folder).getPublicUrl(name);
      return publicUrl;
    } catch (err) {
      console.error("Erro ao fazer upload:", err);
      setMessage("Erro ao fazer upload do arquivo.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (modo === "livro") {
        const imagemUrl = imageFile ? await uploadToSupabase(imageFile, "livros") : "";
        await api.post("/livro", {
          ...formData,
          quantidade: Number(formData.quantidade),
          anoPublicado: Number(formData.anoPublicado),
          imagemUrl: imagemUrl || "https://placehold.co/600x400?text=Sem+Imagem",
        });
        setMessage("Livro cadastrado com sucesso!");
      } else {
        const pdfUrl = pdfFile ? await uploadToSupabase(pdfFile, "materiais") : null;
        if (!pdfUrl) return;

        await api.post("/materialacademico", {
          ...materialData,
          pdfUrl,
        });
        setMessage("Material acadêmico cadastrado com sucesso!");
      }

      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      setMessage("Erro ao cadastrar. Tente novamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="container-modal">
      <div className="conteudo">
        <div className="btn-close">
          <button onClick={onClose}>✕</button>
        </div>

        <div className="mode-switch">
          <button onClick={() => setModo("livro")} className={modo === "livro" ? "active" : ""}>
            Cadastrar Livro
          </button>
          <button onClick={() => setModo("material")} className={modo === "material" ? "active" : ""}>
            Cadastrar Material
          </button>
        </div>

        <h2 className="text">{modo === "livro" ? "Cadastrar Livro" : "Cadastrar Material Acadêmico"}</h2>

        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={modo === "livro" ? formData.titulo : materialData.titulo}
            onChange={(e) => handleChange(e, modo === "material")}
            required
          />

          <select
            name="area"
            value={modo === "livro" ? formData.area : materialData.area}
            onChange={(e) => handleChange(e, modo === "material")}
            required
          >
            <option value="">Selecione a Área</option>
            {areas.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <input
            type="text"
            name="autor"
            placeholder="Autor"
            value={modo === "livro" ? formData.autor : materialData.autor}
            onChange={(e) => handleChange(e, modo === "material")}
            required
          />

          <textarea
            name="sinopse"
            placeholder="Sinopse"
            value={modo === "livro" ? formData.sinopse : materialData.sinopse}
            onChange={(e) => handleChange(e, modo === "material")}
            required
          />

          {modo === "livro" ? (
            <>
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
                type="number"
                name="quantidade"
                placeholder="Quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                min="1"
                required
              />
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </>
          ) : (
            <input type="file" accept="application/pdf" onChange={handlePdfChange} required />
          )}

          <div className="send">
            <button type="submit" disabled={isUploading}>
              {isUploading ? "Enviando..." : "Cadastrar"}
            </button>
          </div>

          {message && (
            <div className={`alert ${message.includes("sucesso") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CadastrarLivro;
