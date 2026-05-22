import { NavLink } from 'react-router-dom';

const links = [
    { to: '/', label: 'HOME', end: true },
    { to: '/projects', label: 'PROJECTS', end: false },
    { to: '/about', label: 'ABOUT', end: false },
    { to: '/contact', label: 'CONTACT', end: false },
] as const;

/**
 * reloadDocument: cada ruta editorial recibe su HTML sin COEP de Babylon.
 * Sin esto, al volver desde /babylonPortfolio el iframe de YouTube queda bloqueado.
 */
export default function PrimaryNav() {
    return (
        <nav aria-label="Primary">
            <ul className="primary-nav">
                {links.map(({ to, label, end }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            end={end}
                            reloadDocument
                            className={({ isActive }) => (isActive ? 'active' : undefined)}
                        >
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
