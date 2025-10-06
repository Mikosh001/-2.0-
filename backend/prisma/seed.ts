import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hashPassword = async (password: string) => bcrypt.hash(password, 10);

const courseSeeds = [
  {
    title: 'Дрон-оператор — дәл егіншілік',
    slug: 'uav-operator',
    summary:
      'Дрондармен жұмыс істеп, егістік алқаптарын картаға түсіру және қауіпсіздік стандарттарын сақтау.',
    skills: ['UAV', 'Mapping', 'Safety'],
    lessons: [
      {
        type: 'video',
        title: 'Дрон қауіпсіздігі кіріспе',
        videoUrl: 'https://example.com/video1',
        contentMd:
          '## Қауіпсіздік\nДронды ұшырмас бұрын ауа райын тексеріңіз және рұқсат алыңыз.',
        order: 1,
      },
      {
        type: 'task',
        title: 'Ұшу жоспарын құру',
        contentMd:
          '### Жоспарлау\nQGIS немесе басқа құралдарды қолданып ұшу жоспарын құрыңыз.',
        order: 2,
      },
      {
        type: 'video',
        title: 'Карта жасау және талдау',
        videoUrl: 'https://example.com/video2',
        order: 3,
      },
      {
        type: 'sim',
        title: 'Маршрут симуляциясы',
        contentMd: 'Симулятор арқылы маршрутты қайталаңыз.',
        order: 4,
      },
    ],
  },
  {
    title: 'Agro-IoT техник — далалық сенсорлар',
    slug: 'agro-iot',
    summary:
      'Сенсорлық желілерді орнатып, деректерді жинау және визуализациялау арқылы өнімділікті арттыру.',
    skills: ['Sensors', 'LoRaWAN', 'Dashboards'],
    lessons: [
      {
        type: 'video',
        title: 'IoT архитектурасы',
        videoUrl: 'https://example.com/iot1',
        order: 1,
      },
      {
        type: 'task',
        title: 'Сенсор конфигурациясы',
        contentMd: 'Температура сенсорын LoRaWAN желісіне қосыңыз.',
        order: 2,
      },
      {
        type: 'video',
        title: 'Деректер визуализациясы',
        videoUrl: 'https://example.com/iot2',
        order: 3,
      },
      {
        type: 'sim',
        title: 'Деректер ағынын тестілеу',
        contentMd: 'Деректер ағынын бақылау құралын қолданыңыз.',
        order: 4,
      },
    ],
  },
  {
    title: 'Smart-tractor телематика',
    slug: 'smart-tractor',
    summary:
      'CAN және GPS телематикасы арқылы трактор паркін оңтайландырыңыз.',
    skills: ['CAN', 'GPS', 'Efficiency'],
    lessons: [
      {
        type: 'video',
        title: 'CAN протоколы негіздері',
        videoUrl: 'https://example.com/can1',
        order: 1,
      },
      {
        type: 'task',
        title: 'Деректер жинау құрылғысын орнату',
        contentMd: 'Телематиканы тракторға орнатыңыз.',
        order: 2,
      },
      {
        type: 'video',
        title: 'GPS талдау',
        videoUrl: 'https://example.com/gps1',
        order: 3,
      },
      {
        type: 'sim',
        title: 'Отын тиімділігін есептеу',
        contentMd: 'Тиімділік калькуляторын қолданыңыз.',
        order: 4,
      },
    ],
  },
] as const;

const generateQuestions = (courseTitle: string, skillTags: string[]) => {
  const basePrompts = [
    'негізгі түсінігі қандай?',
    'тексеру қадамы?',
    'қателікті қалай болдырмау керек?',
    'ең жақсы құрал?',
    'метриканы есептеу формуласы?',
    'қауіпсіздік ережесі?',
    'талдау нәтижесі қалай қолданылады?',
    'калибрлеу жиілігі?',
    'қосымша дереккөзі?',
    'командада кім жауапты?',
  ];

  const difficulties = [1, 2, 3];

  const questions = [] as {
    text: string;
    skillTag: string;
    difficulty: number;
    options: { text: string; isCorrect: boolean }[];
  }[];

  let count = 0;
  while (questions.length < 10) {
    const skill = skillTags[count % skillTags.length];
    const diff = difficulties[count % difficulties.length];
    const prompt = basePrompts[count % basePrompts.length];
    questions.push({
      text: `${courseTitle} бойынша ${skill} ${prompt}`,
      skillTag: skill,
      difficulty: diff,
      options: [
        { text: 'Дұрыс жауап', isCorrect: true },
        { text: 'Жалған жауап', isCorrect: false },
        { text: 'Аралас жауап', isCorrect: false },
      ],
    });
    count += 1;
  }
  return questions;
};

