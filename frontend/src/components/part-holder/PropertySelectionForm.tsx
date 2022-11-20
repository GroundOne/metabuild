import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Button from '../ui-components/Button';
import Input from '../ui-components/Input';

const selectionFormSchema = yup.object({
    selectedProperties: yup
        .string()
        .label('Reserved Properties')
        .trim()
        .notRequired()
        .matches(/^[\s\d\-;]+$/, { message: 'Example: 1-10; 20-30; 40; 50', excludeEmptyString: true }),
});
export type SelectionFormValue = yup.InferType<typeof selectionFormSchema>;

export type InitialisationFormSchemaProps = {
    values?: Partial<SelectionFormValue>;
    onPropertySelectionRequest: (values: SelectionFormValue) => unknown;
};

const PropertySelectionForm: React.FC<InitialisationFormSchemaProps> = ({
    values,
    onPropertySelectionRequest: onInitialisationRequest,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<SelectionFormValue>({ resolver: yupResolver(selectionFormSchema) });

    useEffect(() => {
        if (values) {
            values.selectedProperties && setValue('selectedProperties', values.selectedProperties);
        }

        if (process.env.NODE_ENV === 'development' && !values) {
            setValue('selectedProperties', '4-10; 12');
        }
    }, [values, setValue]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = () => {
        setIsSubmitting(false);
    };

    const onSubmit = async (data: SelectionFormValue) => {
        if (isSubmitting) {
            onInitialisationRequest(data);
        } else {
            setIsSubmitting(true);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-x-20">
                <Input
                    id="selectedProperties"
                    type="text"
                    placeholder="Reserved Properties"
                    infoText='Example: "1-10; 20-30; 40; 50"'
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.selectedProperties}
                    errorText={errors.selectedProperties?.message as string | undefined}
                    {...register('selectedProperties')}
                />
                <div className="col-span-2">
                    <Button isInvertedColor size="md" className="mt-10 " type="submit">
                        {isSubmitting ? 'CONFIRM' : 'SELECT'}
                    </Button>
                    {isSubmitting && (
                        <Button onClick={handleChange} isInvertedColor size="md" className="mt-10 ml-4">
                            CHANGE
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default PropertySelectionForm;
