export const Footer = () => (
  <footer className="bg-slate-900 text-white">
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
      <div>
        <h3 className="text-lg font-semibold">Профессия 2.0</h3>
        <p className="mt-2 text-sm text-slate-300">АПК болашағы — сенің цифрлық қолында!</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">Байланыс</h4>
        <ul className="mt-3 space-y-1 text-sm text-slate-300">
          <li>+7 777 000 00 00</li>
          <li>info@prof2.kz</li>
          <li>Алматы, Digital Agri Hub</li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">Әлеуметтік желі</h4>
        <div className="mt-3 flex gap-3 text-sm text-slate-300">
          <a href="#" className="hover:text-accent" aria-label="Instagram">
            Instagram
          </a>
          <a href="#" className="hover:text-accent" aria-label="Telegram">
            Telegram
          </a>
          <a href="#" className="hover:text-accent" aria-label="YouTube">
            YouTube
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-700 px-4 py-4 text-center text-xs text-slate-400">
      © {new Date().getFullYear()} Профессия 2.0
    </div>
  </footer>
);
