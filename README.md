# Профессия 2.0 — Цифрлық кадрлық резерв АПК

AgriTech саласына арналған upskilling және жұмыс-платформасы. Бұл монорепода React + Vite фронтенді және Node.js/Express + Prisma бекенді бар.

## Құрылым

```
/backend   # Express API, Prisma schema, seed
/frontend  # React (Vite) қолданбасы
```

## Алдын ала талаптар

- Node.js 20+
- npm 9+
- Docker (қалауыңыз бойынша, Postgres үшін)

## Орнату және іске қосу

```bash
# 1. Тәуелділіктерді орнату
cd backend && npm install
cd ../frontend && npm install

# 2. Дерекқорды іске қосу (Docker)
cd ..
docker-compose up -d

# 3. Prisma миграциясы және seed
cd backend
npx prisma migrate dev --name init
npx prisma db seed

# 4. Қоршаған орта айнымалылары
cp ../.env.example ../.env
# .env ішінде DATABASE_URL, JWT_SECRET, VITE_API_URL т.б. толықтырыңыз

# 5. Дамыту режимін қосу
npm run dev        # backend (порт 4000)
cd ../frontend
npm run dev        # frontend (порт 5173)
```

## Негізгі мүмкіндіктер

- Email/құпиясөз аутентификациясы (JWT), рөлдер: студент, жұмыс беруші, админ
- Курстар, сабақтар, симулятор және бейдждер
- 10 сұрақтық адаптивті тест, бейдж тағайындау логикасы
- Жұмыс ұсыныстарын дағдыға қарай матчтау
- Тәлімгерлер мен портфолио QR сілтемесі
- Админ панелі арқылы контентті басқару

## Скрипттер

### Backend
- `npm run dev` — Express сервері (ts-node-dev)
- `npm run build` — TypeScript компиляциясы
- `npm run lint` — ESLint
- `npx prisma studio` — Prisma Studio (қажет болса)

### Frontend
- `npm run dev` — Vite дев-сервері
- `npm run build` — Өндірістік жинақ
- `npm run preview` — Жиналған қолданбаны қарау
- `npm run lint` — ESLint

## Docker арқылы

```bash
# Backend бейнесі
cd backend
docker build -t prof20-api .

# Frontend бейнесі
cd ../frontend
docker build -t prof20-web .
```

## Қосымша

- OpenAPI құжаты: `http://localhost:4000/openapi.json`
- Seed есептік жазбалар:
  - admin@prof20.kz / Passw0rd!
  - agrohr@prof20.kz / Passw0rd!
  - student@prof20.kz / Passw0rd!

Барлық UI мәтіндері қазақ тілінде, қысқа орысша субтитрмен берілген.
