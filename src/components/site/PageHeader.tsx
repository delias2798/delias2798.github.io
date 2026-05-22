interface PageHeaderProps {
    label: string;
    title: string;
}

export default function PageHeader({ label, title }: PageHeaderProps) {
    return (
        <header className="page-header">
            <p className="page-header__label">{label}</p>
            <h1 className="page-header__title">{title}</h1>
        </header>
    );
}
