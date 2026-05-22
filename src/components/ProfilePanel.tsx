import React from 'react';
import type { Locale } from '../types/Locale';
import { getProfileSkillsByCategory, getProfileText } from '../data/profile';
import '../styles/ProfilePanel.css';

interface ProfilePanelProps {
    locale: Locale;
    collapsed?: boolean;
    onToggle?: () => void;
}

const labels = {
    skills: { es: 'Habilidades', en: 'Skills' },
    showProfile: { es: 'Ver perfil', en: 'View profile' },
    hideProfile: { es: 'Ocultar perfil', en: 'Hide profile' },
};

const ProfilePanel: React.FC<ProfilePanelProps> = ({
    locale,
    collapsed = false,
    onToggle,
}) => {
    const text = getProfileText(locale);
    const skillsByCategory = getProfileSkillsByCategory(locale);

    return (
        <aside className={`profile-panel ${collapsed ? 'collapsed' : ''}`}>
            <button
                type="button"
                className="profile-toggle"
                onClick={onToggle}
                aria-expanded={!collapsed}
            >
                {collapsed ? labels.showProfile[locale] : labels.hideProfile[locale]}
            </button>

            {!collapsed && (
                <div className="profile-panel-body">
                    <p className="profile-role">{text.role}</p>
                    <h2 className="profile-headline">{text.headline}</h2>
                    <p className="profile-summary">{text.summary}</p>

                    <h3 className="profile-skills-title">{labels.skills[locale]}</h3>
                    <div className="profile-skills-groups">
                        {Object.entries(skillsByCategory).map(([category, skills]) => (
                            <div key={category} className="skill-group">
                                <span className="skill-group-label">{category}</span>
                                <div className="skill-group-tags">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="profile-skill-tag"
                                            title={`${skill.projectCount} ${
                                                locale === 'es' ? 'proyectos' : 'projects'
                                            }`}
                                        >
                                            {skill.name[locale]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default ProfilePanel;
