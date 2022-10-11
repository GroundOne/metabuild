import AppCard from '../ui-components/AppCard';
import CreatePartForm from './CreatePartForm';

export default function CreatePart() {
    return (
        <AppCard>
            <div className="font-semibold">Create PART Scheme</div>
            <CreatePartForm />
        </AppCard>
    );
}
