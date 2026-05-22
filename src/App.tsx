import { Routes, Route } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BabylonPortfolioPage from './pages/BabylonPortfolioPage';
import './styles/site/site.css';

function App() {
    return (
        <Routes>
            <Route element={<SiteLayout />}>
                <Route index element={<HomePage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
            </Route>
            <Route path="babylonPortfolio" element={<BabylonPortfolioPage />} />
        </Routes>
    );
}

export default App;
