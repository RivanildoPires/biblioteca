import Header from "./Header";
import "./ListarTCC.css";
import Footer from "./Footer";

const ListarTCC = () => {
  return (
    <div>
      <Header />

      <div className="container">
        <aside className="categories">
          <h4>TCC</h4>
          <div className="separator">
            <div className="line"></div>
          </div>
          <ul>
            <li>Ciências da Computação</li>
            <li>Direito</li>
            <li>Educação Fisica</li>
            <li>Marketing</li>
          </ul>
        </aside>
        <div className="container-main">
          <main className="main-content">
            <section className="section-tcc">
              <div className="tcc">
                <h3>Estudo do Software de Gestão Trello</h3>
                <h5>Autor: </h5>
                <h5>Publicado: </h5>
                <div className="tcc-disc">
                  <p>
                    Este Trabalho de Conclusão de Curso (TCC) descreve o
                    desenvolvimento de um software de gestão empresarial. O
                    objetivo é melhorar a eficiència dos processos internos da
                    organização. A aplicação foi criada utilizando tecnologias
                    modernas e seguindo metodologías ágeís.{" "}
                  </p>
                </div>

                <button className="download">Baixar PDF</button>
              </div>
              <div className="tcc"></div>
              <div className="tcc"></div>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListarTCC;
