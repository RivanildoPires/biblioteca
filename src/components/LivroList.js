import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const LivroList = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await api.get("/livro");

        if (response.status === 204) {
          setError("Nenhum livro encontrado");
          setLivros([]);
        } else {
          setLivros(response.data);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Erro ao buscar livros"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Carregando livros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Erro: {error}</p>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="livro-list">
      <h2>Lista de Livros</h2>

      {livros.length === 0 ? (
        <p>Nenhum livro cadastrado.</p>
      ) : (
        <div className="table-responsive">
          <table className="livro-table">
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
                <tr key={livro.uuid || livro.id}>
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
      )}
    </div>
  );
};

export default LivroList;
