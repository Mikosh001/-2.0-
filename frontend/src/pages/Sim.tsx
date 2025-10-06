import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const fieldArea = 50_000; // m2

const Sim = () => {
  const [speed, setSpeed] = useState(5);
  const [altitude, setAltitude] = useState(60);
  const [swath, setSwath] = useState(15);
  const [result, setResult] = useState<{ time: number; overlap: number; pass: boolean } | null>(null);

  const handleRun = () => {
    const passes = Math.ceil(Math.sqrt(fieldArea) / swath);
    const pathLength = passes * Math.sqrt(fieldArea);
    const time = (pathLength / speed) / 60;
    const optimalOverlap = 0.2;
    const actualOverlap = Math.max(0, Math.min(1, 1 - swath / (altitude / 2)));
    const overlapError = Math.abs(actualOverlap - optimalOverlap);
    const pass = overlapError < 0.1 && altitude >= 40 && altitude <= 120;
    setResult({ time, overlap: overlapError * 100, pass });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Дрон маршруты симуляторы</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="Параметрлер (Параметры)">
          <div className="space-y-4 text-sm">
            <label className="flex flex-col gap-1">
              UAV жылдамдығы (м/с)
              <input
                type="number"
                value={speed}
                min={2}
                max={20}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              Ұшу биіктігі (м)
              <input
                type="number"
                value={altitude}
                min={20}
                max={150}
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              Қамту жолағы (м)
              <input
                type="number"
                value={swath}
                min={5}
                max={40}
                onChange={(e) => setSwath(Number(e.target.value))}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <Button onClick={handleRun}>Есептеу (Рассчитать)</Button>
          </div>
        </Card>
        <Card title="Маршрут визуализациясы">
          <div className="relative h-64 w-full rounded-xl bg-slate-100">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="absolute h-1 w-2/3 bg-primary"
                style={{ top: `${20 + idx * 20}%`, left: '10%' }}
              />
            ))}
            <div className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              UAV
            </div>
          </div>
          {result && (
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Қамту уақыты: {result.time.toFixed(1)} мин</p>
              <p>Қабаттасу қатесі: {result.overlap.toFixed(1)}%</p>
              <p className={result.pass ? 'text-success' : 'text-primary'}>
                {result.pass ? 'Жеткілікті (Прошел)' : 'Параметрлерді түзету қажет'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default Sim;
