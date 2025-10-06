import { kk } from '../i18n/kk';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div>
        <h4>Профессия 2.0</h4>
        <p>{kk.footer.contacts}: info@prof2030.kz</p>
        <p>+7 (7172) 000 000</p>
      </div>
      <div>
        <p>{kk.footer.socials}</p>
        <div className="footer-socials">
          <a href="#" aria-label="Telegram">
            Telegram
          </a>
          <a href="#" aria-label="Instagram">
            Instagram
          </a>
        </div>
      </div>
      <div className="footer-rights">{kk.footer.rights}</div>
    </div>
  </footer>
);

export default Footer;
