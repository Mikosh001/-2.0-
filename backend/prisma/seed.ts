import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Passw0rd!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@prof20.kz',
      passwordHash,
      name: 'Админ',
      role: Role.admin
    }
  });

  const employer = await prisma.user.create({
    data: {
      email: 'agrohr@prof20.kz',
      passwordHash,
      name: 'Agro HR',
      role: Role.employer,
      region: 'Астана'
    }
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@prof20.kz',
      passwordHash,
      name: 'Айдана',
      role: Role.student,
      region: 'Алматы'
    }
  });

  const coursesData = [
    {
      title: 'Дрон-оператор',
      slug: 'uav-operator',
      summary: 'Дәлме-дәл егіншілік үшін UAV қолдану.',
      skills: ['UAV', 'Mapping', 'Safety'],
      lessons: [
        { title: 'UAV негіздері', type: 'video', order: 1, videoUrl: 'https://example.com/uav1' },
        { title: 'Сапалы карта жасау', type: 'task', order: 2, contentMd: 'Mapbox практикасы' },
        { title: 'Ұшу қауіпсіздігі', type: 'video', order: 3, videoUrl: 'https://example.com/uav2' },
        { title: 'Агрода симулятор', type: 'sim', order: 4, contentMd: 'Дрон маршруты' }
      ]
    },
    {
      title: 'Agro-IoT техник',
      slug: 'agro-iot',
      summary: 'Датчиктер мен LoRaWAN желілерін басқару.',
      skills: ['Sensors', 'LoRaWAN', 'Dashboards'],
      lessons: [
        { title: 'Датчиктер экожүйесі', type: 'video', order: 1, videoUrl: 'https://example.com/iot1' },
        { title: 'LoRaWAN конфигурациясы', type: 'task', order: 2, contentMd: 'Gateway баптау' },
        { title: 'Аналитика панелі', type: 'video', order: 3, videoUrl: 'https://example.com/iot2' },
        { title: 'Ферма use-case', type: 'sim', order: 4, contentMd: 'Сенсор симуляциясы' }
      ]
    },
    {
      title: 'Smart-tractor телематика',
      slug: 'smart-tractor',
      summary: 'CAN және GPS арқылы өнімділік мониторингі.',
      skills: ['CAN', 'GPS', 'Efficiency'],
      lessons: [
        { title: 'CAN bus оқу', type: 'video', order: 1, videoUrl: 'https://example.com/can1' },
        { title: 'GPS карта', type: 'task', order: 2, contentMd: 'Трекинг жобасы' },
        { title: 'Тиімділік есептеу', type: 'video', order: 3, videoUrl: 'https://example.com/can2' },
        { title: 'Телематика симулятор', type: 'sim', order: 4, contentMd: 'Деректер талдау' }
      ]
    }
  ];

  for (const course of coursesData) {
    const created = await prisma.course.create({
      data: {
        title: course.title,
        slug: course.slug,
        summary: course.summary,
        skills: course.skills,
        lessons: {
          create: course.lessons.map((lesson) => ({
            ...lesson,
            type: lesson.type as any
          }))
        },
        quizzes: {
          create: {
            title: `${course.title} бағалау`
          }
        }
      },
      include: { quizzes: true }
    });

    const quizId = created.quizzes[0].id;
    const skills = course.skills;
    const questions = Array.from({ length: 10 }).map((_, index) => ({
      quizId,
      text: `${course.title} сұрақ ${index + 1}`,
      skillTag: skills[index % skills.length],
      difficulty: (index % 3) + 1,
      options: [
        { text: 'Дұрыс', isCorrect: true },
        { text: 'Қате', isCorrect: false }
      ]
    }));
    await prisma.question.createMany({ data: questions });
  }

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: (await prisma.course.findFirst({ where: { slug: 'uav-operator' } }))!.id,
      progress: 60
    }
  });

  const jobs = [
    {
      employerId: employer.id,
      title: 'UAV инспектор',
      city: 'Қостанай',
      salaryMin: 250000,
      salaryMax: 350000,
      skillsRequired: ['UAV', 'Safety'],
      description: 'Егістік мониторингі үшін дрон ұшыру.'
    },
    {
      employerId: employer.id,
      title: 'Agro IoT координатор',
      city: 'Алматы',
      salaryMin: 280000,
      salaryMax: 380000,
      skillsRequired: ['Sensors', 'Dashboards'],
      description: 'Ферма деректерін жинау және визуалдау.'
    },
    {
      employerId: employer.id,
      title: 'Телематика аналитигі',
      city: 'Астана',
      salaryMin: 300000,
      salaryMax: 420000,
      skillsRequired: ['GPS', 'Efficiency'],
      description: 'Трактор флотын талдау.'
    },
    {
      employerId: employer.id,
      title: 'LoRaWAN инженер',
      city: 'Шымкент',
      salaryMin: 260000,
      salaryMax: 360000,
      skillsRequired: ['LoRaWAN', 'Sensors'],
      description: 'Ауыл шаруашылық IoT желісін кеңейту.'
    },
    {
      employerId: employer.id,
      title: 'Дрон картограф',
      city: 'Ақтөбе',
      salaryMin: 240000,
      salaryMax: 340000,
      skillsRequired: ['Mapping', 'UAV'],
      description: 'Өнімділік карталарын құру.'
    }
  ];
  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  const mentors = [
    {
      userId: student.id,
      skills: ['UAV', 'Mapping'],
      bio: 'Дрон тәжірибесі бар тәлімгер.',
      calendarUrl: 'https://calendly.com/uav-mentor'
    },
    {
      userId: employer.id,
      skills: ['Sensors', 'LoRaWAN'],
      bio: 'IoT инженер, тәжірибесі 7 жыл.',
      calendarUrl: 'https://calendly.com/iot-mentor'
    },
    {
      userId: admin.id,
      skills: ['GPS', 'Efficiency'],
      bio: 'Телематика сарапшысы.',
      calendarUrl: 'https://calendly.com/tractor-mentor'
    }
  ];

  for (const mentor of mentors) {
    await prisma.mentor.create({ data: mentor });
  }

  await prisma.badge.create({
    data: {
      userId: student.id,
      name: 'UAV негіздері',
      skillTag: 'UAV',
      level: 'Standard'
    }
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
