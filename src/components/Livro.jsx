import React, { useState } from "react";
import logo from "../assets/logo.png";
import livro from "../assets/livro.png";
import usuario from "../assets/usuario.png";
import sair from "../assets/sair.png";
import java from "../assets/java.png";
import { Link } from "react-router-dom";
import "./Livro.css";
import Header from "./Header";
import Footer from "./Footer";

const Livro = () => {
  const [autor, setAutor] = useState("");
  const [publicado, setPublicacao] = useState(" ");
  const [editora, setEditora] = useState(" ");

  return (
    <div>
      <Header />

      <div className="class-main">
        <main>
          <section className="sec">
            <div className="livro-info">
              <img src={java} alt="Livro" />
              <ul>
                <li>Autor: <p>{autor}</p> </li>
                <li>Publicado: <p>{publicado}</p> </li>
                <li>Editora: <p>{editora} </p> </li>
              </ul>
            </div>
            <div className="livro-sinopse">
              <h5>Sinopse</h5>
              <p>
                Os Design Patterns, ou padrões de projeto, são soluções
                reutilizáveis para problemas comuns no desenvolvimento de
                software. Eles fornecem uma forma de organizar e estruturar o
                código, tornando-o mais flexível, fácil de entender e manter.Em
                Java, os Design Patterns são amplamente utilizados para criar
                aplicações orientadas a objetos mais eficientes e robustas.
                Padrões Criacionais: Esses padrões lidam com a criação de
                objetos, como o Singleton, que garante que uma classe tenha
                apenas uma instância, e o Factory Method, que define um método
                para criar objetos de classes relacionadas. Padrões Estruturais:
                Esses padrões se preocupam com a forma como as classes e objetos
                são compostos, como o Adapter, que converte uma interface em
                outra, e o Decorator, que adiciona responsabilidades a um objeto
                dinamicamente. Padrões Comportamentais: Esses padrões lidam com
                as interações entre objetos, como o Strategy, que define uma
                família de algoritmos e encapsula cada um deles, e o Observer,
                que define uma dependência um-para-muitos entre objetos.
              </p>
              <button>Reservar</button>
            </div>
            <div className="aviso">
              <h5>Atenção!</h5>
              <p>
                Ao reservar o livro, ele ficará disponível para o aluno por um
                dia. Este livro pertence à instituição, portanto, o discente
                deve ter cuidado e devolvê-lo em perfeito estado. Após a
                reserva, o aluno terá uma semana sete dias para ler e devolver o
                livro. Em caso de atraso, será aplicada uma multa.
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Livro;