async function main() {
  await prisma.badge.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const password = await hashPassword('password123');

  const [admin, employer, student] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@agro.kz',
        name: 'Админ АПК',
        role: Role.admin,
        passwordHash: password,
        region: 'Астана',
      },
    }),
    prisma.user.create({
      data: {
        email: 'employer@agro.kz',
        name: 'AgroTech Employer',
        role: Role.employer,
        passwordHash: password,
        region: 'Алматы',
      },
    }),
    prisma.user.create({
      data: {
        email: 'student@agro.kz',
        name: 'Даму Студент',
        role: Role.student,
        passwordHash: password,
        region: 'Қостанай',
      },
    }),
  ]);

  for (const courseSeed of courseSeeds) {
    const course = await prisma.course.create({
      data: {
        title: courseSeed.title,
        slug: courseSeed.slug,
        summary: courseSeed.summary,
        skills: courseSeed.skills as unknown as string[],
        durationWeeks: 4,
        lessons: {
          create: courseSeed.lessons.map((lesson) => ({
            type: lesson.type as any,
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            contentMd: lesson.contentMd,
            order: lesson.order,
          })),
        },
        quizzes: {
          create: {
            title: `${courseSeed.title} адаптив квиз`,
            questions: {
              create: generateQuestions(courseSeed.title, courseSeed.skills).map(
                (q) => ({
                  text: q.text,
                  skillTag: q.skillTag,
                  difficulty: q.difficulty,
                  options: q.options as unknown as object,
                })
              ),
            },
          },
        },
      },
    });

    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id,
        progress: 25,
      },
    });
  }

  await prisma.badge.createMany({
    data: [
      {
        userId: student.id,
        name: 'UAV қауіпсіздік',
        skillTag: 'Safety',
        level: 'Standard',
        qrCodeUrl: null,
      },
      {
        userId: student.id,
        name: 'LoRaWAN конфигуратор',
        skillTag: 'LoRaWAN',
        level: 'Advanced',
        qrCodeUrl: null,
      },
    ],
  });

  const jobsData = [
    {
      employerId: employer.id,
      title: 'UAV миссия жетекшісі',
      city: 'Түркістан',
      salaryMin: 350000,
      salaryMax: 450000,
      skillsRequired: ['UAV', 'Mapping'],
      description: 'Егістікті түсіру және карта жасауға жауапты команда.',
    },
    {
      employerId: employer.id,
      title: 'Агро-IoT аналитик',
      city: 'Алматы',
      salaryMin: 400000,
      salaryMax: 520000,
      skillsRequired: ['Sensors', 'Dashboards'],
      description: 'Сенсорлар желісін қадағалап, дашборд дайындау.',
    },
    {
      employerId: employer.id,
      title: 'Телематика инженері',
      city: 'Қостанай',
      salaryMin: 380000,
      salaryMax: 480000,
      skillsRequired: ['CAN', 'GPS'],
      description: 'CAN шинасын талдау және GPS деректерін интеграциялау.',
    },
    {
      employerId: employer.id,
      title: 'Дрон қызмет провайдері',
      city: 'Астана',
      salaryMin: 360000,
      salaryMax: 440000,
      skillsRequired: ['Safety', 'UAV'],
      description: 'Дронды қауіпсіз ұшыру және қызмет көрсету.',
    },
    {
      employerId: employer.id,
      title: 'Agro IoT жобасы жетекшісі',
      city: 'Шымкент',
      salaryMin: 450000,
      salaryMax: 600000,
      skillsRequired: ['LoRaWAN', 'Dashboards', 'Sensors'],
      description: 'IoT жобаларын жоспарлау және іске асыру.',
    },
  ];

  const createdJobs = [] as { id: string }[];
  for (const job of jobsData) {
    const created = await prisma.job.create({ data: job });
    createdJobs.push({ id: created.id });
  }

  await prisma.mentor.createMany({
    data: [
      {
        userId: student.id,
        skills: ['UAV', 'Mapping'],
        bio: 'Дрондармен 5 жылдық тәжірибе.',
        calendarUrl: 'https://cal.example.com/uav',
      },
      {
        userId: employer.id,
        skills: ['Sensors', 'Dashboards'],
        bio: 'IoT жобаларын жүргізу.',
        calendarUrl: 'https://cal.example.com/iot',
      },
      {
        userId: admin.id,
        skills: ['CAN', 'GPS'],
        bio: 'Телематика сарапшысы.',
        calendarUrl: 'https://cal.example.com/telematics',
      },
    ],
  });

  if (createdJobs.length > 0) {
    await prisma.application.create({
      data: {
        jobId: createdJobs[0].id,
        userId: student.id,
        status: 'submitted',
      },
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
