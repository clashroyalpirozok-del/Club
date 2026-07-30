# ROZIK_OFF Brawl Stars Club Viewer — Vercel-ready

## Структура проекта
```
├── api/               # Serverless-функции Python (Vercel)
│   ├── _brawl.py      # общий модуль (клиент Brawl Stars API)
│   ├── club.py        # GET /api/club?tag=...
│   └── player/[tag].py# GET /api/player/{tag}
├── frontend/          # React (craco + tailwind)
├── requirements.txt   # Python-зависимости для /api
└── vercel.json        # конфиг сборки
```

## Деплой на Vercel (пошагово)

1. Создайте новый репозиторий на GitHub, залейте всё содержимое этой папки.
2. На https://vercel.com → **Add New → Project** → выберите ваш репозиторий.
3. Framework Preset: **Other** (Vercel сам подхватит `vercel.json`).
4. **Environment Variables** (Settings → Environment Variables), добавьте:
   - `BRAWL_API_TOKEN` = ваш JWT-токен (с whitelist IP `45.79.218.79`)
   - `CLUB_TAG` = `#29QLUYOPO` (или любой другой тег клуба)
   - `BRAWL_API_BASE` = `https://bsproxy.royaleapi.dev/v1`
5. Нажмите **Deploy**. Готово.

⚠️ **Важно про токен:** Vercel serverless-функции выходят в интернет с динамических IP. Ваш токен Supercell должен разрешать `45.79.218.79` (IP RoyaleAPI-прокси, через который идут все запросы).

## Локальный запуск

```bash
# фронтенд
cd frontend && yarn install && yarn start

# бэкенд (через Vercel CLI)
npm i -g vercel
vercel dev
```

## Как это работает
- Frontend делает `GET /api/club` и `GET /api/player/<tag>` — на том же домене.
- Vercel route matcher матчит `/api/club` → `api/club.py`, `/api/player/XYZ` → `api/player/[tag].py`.
- Python-функции ходят в Brawl Stars API через RoyaleAPI-прокси, чтобы обойти IP-restriction токена.
