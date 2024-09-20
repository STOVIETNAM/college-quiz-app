import useAppContext from '~hooks/useAppContext';
import SecurityContent from './SecurityContent';
import SystemContent from './SystemContent';

export default function SettingsContent({ name }: { name: string; }) {
    const { user } = useAppContext();
    if (!user.user) return null;
    if (name === 'system') return <SystemContent />;
    if (name === 'notifications') return (
        <>
        </>
    );
    if (name === 'security') return <SecurityContent />;
    return null;
}
