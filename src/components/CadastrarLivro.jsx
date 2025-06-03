import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import api from '../api';
import './CadastrarUsuario.css';

const CadastrarLivro = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    area: '',
    autor: '',
    quantidade: 1,
    sinopse: '',
    editora: '',
    anoPublicado: '',
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: name === 'quantidade' || name === 'anoPublicado'
      ? Math.max(1, parseInt(value, 10) || 1)
      : value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {

      let imagemUrl = '';
      if (imagemFile) {
        const fileName = `${Date.now()}_${imagemFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('livros')
          .upload(fileName, imagemFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('livros')
          .getPublicUrl(fileName);

        imagemUrl = publicUrl;
      }

      const livroData = {
        titulo: formData.titulo,
        area: formData.area,
        autor: formData.autor,
        quantidade: formData.quantidade,
        sinopse: formData.sinopse,
        editora: formData.editora,
        anoPublicado: formData.anoPublicado,
        imagemUrl: imagemUrl
      };

      const response = await api.post('/livro', livroData);
      
      setSuccess('Livro cadastrado com sucesso!');
      setFormData({
        titulo: '',
        area: '',
        autor: '',
        quantidade: 1,
        sinopse: '',
        editora: '',
        anoPublicado: '',
      });
      setImagemFile(null);

      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      setError(
        error.response?.data?.message || 
        'Erro ao cadastrar livro. Tente novamente.'
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
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Título"
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
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              placeholder="Autor"
              required
            />

            <input
              type="number"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
              placeholder="Quantidade"
              required
              min="1"
            />

            <textarea
              name="sinopse"
              value={formData.sinopse}
              onChange={handleChange}
              placeholder="Sinopse"
              required
              rows="3"
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
              name="anoPublicado"
              value={formData.anoPublicado}
              onChange={handleChange}
              placeholder="Ano de Publicação"
              required
              min="1900"
              max={new Date().getFullYear()}
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