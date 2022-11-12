import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import Input from '../ui-components/Input';
import Button from '../ui-components/Button';
import * as yup from 'yup';

const distributionFormSchema = yup.object({
    projectName: yup.string().label('Project name').trim().required().min(3).max(50),
    projectAddress: yup
        .string()
        .label('Project address')
        .trim()
        .required()
        .matches(/^[a-z0-9_]+$/, { message: 'Use only lowercase letters, numbers and "_"', excludeEmptyString: true })
        .min(3)
        .max(50),
    totalProperties: yup
        .number()
        .label('Amount of properties')
        .typeError('Enter the amount of properties for distribution')
        .integer()
        .required()
        .min(1)
        .max(1_000_000),
    distributionDate: yup
        .date()
        .label('Distribution time')
        .min(new Date(), 'Distribution time must be in the future')
        .typeError('Distribution time is required')
        .required(),
    reservedProperties: yup
        .string()
        .label('Reserved Properties')
        .trim()
        .notRequired()
        .matches(/^[\s\d\-;]+$/, { message: 'Example: 1-10; 20-30; 40; 50', excludeEmptyString: true }),
});
export type DistributionFormValue = yup.InferType<typeof distributionFormSchema>;

export type DistributionFormSchemaProps = {
    values?: Partial<DistributionFormValue>;
    minDistributionDate?: Date;
    onDistributionRequest: (values: DistributionFormValue) => unknown;
};

const PropertyDistributionForm: React.FC<DistributionFormSchemaProps> = ({
    values,
    minDistributionDate,
    onDistributionRequest,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm<DistributionFormValue>({ resolver: yupResolver(distributionFormSchema) });

    useEffect(() => {
        if (values) {
            values.projectAddress && setValue('projectAddress', values.projectAddress);
            values.projectName && setValue('projectName', values.projectName);
            values.totalProperties && setValue('totalProperties', values.totalProperties);
            values.distributionDate && setValue('distributionDate', values.distributionDate);
            values.reservedProperties && setValue('reservedProperties', values.reservedProperties);
        }

        if (
            process.env.NODE_ENV === 'development' &&
            (!values?.totalProperties || !values?.distributionDate || values?.reservedProperties)
        ) {
            const nowPlus15Days = new Date(
                (minDistributionDate ? new Date(minDistributionDate.toISOString()) : new Date()).setDate(
                    new Date().getDate() + 15
                )
            );
            setValue('totalProperties', 20);
            setValue('distributionDate', (nowPlus15Days.toISOString().split('T')[0] + 'T10:00') as unknown as Date);
            setValue('reservedProperties', '4-10; 12');
        }
    }, [values, setValue, minDistributionDate]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = () => {
        setIsSubmitting(false);
    };

    const onSubmit = async (data: DistributionFormValue) => {
        if (isSubmitting) {
            onDistributionRequest(data);
        } else {
            // Validate min distribution date
            if (minDistributionDate && minDistributionDate > data.distributionDate) {
                setError('distributionDate', {
                    type: 'manual',
                    message: `Distribution date must be later than close date (${minDistributionDate.toLocaleDateString()})`,
                });
            } else {
                setIsSubmitting(true);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-x-20">
                <Input
                    id="projectName"
                    type="text"
                    placeholder="Project Name"
                    isDisabled
                    isInvalid={!!errors.projectName}
                    errorText={errors.projectName?.message as string | undefined}
                    {...register('projectName')}
                />
                <Input
                    id="projectAddress"
                    type="text"
                    placeholder="Project Address"
                    labelRight=".near"
                    isDisabled
                    isInvalid={!!errors.projectAddress}
                    errorText={errors.projectAddress?.message as string | undefined}
                    {...register('projectAddress')}
                />
                <Input
                    id="totalProperties"
                    type="number"
                    placeholder="Amount of Properties"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.totalProperties}
                    errorText={errors.totalProperties?.message as string | undefined}
                    {...register('totalProperties')}
                />
                <Input
                    id="distributionDate"
                    type="datetime-local"
                    min={(minDistributionDate ?? new Date()).toISOString().split('T')[0]}
                    isDisabled={isSubmitting}
                    placeholder="Distribution Time"
                    isInvalid={!!errors.distributionDate}
                    errorText={errors.distributionDate?.message as string | undefined}
                    {...register('distributionDate')}
                />
                <Input
                    id="reservedProperties"
                    type="text"
                    placeholder="Reserved Properties"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.reservedProperties}
                    errorText={errors.reservedProperties?.message as string | undefined}
                    {...register('reservedProperties')}
                />
                <div className="col-span-2">
                    <Button isInvertedColor size="md" className="mt-10 " type="submit">
                        {isSubmitting ? 'CONFIRM' : 'CREATE'}
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

export default PropertyDistributionForm;
