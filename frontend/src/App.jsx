import { useState } from "react";

const API_URL = "http://localhost:5000";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [films, setFilms] = useState([]);
  const [titolo, setTitolo] = useState("");
  const [anno, setAnno] = useState("");
  const [genere, setGenere] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setLoggedUser(data.username);
        setMessage(data.message);
      })
      .catch((error) => setMessage(error.message));
  }

  function handleShowFilms() {
    fetch(`${API_URL}/api/films`, {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setFilms(data);
        setMessage("Elenco film caricato");
      })
      .catch((error) => setMessage(error.message));
  }

  function handleAddFilm(event) {
    event.preventDefault();

    fetch(`${API_URL}/api/films`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        titolo,
        anno: Number(anno),
        genere,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setMessage(`Film inserito: ${data.titolo}`);
        setTitolo("");
        setAnno("");
        setGenere("");
      })
      .catch((error) => setMessage(error.message));
  }

  function handleLogout() {
    fetch(`${API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        setLoggedUser("");
        setFilms([]);
        setMessage(data.message);
      })
      .catch((error) => setMessage(error.message));
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Login Utente con Sessione</h1>
      <p>Utente di esempio: maria - Password: 123stella</p>

      {!loggedUser && (
        <form onSubmit={handleLogin} style={{ marginBottom: "20px" }}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />
          <button type="submit">Login</button>
        </form>
      )}

      {loggedUser && (
        <>
          <p>Utente loggato: {loggedUser}</p>
          <button onClick={handleShowFilms} style={{ marginRight: "10px" }}>
            Mostra film
          </button>
          <button onClick={handleLogout}>Logout</button>

          <form onSubmit={handleAddFilm} style={{ marginTop: "20px", marginBottom: "20px" }}>
            <h2>Inserisci Film</h2>
            <input
              type="text"
              placeholder="Titolo"
              value={titolo}
              onChange={(event) => setTitolo(event.target.value)}
              style={{ display: "block", marginBottom: "10px", padding: "8px" }}
            />
            <input
              type="number"
              placeholder="Anno"
              value={anno}
              onChange={(event) => setAnno(event.target.value)}
              style={{ display: "block", marginBottom: "10px", padding: "8px" }}
            />
            <input
              type="text"
              placeholder="Genere"
              value={genere}
              onChange={(event) => setGenere(event.target.value)}
              style={{ display: "block", marginBottom: "10px", padding: "8px" }}
            />
            <button type="submit">Inserisci film</button>
          </form>

          {films.length > 0 && (
            <>
              <h2>Elenco Film</h2>
              {films.map((film) => (
                <div key={film.id}>
                  <strong>{film.titolo}</strong> - {film.anno} - {film.genere}
                </div>
              ))}
            </>
          )}
        </>
      )}

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}

export default App;
