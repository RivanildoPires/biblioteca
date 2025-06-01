import logo from "../assets/logo.png";
import livro from "../assets/livro.png";
import usuario from "../assets/usuario.png";
import sair from "../assets/sair.png";
import "./Header.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MeuPerfil from "./MeuPerfil";
import CadastrarUsuario from "./CadastrarUsuario";
import cadastroU from "../assets/cadastroU.png";
import CadastrarLivro from "./CadastrarLivro";
import api from "../api";

const Header = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserData(user);
  }, []);

  const openModalHandler = (type) => {
    setModalType(type);
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
    setModalType("");
  };


  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 1) { 
      try {
        const response = await api.get(`/livros?titulo=${value}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div>
      <header>
        <nav className="nav-bar">
          <div className="navbar-inner">
            <div className="navbar-top">
              <Link to={"/telaInicial"}>
                <img src={logo} alt="logo-biblioteca" />
              </Link>

              {userData?.tipo === "BIBLIOTECARIO" ? (
                <h3>Bem-vindo, {userData.nome}</h3>
              ) : (
                <form className="form">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </form>
              )}

              <ul className="list">
                {userData?.tipo === "BIBLIOTECARIO" && (
                  <li>
                    <img
                      className="livro-img"
                      src={cadastroU}
                      alt="cadastroU"
                    />
                    <button onClick={() => openModalHandler("cadastrar")}>
                      Cadastrar <br />
                      Usuário
                    </button>
                    {modalType === "cadastrar" && (
                      <CadastrarUsuario
                        isOpen={openModal}
                        onClose={closeModalHandler}
                      />
                    )}
                  </li>
                )}

                {userData?.tipo === "BIBLIOTECARIO" && (
                  <li>
                    <img className="livro-img" src={livro} alt="addlivro" />
                    <button onClick={() => openModalHandler("livro")}>
                      Adicionar <br />
                      Livro
                    </button>
                    {modalType === "livro" && (
                      <CadastrarLivro
                        isOpen={openModal}
                        onClose={closeModalHandler}
                      />
                    )}
                  </li>
                )}

                <li>
                  <img className="livro-img" src={livro} alt="livrinho" />
                  <button onClick={() => openModalHandler("livros")}>
                    Livros <br />
                    Reservado
                  </button>
                  {modalType === "livros" && (
                    <MeuPerfil
                      isOpen={openModal}
                      onClose={closeModalHandler}
                    />
                  )}
                </li>

                <li>
                  <img className="usuario-img" src={usuario} alt="usuario" />
                  <button onClick={() => openModalHandler("perfil")}>
                    Meu <br />
                    Perfil
                  </button>
                  {modalType === "perfil" && (
                    <MeuPerfil
                      isOpen={openModal}
                      onClose={closeModalHandler}
                    />
                  )}
                </li>

                <li>
                  <a href="#">
                    <img className="sair-img" src={sair} alt="sair" />
                  </a>
                </li>
              </ul>
            </div>

            <hr />

            <table className="table">
              <tr>
                <Link to={"/livros"}>
                  <th>Livros</th>
                </Link>
                <th>Artigos</th>
                <Link to={"/tcc"}>
                  <th>TCC</th>
                </Link>
                <Link to={"/material"}>
                  <th>Material Acadêmico</th>
                </Link>
              </tr>
            </table>

            {searchResults.length > 0 && (
              <div className="search-results">
                <ul>
                  {searchResults.map((livro) => (
                    <li key={livro.id}>
                      <strong>{livro.titulo}</strong> - {livro.autor} ({livro.anoPublicado})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
