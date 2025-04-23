import React, { useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';

const LivroList = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await api.get('/livro');
        if (response.status === 204) {
          setError('Nenhum livro encontrado');
        } else {
          setLivros(response.data);
        }
      } catch (err) {
        setError(err.response?.data || 'Erro ao buscar livros');
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="livro-list">
      <h2>Lista de Livros</h2>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Área</th>
            <th>Editora</th>
            <th>Ano Publicado</th>
          </tr>
        </thead>
        <tbody>
          {livros.map((livro) => (
            <tr key={livro.uuid}>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.area}</td>
              <td>{livro.editora}</td>
              <td>{livro.anoPublicado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LivroList;