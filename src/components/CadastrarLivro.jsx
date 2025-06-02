import React, { useState } from 'react';
import { supabase } from '../supabaseClient'
import axios from 'axios';
import "./CadastrarUsuario.css";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
});

const CadastrarLivro = () => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [area, setArea] = useState('');
  const [editora, setEditora] = useState('');
  const [anoPublicado, setAnoPublicado] = useState('');
  const [imagemFile, setImagemFile] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imagemPath = null;

    if (imagemFile) {
      const fileName = `${Date.now()}_${imagemFile.name}`;
      const { data, error } = await supabase.storage
        .from('livros')
        .upload(fileName, imagemFile);

      if (error) {
        console.error('Erro ao fazer upload da imagem:', error.message);
        setMensagem('Erro ao enviar imagem');
        return;
      }

      imagemPath = `livros/${fileName}`;
    }

    const novoLivro = {
      titulo,
      autor,
      area,
      editora,
      anoPublicado: parseInt(anoPublicado, 10),
      imagem: imagemPath,
    };

    try {
      await api.post('/livro', novoLivro);
      setMensagem('Livro cadastrado com sucesso!');
      setTitulo('');
      setAutor('');
      setArea('');
      setEditora('');
      setAnoPublicado('');
      setImagemFile(null);
    } catch (err) {
      console.error('Erro ao cadastrar livro:', err);
      setMensagem('Erro ao cadastrar livro');
    }
  };

  return (
    <div>
      <h2>Cadastrar Livro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Área"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Editora"
          value={editora}
          onChange={(e) => setEditora(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Ano de Publicação"
          value={anoPublicado}
          onChange={(e) => setAnoPublicado(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagemFile(e.target.files[0])}
        />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default CadastrarLivro;
