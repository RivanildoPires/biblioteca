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
  const [tab, setTab] = useState("livro");

  const [messageLivro, setMessageLivro] = useState("");
  const [messageMaterial, setMessageMaterial] = useState("");
  const [messageTcc, setMessageTcc] = useState("");
  const [messageLivroPublico, setMessageLivroPublico] = useState("");

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

  const [formMaterial, setFormMaterial] = useState({
    titulo: "",
    area: "",
    autor: "",
    sinopse: "",
  });
  const [pdfMaterialFile, setPdfMaterialFile] = useState(null);
  const [isUploadingMaterial, setIsUploadingMaterial] = useState(false);

  const [formTcc, setFormTcc] = useState({
    titulo: "",
    area: "",
    autor: "",
    sinopse: "",
  });
  const [pdfTccFile, setPdfTccFile] = useState(null);
  const [isUploadingTcc, setIsUploadingTcc] = useState(false);

  const [formLivroPublico, setFormLivroPublico] = useState({
    titulo: "",
    area: "",
    autor: "",
    sinopse: "",
    editora: "",
    anoPublicado: "",
  });
  const [imageFilePublico, setImageFilePublico] = useState(null);
  const [pdfFilePublico, setPdfFilePublico] = useState(null);
  const [isUploadingLivroPublico, setIsUploadingLivroPublico] = useState(false);


  const handleChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file, bucket, folder = "") => {
    if (!file) return null;
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}${Math.random()}.${fileExt}`;
    const filePath = fileName;

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Erro no upload:", error);
      return null;
    }
  };

  const handleSubmitLivro = async (e) => {
    e.preventDefault();
    setMessageLivro("");
    
    if (!formLivro.area) {
      setMessageLivro("Selecione uma área");
      return;
    }

    setIsUploadingLivro(true);
    try {
      let imageUrl = await uploadFile(imageFile, "livros");
      if (!imageUrl && imageFile) {
        setMessageLivro("Erro no upload da imagem");
        return;
      }

      await api.post("/livro", {
        ...formLivro,
        quantidade: Number(formLivro.quantidade),
        anoPublicado: Number(formLivro.anoPublicado),
        imagemUrl: imageUrl || "https://placehold.co/600x400?text=Sem+Imagem",
      });

      setMessageLivro("Livro cadastrado com sucesso!");
      resetFormLivro();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setMessageLivro(error.response?.data?.message || "Erro ao cadastrar");
    } finally {
      setIsUploadingLivro(false);
    }
  };

  const handleSubmitMaterial = async (e) => {
    e.preventDefault();
    setMessageMaterial("");
    
    if (!formMaterial.area) {
      setMessageMaterial("Selecione uma área");
      return;
    }

    setIsUploadingMaterial(true);
    try {
      const pdfUrl = await uploadFile(pdfMaterialFile, "livros");
      if (!pdfUrl) {
        setMessageMaterial("Erro no upload do PDF");
        return;
      }

      await api.post("/materialacademico", {
        ...formMaterial,
        pdfUrl,
      });

      setMessageMaterial("Material cadastrado com sucesso!");
      resetFormMaterial();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setMessageMaterial(error.response?.data?.message || "Erro ao cadastrar");
    } finally {
      setIsUploadingMaterial(false);
    }
  };

  const handleSubmitTcc = async (e) => {
    e.preventDefault();
    setMessageTcc("");
    
    if (!formTcc.area) {
      setMessageTcc("Selecione uma área");
      return;
    }

    setIsUploadingTcc(true);
    try {
      const pdfUrl = await uploadFile(pdfTccFile, "livros");
      if (!pdfUrl) {
        setMessageTcc("Erro no upload do PDF");
        return;
      }

      await api.post("/tcc", {
        ...formTcc,
        pdfUrl,
      });

      setMessageTcc("TCC cadastrado com sucesso!");
      resetFormTcc();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setMessageTcc(error.response?.data?.message || "Erro ao cadastrar");
    } finally {
      setIsUploadingTcc(false);
    }
  };

  const handleSubmitLivroPublico = async (e) => {
    e.preventDefault();
    setMessageLivroPublico("");
    
    if (!formLivroPublico.area) {
      setMessageLivroPublico("Selecione uma área");
      return;
    }

    setIsUploadingLivroPublico(true);
    try {
      const [imageUrl, pdfUrl] = await Promise.all([
        uploadFile(imageFilePublico, "livros", "publicos_"),
        uploadFile(pdfFilePublico, "livros", "publicos_")
      ]);

      if (!imageUrl || !pdfUrl) {
        setMessageLivroPublico("Erro no upload dos arquivos");
        return;
      }

      await api.post("/livropublico", {
        ...formLivroPublico,
        anoPublicado: Number(formLivroPublico.anoPublicado),
        imagemUrl: imageUrl,
        pdfUrl: pdfUrl,
      });

      setMessageLivroPublico("Livro público cadastrado com sucesso!");
      resetFormLivroPublico();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setMessageLivroPublico(error.response?.data?.message || "Erro ao cadastrar");
    } finally {
      setIsUploadingLivroPublico(false);
    }
  };

  const resetFormLivro = () => {
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
  };

  const resetFormMaterial = () => {
    setFormMaterial({
      titulo: "",
      area: "",
      autor: "",
      sinopse: "",
    });
    setPdfMaterialFile(null);
  };

  const resetFormTcc = () => {
    setFormTcc({
      titulo: "",
      area: "",
      autor: "",
      sinopse: "",
    });
    setPdfTccFile(null);
  };

  const resetFormLivroPublico = () => {
    setFormLivroPublico({
      titulo: "",
      area: "",
      autor: "",
      sinopse: "",
      editora: "",
      anoPublicado: "",
    });
    setImageFilePublico(null);
    setPdfFilePublico(null);
  };

  if (!isOpen) return null;

  return (
    <div className="container-modal">
      <div className="conteudo">
        <div className="btn-close">
          <button onClick={onClose}>✕</button>
        </div>

        <div className="tab-buttons">
          <button
            onClick={() => setTab("livro")}
            className={tab === "livro" ? "active" : ""}
          >
            Livro
          </button>
          <button
            onClick={() => setTab("material")}
            className={tab === "material" ? "active" : ""}
          >
            Material
          </button>
          <button
            onClick={() => setTab("tcc")}
            className={tab === "tcc" ? "active" : ""}
          >
            TCC
          </button>
          <button
            onClick={() => setTab("livroPublico")}
            className={tab === "livroPublico" ? "active" : ""}
          >
            Livro Público
          </button>
        </div>

        {tab === "livro" && (
          <div className="form-container">
            <h2>Cadastrar Livro</h2>
            <form onSubmit={handleSubmitLivro}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formLivro.titulo}
                onChange={(e) => handleChange(e, setFormLivro)}
                required
              />
              <select
                name="area"
                value={formLivro.area}
                onChange={(e) => handleChange(e, setFormLivro)}
                required
              >
                <option value="">Selecione a área</option>
                {areas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="autor"
                placeholder="Autor"
                value={formLivro.autor}
                onChange={(e) => handleChange(e, setFormLivro)}
                required
              />
              <input
                type="number"
                name="quantidade"
                placeholder="Quantidade"
                value={formLivro.quantidade}
                onChange={(e) => handleChange(e, setFormLivro)}
                min="1"
                required
              />
              <textarea
                name="sinopse"
                placeholder="Sinopse"
                value={formLivro.sinopse}
                onChange={(e) => handleChange(e, setFormLivro)}
                required
              />
              <input
                type="text"
                name="editora"
                placeholder="Editora"
                value={formLivro.editora}
                onChange={(e) => handleChange(e, setFormLivro)}
                required
              />
              <input
                type="number"
                name="anoPublicado"
                placeholder="Ano de Publicação"
                value={formLivro.anoPublicado}
                onChange={(e) => handleChange(e, setFormLivro)}
                min="1800"
                max={new Date().getFullYear()}
                required
              />
              <div className="file-upload">
                <label>Imagem da Capa:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
              <button type="submit" disabled={isUploadingLivro}>
                {isUploadingLivro ? "Enviando..." : "Cadastrar"}
              </button>
              {messageLivro && <p className="message">{messageLivro}</p>}
            </form>
          </div>
        )}

        {tab === "material" && (
          <div className="form-container">
            <h2>Cadastrar Material</h2>
            <form onSubmit={handleSubmitMaterial}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formMaterial.titulo}
                onChange={(e) => handleChange(e, setFormMaterial)}
                required
              />
              <select
                name="area"
                value={formMaterial.area}
                onChange={(e) => handleChange(e, setFormMaterial)}
                required
              >
                <option value="">Selecione a área</option>
                {areas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="autor"
                placeholder="Autor"
                value={formMaterial.autor}
                onChange={(e) => handleChange(e, setFormMaterial)}
                required
              />
              <textarea
                name="sinopse"
                placeholder="Sinopse"
                value={formMaterial.sinopse}
                onChange={(e) => handleChange(e, setFormMaterial)}
                required
              />
              <div className="file-upload">
                <label>Arquivo PDF:</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfMaterialFile(e.target.files[0])}
                  required
                />
              </div>
              <button type="submit" disabled={isUploadingMaterial}>
                {isUploadingMaterial ? "Enviando..." : "Cadastrar"}
              </button>
              {messageMaterial && <p className="message">{messageMaterial}</p>}
            </form>
          </div>
        )}

        {tab === "tcc" && (
          <div className="form-container">
            <h2>Cadastrar TCC</h2>
            <form onSubmit={handleSubmitTcc}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formTcc.titulo}
                onChange={(e) => handleChange(e, setFormTcc)}
                required
              />
              <select
                name="area"
                value={formTcc.area}
                onChange={(e) => handleChange(e, setFormTcc)}
                required
              >
                <option value="">Selecione a área</option>
                {areas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="autor"
                placeholder="Autor"
                value={formTcc.autor}
                onChange={(e) => handleChange(e, setFormTcc)}
                required
              />
              <textarea
                name="sinopse"
                placeholder="Sinopse"
                value={formTcc.sinopse}
                onChange={(e) => handleChange(e, setFormTcc)}
                required
              />
              <div className="file-upload">
                <label>Arquivo PDF:</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfTccFile(e.target.files[0])}
                  required
                />
              </div>
              <button type="submit" disabled={isUploadingTcc}>
                {isUploadingTcc ? "Enviando..." : "Cadastrar"}
              </button>
              {messageTcc && <p className="message">{messageTcc}</p>}
            </form>
          </div>
        )}

        {tab === "livroPublico" && (
          <div className="form-container">
            <h2>Cadastrar Livro Público</h2>
            <form onSubmit={handleSubmitLivroPublico}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formLivroPublico.titulo}
                onChange={(e) => handleChange(e, setFormLivroPublico)}
                required
              />
              <select
                name="area"
                value={formLivroPublico.area}
                onChange={(e) => handleChange(e, setFormLivroPublico)}
                required
              >
                <option value="">Selecione a área</option>
                {areas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="autor"
                placeholder="Autor"
                value={formLivroPublico.autor}
                onChange={(e) => handleChange(e, setFormLivroPublico)}
                required
              />
              <textarea
                name="sinopse"
                placeholder="Sinopse"
                value={formLivroPublico.sinopse}
                onChange={(e) => handleChange(e, setFormLivroPublico)}
                required
              />
              <input
                type="text"
                name="editora"
                placeholder="Editora"
                value={formLivroPublico.editora}
                onChange={(e) => handleChange(e, setFormLivroPublico)}
                required
              />
              <input
                type="number"
                name="anoPublicado"
                placeholder="Ano de Publicação"
                value={formLivroPublico.anoPublicado}
                onChange={(e) => handleChange(e, setFormLivroPublico)}
                min="1800"
                max={new Date().getFullYear()}
                required
              />
              <div className="file-upload">
                <label>Imagem da Capa:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFilePublico(e.target.files[0])}
                  required
                />
              </div>
              <div className="file-upload">
                <label>Arquivo PDF:</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFilePublico(e.target.files[0])}
                  required
                />
              </div>
              <button type="submit" disabled={isUploadingLivroPublico}>
                {isUploadingLivroPublico ? "Enviando..." : "Cadastrar"}
              </button>
              {messageLivroPublico && <p className="message">{messageLivroPublico}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastrarMaterialGeral;