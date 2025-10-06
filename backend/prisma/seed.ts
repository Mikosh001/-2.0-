import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  const [student, employer, admin] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'student@example.com',
        passwordHash,
        name: 'Айша Талғар',
        region: 'Алматы',
      },
    }),
    prisma.user.create({
      data: {
        email: 'employer@example.com',
        passwordHash,
        name: 'AgroTech LLP',
        role: Role.employer,
        region: 'Астана',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash,
        name: 'Админ',
        role: Role.admin,
      },
    }),
  ]);

  const courseData = [
    {
      title: 'Дрон-оператор — дәлме-дәл егін шаруашылығы',
      slug: 'dron-operator',
      summary:
        'UAV және картаға түсіру технологиялары бойынша 4 апталық бағдарлама. Даладағы қауіпсіздік пен деректер талдауы.',
      skills: ['UAV', 'Mapping', 'Safety'],
    },
    {
      title: 'Agro-IoT техник',
      slug: 'agro-iot',
      summary: 'Датчиктер, LoRaWAN байланысы және агро-дашбордтарды баптау.',
      skills: ['Sensors', 'LoRaWAN', 'Dashboards'],
    },
    {
      title: 'Smart-tractor телематика маманы',
      slug: 'smart-tractor',
      summary: 'CAN шинасы, GPS мониторингі және отын тиімділігін арттыру тәсілдері.',
      skills: ['CAN', 'GPS', 'Efficiency'],
    },
  ];

  const createdCourses = await Promise.all(
    courseData.map((c) =>
      prisma.course.create({
        data: {
          title: c.title,
          slug: c.slug,
          summary: c.summary,
          skills: c.skills,
          durationWeeks: 4,
          lessons: {
            create: Array.from({ length: 4 }).map((_, idx) => ({
              title: `${c.title} сабағы ${idx + 1}`,
              type: idx === 2 ? 'sim' : idx % 2 === 0 ? 'video' : 'task',
              order: idx + 1,
              videoUrl: idx % 2 === 0 ? 'https://www.example.com/video.mp4' : null,
              contentMd: `# ${c.title} сабағы ${idx + 1}\nПрактикалық материал және чек-лист.`,
            })),
          },
        },
        include: { lessons: true },
      })
    )
  );

  const quizQuestions = [] as { courseId: string; questions: any[] }[];

  createdCourses.forEach((course) => {
    const courseQuestions = [] as any[];
    const skillTags = course.skills;
    for (let i = 0; i < 30; i++) {
      const skill = skillTags[i % skillTags.length];
      courseQuestions.push({
        text: `${course.title} тест сұрағы ${i + 1}`,
        skillTag: skill,
        difficulty: ((i % 3) + 1) as 1 | 2 | 3,
        options: [
          { text: 'Дұрыс жауап', isCorrect: true },
          { text: 'Қате жауап', isCorrect: false },
          { text: 'Тағы бір нұсқа', isCorrect: false },
        ],
      });
    }
    quizQuestions.push({ courseId: course.id, questions: courseQuestions });
  });

  await Promise.all(
    quizQuestions.map(({ courseId, questions }) =>
      prisma.quiz.create({
        data: {
          title: 'Адаптив бақылау',
          courseId,
          questions: {
            create: questions,
          },
        },
      })
    )
  );

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: createdCourses[0].id,
      progress: 45,
    },
  });

  await prisma.badge.create({
    data: {
      userId: student.id,
      name: 'UAV Safety',
      skillTag: 'Safety',
      level: 'Standard',
    },
  });

  const jobs = [
    {
      title: 'Дрон картограф',
      city: 'Көкшетау',
      skillsRequired: ['UAV', 'Mapping'],
      description: 'Егістіктерді картаға түсіру және есеп беру.',
    },
    {
      title: 'Agro IoT интегратор',
      city: 'Алматы',
      skillsRequired: ['Sensors', 'Dashboards'],
      description: 'Ферма датчиктерін орнату және мониторинг.',
    },
    {
      title: 'Телематика аналитигі',
      city: 'Шымкент',
      skillsRequired: ['GPS', 'Efficiency'],
      description: 'Трактор деректерін талдау, тиімділік есептері.',
    },
    {
      title: 'CAN жүйесі инженері',
      city: 'Астана',
      skillsRequired: ['CAN', 'GPS'],
      description: 'Жабдықты қашықтан диагностика.',
    },
    {
      title: 'LoRaWAN координаторы',
      city: 'Қостанай',
      skillsRequired: ['LoRaWAN', 'Sensors'],
      description: 'Датчик желілерін енгізу.',
    },
  ];

  await Promise.all(
    jobs.map((job) =>
      prisma.job.create({
        data: {
          employerId: employer.id,
          salaryMin: 300000,
          salaryMax: 550000,
          ...job,
        },
      })
    )
  );

  const mentors = [
    {
      user: await prisma.user.create({
        data: {
          email: 'mentor1@example.com',
          passwordHash,
          name: 'Ермек Дронов',
          region: 'Ақмола',
        },
      }),
      skills: ['UAV', 'Safety'],
      bio: '10 жылдық UAV операция тәжірибесі.',
    },
    {
      user: await prisma.user.create({
        data: {
          email: 'mentor2@example.com',
          passwordHash,
          name: 'Гүлнар IoT',
          region: 'Алматы',
        },
      }),
      skills: ['Sensors', 'Dashboards'],
      bio: 'Agro-IoT жобаларының жетекшісі.',
    },
    {
      user: await prisma.user.create({
        data: {
          email: 'mentor3@example.com',
          passwordHash,
          name: 'Айдын Трактор',
          region: 'ШҚО',
        },
      }),
      skills: ['CAN', 'GPS'],
      bio: 'Smart-tractor телематика бойынша сарапшы.',
    },
  ];

  await Promise.all(
    mentors.map(({ user, skills, bio }, index) =>
      prisma.mentor.create({
        data: {
          userId: user.id,
          skills,
          bio,
          calendarUrl: `https://cal.example.com/mentor-${index + 1}`,
        },
      })
    )
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
