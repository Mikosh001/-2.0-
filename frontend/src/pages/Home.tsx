import { kk } from '../i18n/kk';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const Home = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary/10 via-white to-success/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center md:flex-row md:text-left">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">{kk.slogan}</h1>
            <p className="text-lg text-slate-600">
              Агроөнеркәсіпте цифрлық дағдыларды меңгеріп, нақты симуляторлар арқылы тәжірибе жинаңыз.
            </p>
            <ul className="space-y-2 text-left text-slate-700">
              {kk.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button className="text-lg shadow-lg" aria-label="Оқуды бастау">
              {kk.cta}
            </Button>
          </div>
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card title="AgroTech Lab" subtitle="Практика" className="backdrop-blur">
                <p className="text-sm text-slate-600">
                  Дрон және IoT симуляторларымен апталық хакатондар.
                </p>
              </Card>
              <Card title="Jobs Hub" subtitle="Вакансиялар">
                <p className="text-sm text-slate-600">Сертификат алғаннан кейін жұмыс ұсыныстары.</p>
              </Card>
              <Card title="Mentor+" subtitle="Тәлімгерлік">
                <p className="text-sm text-slate-600">Саладағы жетекші мамандармен жеке сессиялар.</p>
              </Card>
              <Card title="AgriAnalytics" subtitle="Деректер">
                <p className="text-sm text-slate-600">Қашықтан мониторинг пен цифрлық бақылау.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-semibold text-slate-900">{kk.partners}</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400"
              >
                Logo {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
