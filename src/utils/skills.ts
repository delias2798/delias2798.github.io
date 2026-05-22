import type { Locale } from '../types/Locale';
import { t } from '../types/Locale';
import { skillsById } from '../data/skills';

export function getSkillNames(skillIds: string[], locale: Locale): string[] {
    return skillIds
        .map((id) => skillsById[id])
        .filter(Boolean)
        .map((skill) => t(skill.name, locale));
}
