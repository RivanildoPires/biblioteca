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

const CadastrarMaterialGeral = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState("livro"); // "livro" | "material" | "tcc"

  // Estado comum: mensagem de erro/sucesso para cada tab
  const [messageLivro, setMessageLivro] = useState("");
  const [messageMaterial, setMessageMaterial] = useState("");
  const [messageTcc, setMessageTcc] = useState("");

  // --------- Estado para Livro ---------
  const [formLivro, setFormLivro] = useState({
    titulo: "",
    area: "",
    autor: "",
    quantidade: "",
    sinopse: "",
    editora: "",
    anoPublicado: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploadingLivro, setIsUploadingLivro] = useState(false);

  // --------- Estado para Material ---------
  const [formMaterial, setFormMaterial] = useState({
    titulo: "",
    area: "",
    autor: "",
    sinopse: "",
  });
  const [pdfMaterialFile, setPdfMaterialFile] = useState(null);
  const [isUploadingMaterial, setIsUploadingMaterial] = useState(false);

  // --------- Estado para TCC ---------
  const [formTcc, setFormTcc] = useState({
    titulo: "",
    area: "",
    autor: "",
    sinopse: "",
  });
  const [pdfTccFile, setPdfTccFile] = useState(null);
  const [isUploadingTcc, setIsUploadingTcc] = useState(false);

  // ---- Handlers comuns ----
  const handleChangeLivro = (e) => {
    const { name, value } = e.target;
    setFormLivro((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeMaterial = (e) => {
    const { name, value } = e.target;
    setFormMaterial((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeTcc = (e) => {
    const { name, value } = e.target;
    setFormTcc((prev) => ({ ...prev, [name]: value }));
  };

  // ---- Upload imagem para Livro ----
  const uploadImage = async () => {
    if (!imageFile) return null;
    setIsUploadingLivro(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage.from("livros").upload(filePath, imageFile);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("livros").getPublicUrl(filePath);
      return publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      setMessageLivro("Erro ao fazer upload da imagem");
      return null;
    } finally {
      setIsUploadingLivro(false);
    }
  };

  // ---- Upload PDF para Material e TCC ----
  const uploadPDF = async (file, setIsUploading, setMessage) => {
    if (!file) return null;
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage.from("livros").upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("livros").getPublicUrl(filePath);
      return publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      setMessage("Erro ao fazer upload do arquivo.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // ---- Submit Livro ----
  const handleSubmitLivro = async (e) => {
    e.preventDefault();
    setMessageLivro("");
    if (!formLivro.area) {
      setMessageLivro("Por favor, selecione uma área.");
      return;
    }
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return;
      }
      await api.post("/livro", {
        ...formLivro,
        quantidade: Number(formLivro.quantidade),
        anoPublicado: Number(formLivro.anoPublicado),
        imagemUrl: imageUrl || "https://placehold.co/600x400?text=Sem+Imagem",
      });
      setMessageLivro("Livro cadastrado com sucesso!");
      setFormLivro({
        titulo: "",
        area: "",
        autor: "",
        quantidade: "",
        sinopse: "",
        editora: "",
        anoPublicado: "",
      });
      setImageFile(null);
      setTimeout(() => {
        setMessageLivro("");
        onClose();
      }, 1500);
    } catch (error) {
      setMessageLivro(
        error.response?.data?.message || "Erro ao cadastrar livro. Tente novamente."
      );
    }
  };

  // ---- Submit Material ----
  const handleSubmitMaterial = async (e) => {
    e.preventDefault();
    setMessageMaterial("");
    if (!formMaterial.area) {
      setMessageMaterial("Por favor, selecione uma área.");
      return;
    }
    try {
      const pdfUrl = await uploadPDF(pdfMaterialFile, setIsUploadingMaterial, setMessageMaterial);
      if (!pdfUrl) return;

      await api.post("/material", {
        titulo: formMaterial.titulo,
        area: formMaterial.area, // já em minúsculo correto
        autor: formMaterial.autor,
        sinopse: formMaterial.sinopse,
        pdfUrl,
      });

      setMessageMaterial("Material cadastrado com sucesso!");
      setFormMaterial({
        titulo: "",
        area: "",
        autor: "",
        sinopse: "",
      });
      setPdfMaterialFile(null);
      setTimeout(() => {
        setMessageMaterial("");
        onClose();
      }, 1500);
    } catch (error) {
      setMessageMaterial(
        error.response?.data?.message || "Erro ao cadastrar material. Tente novamente."
      );
    }
  };

  // ---- Submit TCC ----
  const handleSubmitTcc = async (e) => {
    e.preventDefault();
    setMessageTcc("");
    if (!formTcc.area) {
      setMessageTcc("Por favor, selecione uma área.");
      return;
    }
    try {
      const pdfUrl = await uploadPDF(pdfTccFile, setIsUploadingTcc, setMessageTcc);
      if (!pdfUrl) return;

      await api.post("/tcc", {
        titulo: formTcc.titulo,
        area: formTcc.area,
        autor: formTcc.autor,
        sinopse: formTcc.sinopse,
        pdfUrl,
      });

      setMessageTcc("TCC cadastrado com sucesso!");
      setFormTcc({
        titulo: "",
        area: "",
        autor: "",
        sinopse: "",
      });
      setPdfTccFile(null);
      setTimeout(() => {
        setMessageTcc("");
        onClose();
      }, 1500);
    } catch (error) {
      setMessageTcc(
        error.response?.data?.message || "Erro ao cadastrar TCC. Tente novamente."
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

        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={() => setTab("livro")}
            disabled={tab === "livro"}
            style={{ marginRight: 10 }}
          >
            Cadastrar Livro
          </button>
          <button
            onClick={() => setTab("material")}
            disabled={tab === "material"}
            style={{ marginRight: 10 }}
          >
            Cadastrar Material
          </button>
          <button onClick={() => setTab("tcc")} disabled={tab === "tcc"}>
            Cadastrar TCC
          </button>
        </div>

        {tab === "livro" && (
          <>
            <h2 className="text">Cadastrar Livro</h2>
            <form onSubmit={handleSubmitLivro}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formLivro.titulo}
                onChange={handleChangeLivro}
                required
              />
              <select
                name="area"
                value={formLivro.area}
                onChange={handleChangeLivro}
                required
              >
                <option value="">Selecione a área</option>
                {areas.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="autor"
                placeholder="Autor"
                value={formLivro.autor}
                onChange={handleChangeLivro}
                required
              />
              <input
                type="number"
                name="quantidade"
                placeholder="Quantidade"
                value={formLivro.quantidade}
                onChange={handleChangeLivro}
                min="1"
                required
              />
              <textarea
                name="sinopse"
                placeholder="Sinopse"
                value={formLivro.sinopse}
                onChange={handleChangeLivro}
                required
              />
              <input
                type="text"
                name="editora"
                placeholder="Editora"
                value={formLivro.editora}
                onChange={handleChangeLivro}
                required
              />
              <input
                type="number"
                name="anoPublicado"
                placeholder="Ano de Publicação"
                value={formLivro.anoPublicado}
                onChange={handleChangeLivro}
                min="1800"
                max={new Date().getFullYear()}
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />

              <button type="submit" disabled={isUploadingLivro}>
                {isUploadingLivro ? "Enviando..." : "Cadastrar Livro"}
              </button>
              {messageLivro && <p>{messageLivro}</p>}
            </form>
          </>
        )}

        {tab === "material" && (
          <>
            <h2 className="text">Cadastrar Material</h2>
            <form onSubmit={handleSubmitMaterial}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formMaterial.titulo}
                onChange={handleChangeMaterial}
                required
              />
              <select
                name="area"
                value={formMaterial.area}
                onChange={handleChangeMaterial}
                required
              >
                <option value="">Selecione a área</option>
                {areas.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="autor"
                placeholder="Autor"
                value={formMaterial.autor}
                onChange={handleChangeMaterial}
                required
              />
              <textarea
                name="sinopse"
                placeholder="Sinopse"
                value={formMaterial.sinopse}
                onChange={handleChangeMaterial}
                required
              />

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfMaterialFile(e.target.files[0])}
                required
              />

              <button type="submit" disabled={isUploadingMaterial}>
                {isUploadingMaterial ? "Enviando..." : "Cadastrar Material"}
              </button>
              {messageMaterial && <p>{messageMaterial}</p>}
            </form>
          </>
        )}

        {tab === "tcc" && (
          <>
            <h2 className="text">Cadastrar TCC</h2>
            <form onSubmit={handleSubmitTcc}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formTcc.titulo}
                onChange={handleChangeTcc}
                required
              />
              <select
                name="area"
                value={formTcc.area}
                onChange={handleChangeTcc}
                required
              >
                <option value="">Selecione a área</option>
                {areas.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="autor"
                placeholder="Autor"
                value={formTcc.autor}
                onChange={handleChangeTcc}
                required
              />
              <textarea
                name="sinopse"
                placeholder="Sinopse"
                value={formTcc.sinopse}
                onChange={handleChangeTcc}
                required
              />

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfTccFile(e.target.files[0])}
                required
              />

              <button type="submit" disabled={isUploadingTcc}>
                {isUploadingTcc ? "Enviando..." : "Cadastrar TCC"}
              </button>
              {messageTcc && <p>{messageTcc}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CadastrarMaterialGeral;
