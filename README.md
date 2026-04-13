# Film Flask React MongoDB

Repository di esempio con:

- backend Flask
- frontend React con Vite
- database MongoDB avviato con Docker Compose
- login utente con cookie di sessione
- visualizzazione e inserimento film

## Struttura del progetto

```text
film-flask-react-mongodb/
├─ backend/
│  ├─ app.py
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ package.json
│  └─ vite.config.js
├─ docker-compose.yml
├─ .gitignore
└─ README.md
```

## Backend Flask

File: `backend/app.py`

Database: MongoDB avviato con Docker Compose

Questo backend espone queste API:

- `POST /api/login`
- `POST /api/logout`
- `GET /api/session`
- `GET /api/films`
- `POST /api/films`

Flusso dell'applicazione:

1. Il frontend React invia username e password alla rotta `/api/login`.
2. Flask controlla le credenziali.
3. Se il login è corretto, Flask salva l'utente nella `session`.
4. Il browser conserva il cookie di sessione.
5. Quando l'utente chiede i film o inserisce un film, React invia la richiesta con il cookie.
6. Flask controlla se l'utente è autenticato.
7. Se l'utente è autenticato, Flask legge o salva i dati su MongoDB.
8. Flask restituisce i dati in formato JSON.

## Frontend React

File principale: `frontend/src/App.jsx`

Il componente React:

1. Mostra un form di login.
2. Invia le credenziali a Flask con `fetch`.
3. Usa `credentials: "include"` per inviare e ricevere il cookie di sessione.
4. Dopo il login, permette di vedere l'elenco film.
5. Dopo il login, permette anche di inserire un nuovo film.

## Come provarlo

### Backend

Vai nella cartella del progetto:

```bash
cd C:\Users\coffa\Documents\Playground\esempio-film-flask-react
```

Avvia MongoDB con Docker Compose:

```bash
docker compose up -d
```

Installa i pacchetti:

```bash
cd backend
pip install -r requirements.txt
```

Avvia il backend:

```bash
python app.py
```

Se vuoi specificare la connessione manualmente:

```bash
set MONGO_URI=mongodb://localhost:27017/
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Il file `App.jsx` si trova in `frontend/src/App.jsx`.

## Credenziali di esempio

- username: `maria`
- password: `123stella`

<img width="698" height="618" alt="immagine" src="https://github.com/user-attachments/assets/4b1b4555-f70c-41fe-8ea7-5898442e9d82" />

