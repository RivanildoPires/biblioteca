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

const Header = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [userData, setUserData] = useState(null);

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
                  <input type="text" placeholder="Buscar..." />
                </form>
              )}

              <ul className="list">
                {userData?.tipo === "BIBLIOTECARIO" && (
                  <li>
                    <img className="livro-img" src={cadastroU} alt="cadastroU" />
                    <button onClick={() => openModalHandler("cadastrar")}>
                      Cadastrar <br />
                      Usuário
                    </button>
                    {modalType === "cadastrar" && (
                      <CadastrarUsuario isOpen={openModal} onClose={closeModalHandler} />
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
                    <MeuPerfil isOpen={openModal} onClose={closeModalHandler} />
                  )}
                </li>

                <li>
                  <img className="usuario-img" src={usuario} alt="usuario" />
                  <button onClick={() => openModalHandler("perfil")}>
                    Meu <br />
                    Perfil
                  </button>
                  {modalType === "perfil" && (
                    <MeuPerfil isOpen={openModal} onClose={closeModalHandler} />
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
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
