# Профессия 2.0 — Цифрлық кадровый резерв АПК

Моно-репо React + Express + PostgreSQL жобаcы. Студенттер үшін оқыту платформасы, жұмыс берушілерге арналған кабинет және әкімші панелі.

## Құрылым

- `backend/` — Node.js (Express + Prisma) REST API
- `frontend/` — Vite + React TypeScript клиенті
- `docker-compose.yml` — PostgreSQL дерекқоры

## Алдын ала талаптар

- Node.js 20+
- npm 10+
- Docker және Docker Compose

## Орнату қадамдары

```bash
cp .env.example .env
npm install --workspaces
cd backend
npm install
cd ../frontend
npm install
```

## Дерекқорды іске қосу

```bash
docker-compose up -d
```

Миграциялар мен бастапқы деректер:

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

## Даму режимі

Бекенд:

```bash
cd backend
npm run dev
```

Фронтенд:

```bash
cd frontend
npm run dev
```

API URL: `http://localhost:4000`, Frontend: `http://localhost:5173`

## Негізгі мүмкіндіктер

- Email/пароль аутентификациясы (JWT)
- Курстар, сабақтар, адаптив тесттер (бейдж беру логикасы)
- Симулятор және портфолио QR-коды
- Жұмыс ұсыныстары, сәйкестік бағасы, өтінімдер
- Жұмыс беруші кабинеті және әкімшілік CRUD
- OpenAPI сипаттамасы: `backend/openapi.json`

## Тіркелгі деректері (seed)

- Студент: `student@example.com` / `password123`
- Жұмыс беруші: `employer@example.com` / `password123`
- Әкімші: `admin@example.com` / `password123`

## Пайдалы командалар

```bash
# Линтинг
cd backend && npm run lint
cd frontend && npm run lint

# Өндірістік құрастыру
cd backend && npm run build
cd frontend && npm run build
```

## Қоршаған орта айнымалылары

`.env.example` файлын қараңыз:

- `DATABASE_URL`
- `JWT_SECRET`
- `CLIENT_URL`
- `VITE_API_URL`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (қосымша)

## Docker-мен іске қосу

Продакшн конфигурациясы үлгі ретінде `backend/Dockerfile` берілген. Клиентті бөлек қызметке жинақтаңыз немесе статикалық хостингке шығарыңыз.
