# Ice Cream POS

Ice cream parlour point-of-sale app with customer ordering, admin inventory, business purchases, invoicing, and sales reporting. All prices are in **PKR (Pakistan Rupees)**.

## Stack

- **Frontend:** React (Create React App), Chakra UI, Redux
- **Backend:** Node.js + json-server

## Local development

### 1. Backend

```bash
cd backend
npm install
npm run server
```

API runs at `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

App runs at `http://localhost:3000`

### Admin login (local)

- Email: `admin@icecream.com`
- Password: `admin123`

## Deployment

This project uses **two services**:

| Service | Platform | Folder |
|---------|----------|--------|
| Frontend | [Vercel](https://vercel.com) | `frontend/` |
| Backend API | [Render](https://render.com) | `backend/` |

Vercel hosts the React app. Render hosts the json-server API (Vercel cannot persist API file writes).

### Step 1 — Deploy backend on Render

1. Push this repo to GitHub: [JamilPr1/IceCreamPOS](https://github.com/JamilPr1/IceCreamPOS)
2. In Render → **New** → **Blueprint** → connect the repo (uses `render.yaml`)
3. Or manually: **Web Service** → root directory `backend`, build `npm install`, start `npm run server`
4. Copy your Render URL (e.g. `https://icecreampos-api.onrender.com`)

Set environment variable on Render:

```
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
```

### Step 2 — Deploy frontend on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com/new)
2. Set **Root Directory** to `frontend`
3. Framework preset: **Create React App** (auto-detected)
4. Add environment variables:

| Variable | Value |
|----------|--------|
| `REACT_APP_API_URL` | Your Render backend URL |
| `REACT_APP_MOCK_PAYMENTS` | `false` (or `true` for demo checkout) |

5. Deploy

After deploy, update Render `ALLOWED_ORIGINS` with your final Vercel URL.

## Environment variables

See `frontend/.env.example` and `backend/.env.example`.

## License

ISC
