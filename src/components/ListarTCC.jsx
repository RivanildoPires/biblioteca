import { useEffect, useState } from "react";
import Header from "./Header";
import "./Footer2.css";
import "./ListarTCC.css";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const areas = [
  { label: "Ciências da Computação", value: "computacao" },
  { label: "Direito", value: "direito" },
  { label: "Educação Física", value: "edfisica" },
  { label: "Marketing", value: "marketing" },
  { label: "Matemática", value: "matematica" },
];

const ListarTCC = () => {
  const [tccs, setTccs] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTccs = async () => {
      try {
        const response = await api.get("/tcc");
        setTccs(response.data);
      } catch (err) {
        setError("Erro ao carregar TCCs. Tente novamente mais tarde.");
        console.error("Erro ao buscar TCCs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTccs();
  }, []);

  const handleAreaClick = (value) => {
    setSelectedArea((prev) => (prev === value ? "" : value));
  };

  const filteredTccs = selectedArea
    ? tccs.filter(
        (tcc) =>
          tcc.area && tcc.area.toLowerCase() === selectedArea.toLowerCase()
      )
    : tccs;

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
            {areas.map(({ label, value }) => (
              <li
                key={value}
                onClick={() => handleAreaClick(value)}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedArea === value ? "bold" : "normal",
                  color: selectedArea === value ? "#007BFF" : "inherit",
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="container-main">
          <main className="main-content">
            <section className="section-tcc">
              {loading && <p>Carregando TCCs...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}

              {!loading && !error && filteredTccs.length === 0 && (
                <p>Nenhum TCC encontrado para a área selecionada.</p>
              )}

              {!loading &&
                !error &&
                filteredTccs.map((tcc) => (
                  <div key={tcc.idTcc} className="tcc">
                    <h3>{tcc.titulo}</h3>
                    <div className="line"></div>
                    <h5>Autor: {tcc.autor}</h5>
                    <h5>Área: {tcc.area}</h5>
                    <div className="tcc-disc">
                      <p>{tcc.sinopse}</p>
                    </div>
                    <a
                      href={tcc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="download">Baixar PDF</button>
                    </a>
                  </div>
                ))}
            </section>
          </main>
        </div>
      </div>

      <div className="page-container">
        <div className="foooter">
          <h3 className="foooter-h3">
            Faculdade Católica da Paraíba. © 2025 - Todos os direitos reservados.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ListarTCC;
