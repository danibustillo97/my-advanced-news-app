import Link from 'next/link';
import { FaEnvelope, FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-lg" style={{ backgroundColor: '#001433', borderRadius: '10px', padding: '10px 20px' }}>
      <a className="navbar-brand text-white fs-3" href="#" style={{ fontWeight: 'bold', letterSpacing: '1px' }}>Logo</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <Link href="/" className="nav-link text-white" style={{ fontSize: '16px', textTransform: 'uppercase', fontWeight: '600', padding: '10px 15px' }}>Inicio</Link>
          </li>
          <li className="nav-item">
            <Link href="/recent" className="nav-link text-white" style={{ fontSize: '16px', textTransform: 'uppercase', fontWeight: '600', padding: '10px 15px' }}>Recientes</Link>
          </li>
          <li className="nav-item">
            <Link href="/addNews" className="nav-link text-white" style={{ fontSize: '16px', textTransform: 'uppercase', fontWeight: '600', padding: '10px 15px' }}>Add News</Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link href="/inbox" className="nav-link text-white" style={{ fontSize: '16px', padding: '10px 15px' }}><FaEnvelope /> <span className="d-none d-lg-inline">Bandeja de entrada</span></Link>
          </li>
          <li className="nav-item">
            <Link href="/profile" className="nav-link text-white" style={{ fontSize: '16px', padding: '10px 15px' }}><FaUser /> <span className="d-none d-lg-inline">Usuario</span></Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
