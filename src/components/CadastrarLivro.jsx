import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './CadastrarUsuario.css';

const CadastrarLivro = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    area: '',
    editora: '',
    ano_publicacao: '',
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setError('');
    setSuccess('');

    try {
      let imagemUrl = null;

      // Upload da imagem se existir
      if (imagemFile) {
        const fileName = `${Date.now()}_${imagemFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('livros')
          .upload(fileName, imagemFile);

        if (uploadError) throw uploadError;

        // Obtém a URL pública da imagem
        const { data: urlData } = supabase.storage
          .from('livros')
          .getPublicUrl(fileName);

        imagemUrl = urlData.publicUrl;
      }

      // Insere o livro no banco de dados
      const { data: livroData, error: livroError } = await supabase
        .from('livros')
        .insert([{
          ...formData,
          ano_publicacao: parseInt(formData.ano_publicacao, 10),
          imagem_url: imagemUrl,
          user_id: null // Para usuários não autenticados
        }])
        .select();

      if (livroError) throw livroError;

      setSuccess('Livro cadastrado com sucesso!');
      setFormData({
        titulo: '',
        autor: '',
        area: '',
        editora: '',
        ano_publicacao: '',
      });
      setImagemFile(null);

      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error('Erro ao cadastrar livro:', err);
      setError(err.message || 'Erro ao cadastrar livro. Tente novamente.');
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
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Título"
              required
            />

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
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Área"
              required
            />

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
              name="ano_publicacao"
              value={formData.ano_publicacao}
              onChange={handleChange}
              placeholder="Ano de Publicação"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagemFile(e.target.files[0])}
            />

            <div className="send">
              <button
                type="submit"
                disabled={loading}
                className={loading ? 'loading' : ''}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Livro'
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