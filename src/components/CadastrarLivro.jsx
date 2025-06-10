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
  const [abaAtual, setAbaAtual] = useState("livro");
  const [formLivro, setFormLivro] = useState({
    titulo: "", area: "", autor: "", quantidade: "", sinopse: "",
    editora: "", anoPublicado: "", imagemUrl: ""
  });

  const [formMaterial, setFormMaterial] = useState({
    titulo: "", area: "", autor: "", sinopse: "", pdf: null
  });

  const [formTcc, setFormTcc] = useState({
    titulo: "", area: "", autor: "", sinopse: "", pdf: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadPDF = async (file) => {
    if (!file) return null;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("livros").upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from("livros").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      console.error("Erro ao fazer upload do arquivo:", err);
      setMessage("Erro ao fazer upload do arquivo.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    setIsUploading(true);
    try {
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("livros").upload(fileName, imageFile);
      if (error) throw error;
      const { data } = supabase.storage.from("livros").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleLivroChange = (e) => {
    const { name, value } = e.target;
    setFormLivro((prev) => ({ ...prev, [name]: value }));
  };

  const handlePDFChange = (e, tipo) => {
    const file = e.target.files[0];
    if (tipo === "material") setFormMaterial((prev) => ({ ...prev, pdf: file }));
    else if (tipo === "tcc") setFormTcc((prev) => ({ ...prev, pdf: file }));
  };

  const handleSubmitLivro = async (e) => {
    e.preventDefault();
    if (!formLivro.area) return setMessage("Selecione uma área.");
    const imgUrl = imageFile ? await uploadImage() : "";
    try {
      await api.post("/livro", {
        ...formLivro,
        quantidade: Number(formLivro.quantidade),
        anoPublicado: Number(formLivro.anoPublicado),
        imagemUrl: imgUrl || "https://placehold.co/600x400?text=Sem+Imagem"
      });
      setMessage("Livro cadastrado com sucesso!");
      setFormLivro({
        titulo: "", area: "", autor: "", quantidade: "", sinopse: "",
        editora: "", anoPublicado: "", imagemUrl: ""
      });
      setImageFile(null);
    } catch (err) {
      setMessage("Erro ao cadastrar livro.");
    }
  };

  const handleSubmitMaterial = async (e) => {
    e.preventDefault();
    const pdfUrl = await uploadPDF(formMaterial.pdf);
    if (!pdfUrl) return;
    try {
      await api.post("/material", {
        ...formMaterial,
        pdfUrl,
      });
      setMessage("Material cadastrado com sucesso!");
      setFormMaterial({ titulo: "", area: "", autor: "", sinopse: "", pdf: null });
    } catch (err) {
      setMessage("Erro ao cadastrar material.");
    }
  };

  const handleSubmitTcc = async (e) => {
    e.preventDefault();
    const pdfUrl = await uploadPDF(formTcc.pdf);
    if (!pdfUrl) return;
    try {
      await api.post("/tcc", {
        ...formTcc,
        pdfUrl,
      });
      setMessage("TCC cadastrado com sucesso!");
      setFormTcc({ titulo: "", area: "", autor: "", sinopse: "", pdf: null });
    } catch (err) {
      setMessage("Erro ao cadastrar TCC.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="container-modal">
      <div className="conteudo">
        <div className="btn-close">
          <button onClick={onClose}>✕</button>
        </div>

        <div className="tabs">
          <button onClick={() => setAbaAtual("livro")}>Livro</button>
          <button onClick={() => setAbaAtual("material")}>Material</button>
          <button onClick={() => setAbaAtual("tcc")}>TCC</button>
        </div>

        {abaAtual === "livro" && (
          <>
            <h2>Cadastrar Livro</h2>
            <form onSubmit={handleSubmitLivro}>
              <input type="text" name="titulo" placeholder="Título" value={formLivro.titulo} onChange={handleLivroChange} required />
              <select name="area" value={formLivro.area} onChange={handleLivroChange} required>
                <option value="">Selecione</option>
                {areas.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <input type="text" name="autor" placeholder="Autor" value={formLivro.autor} onChange={handleLivroChange} required />
              <input type="number" name="quantidade" placeholder="Quantidade" value={formLivro.quantidade} onChange={handleLivroChange} required />
              <textarea name="sinopse" placeholder="Sinopse" value={formLivro.sinopse} onChange={handleLivroChange} required />
              <input type="text" name="editora" placeholder="Editora" value={formLivro.editora} onChange={handleLivroChange} required />
              <input type="number" name="anoPublicado" placeholder="Ano de Publicação" value={formLivro.anoPublicado} onChange={handleLivroChange} required />
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              <button type="submit" disabled={isUploading}>Cadastrar</button>
            </form>
          </>
        )}

        {abaAtual === "material" && (
          <>
            <h2>Cadastrar Material</h2>
            <form onSubmit={handleSubmitMaterial}>
              <input type="text" name="titulo" placeholder="Título" value={formMaterial.titulo} onChange={(e) => setFormMaterial((p) => ({ ...p, titulo: e.target.value }))} required />
              <select name="area" value={formMaterial.area} onChange={(e) => setFormMaterial((p) => ({ ...p, area: e.target.value }))} required>
                <option value="">Selecione</option>
                {areas.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <input type="text" name="autor" placeholder="Autor" value={formMaterial.autor} onChange={(e) => setFormMaterial((p) => ({ ...p, autor: e.target.value }))} required />
              <textarea name="sinopse" placeholder="Sinopse" value={formMaterial.sinopse} onChange={(e) => setFormMaterial((p) => ({ ...p, sinopse: e.target.value }))} required />
              <input type="file" accept="application/pdf" onChange={(e) => handlePDFChange(e, "material")} required />
              <button type="submit" disabled={isUploading}>Cadastrar</button>
            </form>
          </>
        )}

        {abaAtual === "tcc" && (
          <>
            <h2>Cadastrar TCC</h2>
            <form onSubmit={handleSubmitTcc}>
              <input type="text" name="titulo" placeholder="Título" value={formTcc.titulo} onChange={(e) => setFormTcc((p) => ({ ...p, titulo: e.target.value }))} required />
              <select name="area" value={formTcc.area} onChange={(e) => setFormTcc((p) => ({ ...p, area: e.target.value }))} required>
                <option value="">Selecione</option>
                {areas.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <input type="text" name="autor" placeholder="Autor" value={formTcc.autor} onChange={(e) => setFormTcc((p) => ({ ...p, autor: e.target.value }))} required />
              <textarea name="sinopse" placeholder="Sinopse" value={formTcc.sinopse} onChange={(e) => setFormTcc((p) => ({ ...p, sinopse: e.target.value }))} required />
              <input type="file" accept="application/pdf" onChange={(e) => handlePDFChange(e, "tcc")} required />
              <button type="submit" disabled={isUploading}>Cadastrar</button>
            </form>
          </>
        )}

        {message && (
          <div className={`alert ${message.includes("sucesso") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastrarLivro;
