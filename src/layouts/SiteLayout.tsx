import { Outlet, useLocation } from 'react-router-dom';
import PrimaryNav from '../components/site/PrimaryNav';
import BackButton from '../components/site/BackButton';
import DesignCredit from '../components/site/DesignCredit';
import { defaultLocale } from '../data/projects';

export default function SiteLayout() {
    const { pathname } = useLocation();
    const isHome = pathname === '/';
    const isAbout = pathname === '/about';

    return (
        <div className="site-root">
            <div className="site-layout">
                {!isHome && (
                    <div className="site-layout__back">
                        <BackButton />
                    </div>
                )}
                <div className="site-layout__nav">
                    <PrimaryNav />
                </div>
                <Outlet />
                {!isAbout && (
                    <footer className="site-layout__credit">
                        <DesignCredit locale={defaultLocale} variant="footer" />
                    </footer>
                )}
            </div>
        </div>
    );
}
