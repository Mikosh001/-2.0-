# Профессия 2.0 — Цифрлық кадрлық резерв АПК

AgriTech саласына арналған upskilling платформасы: студенттер курстарды оқып, адаптивті квизден өтіп бейдждер алады, портфолио жинайды, ал жұмыс берушілер цифрлық мамандармен тікелей байланысады.

## Құрылым

```
- backend/  — Node.js + Express + Prisma API
- frontend/ — Vite + React TypeScript клиенті
- prisma/   — дерекқор схемасы және seed
```

## Алдын ала талаптар

- Node.js 20+
- npm 9+
- Docker + Docker Compose (PostgreSQL үшін)

## Орнату қадамдары

1. Репоны көшіру және тәуелділіктерді орнату:

```bash
npm install --prefix backend
npm install --prefix frontend
```

2. Қоршаған орта айнымалылары:

```
cp .env.example .env
# қажет болса мәндерді толтырыңыз
```

3. PostgreSQL контейнерін іске қосу:

```bash
docker-compose up -d
```

4. Prisma миграциялары мен бастапқы деректер:

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..
```

5. Даму серверлері:

```bash
npm run dev --prefix backend   # API http://localhost:4000
npm run dev --prefix frontend  # UI http://localhost:5173
```

## Негізгі мүмкіндіктер

- **Аутентификация**: студент, жұмыс беруші, әкімші рөлдері (JWT).
- **Курстар мен сабақтар**: сабақтар тізімі, контент, симуляторға дейінгі жол.
- **Адаптивті квиз**: 10 сұрақ, динамикалық қиындығы, бейдж беру логикасы.
- **Портфолио және QR**: бейдждер, мини-жоба сілтемесі, симулятор нәтижесі, ашық профиль.
- **Вакансиялар және matching**: студент дағдыларына негізделген ұсынулар, өтінімдер.
- **Жұмыс беруші кабинеті**: вакансия қосу және кандидаттарды қарау.
- **Админ панелі**: курстарды және контентті CRUD.
- **OpenAPI**: `GET /openapi.json` арқылы қолжетімді.

## Скрипттер

### Backend
- `npm run dev` — ts-node-dev арқылы сервер
- `npm run build` — TypeScript компиляциясы
- `npm run start` — production режимі
- `npm run prisma:migrate` — миграция жүргізу
- `npm run prisma:seed` — seed іске қосу

### Frontend
- `npm run dev` — Vite dev сервері
- `npm run build` — production build
- `npm run preview` — жинақты қарау

## Тесттік аккаунттар (seed)

| Рөл       | Email              | Құпиясөз       |
|-----------|--------------------|----------------|
| Админ     | admin@agro.kz      | password123    |
| Жұмыс беруші | employer@agro.kz | password123    |
| Студент   | student@agro.kz    | password123    |

## Docker

`backend/Dockerfile` production build-ты дайындайды. Қажет болса, docker-compose файлына backend сервисін қосып, `DATABASE_URL` айнымалысын контейнер URL-не бағыттаңыз.

## Линт және форматтау

- Prettier конфигурациясы: `.prettierrc`
- ESLint: `.eslintrc.cjs`

## Қосымша

- Симулятор нәтижелері портфолиоға автоматты түрде қосылады.
- Ашық профиль: `https://localhost:5173/u/:id` QR арқылы бөлісуге дайын.
