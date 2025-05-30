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
  const [openModalPerfil, setOpenModalPerfil] = useState(false);
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  const [isBibliotecario, setIsBibliotecario] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setIsBibliotecario(
        userData.tipo === "Bibliotecario" || userData.tipoUsuario === "Bibliotecario"
      );
    }
  }, []);

  return (
    <div>
      <header>
        <nav className="nav-bar">
          <div className="navbar-inner">
            <div className="navbar-top">
              <Link to={"/telaInicial"}>
                <img src={logo} alt="logo-biblioteca" />
              </Link>

              {isBibliotecario ? (
                <h2 className="bem-vindo">Bem-vindo</h2>
              ) : (
                <form className="form">
                  <input type="text" placeholder="Buscar..." />
                </form>
              )}

              <ul className="list">
                {isBibliotecario && (
                  <li>
                    <img className="livro-img" src={cadastroU} alt="cadastroU" />
                    <button onClick={() => setOpenModalCadastro(true)}>
                      Cadastrar <br />
                      Usuário
                    </button>
                    <CadastrarUsuario
                      isOpen={openModalCadastro}
                      onClose={() => setOpenModalCadastro(false)}
                    />
                  </li>
                )}
                <li>
                  <img className="livro-img" src={livro} alt="livrinho" />
                  <button onClick={() => setOpenModalPerfil(true)}>
                    Livros <br />
                    Reservado
                  </button>

                  <MeuPerfil
                    isOpen={openModalPerfil}
                    onClose={() => setOpenModalPerfil(false)}
                  />
                </li>
                <li>
                  <img className="usuario-img" src={usuario} alt="usuario" />
                  <button onClick={() => setOpenModalPerfil(true)}>
                    Meu <br />
                    Perfil
                  </button>
                  <MeuPerfil
                    isOpen={openModalPerfil}
                    onClose={() => setOpenModalPerfil(false)}
                  />
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
