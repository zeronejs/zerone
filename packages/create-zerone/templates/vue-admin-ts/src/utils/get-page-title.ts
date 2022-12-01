import defaultSettings from '@/settings';

const title = defaultSettings.title || 'Vue Admin Template';

export default function getPageTitle(pageTitle: string) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`;
    }
    return `${title}`;
}
