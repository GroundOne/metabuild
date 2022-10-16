import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactNode, useEffect } from 'react';
import router from 'next/router';
import Input from '../ui-components/Input';
import Button from '../ui-components/Button';
import * as yup from 'yup';

export type PartFormSchemaProps = {
    values?: Partial<PartFormValue>;
    disabled?: boolean;
    onCreatePartRequest: (values: PartFormValue) => unknown;
};

const partFormSchema = yup.object({
    projectName: yup.string().label('Project name').required().min(3).max(16),
    partAmount: yup
        .number()
        .label('PART Amount')
        .typeError('Enter the number of PARTs')
        .integer()
        .required()
        .min(1)
        .max(1_000_000),
    saleOpeningBlock: yup.date().label('Sale opening block').typeError('Sale opening block is required').required(),
    saleCloseBlock: yup
        .date()
        .label('Sale close block')
        .typeError('Sale close block is required')
        .required()
        .min(yup.ref('saleOpeningBlock'), 'Sale close block must be after sale opening block'),
    partPrice: yup
        .number()
        .label('PART price')
        .typeError('PART Price is required')
        .integer()
        .required()
        .min(1)
        .max(1_000_000),
    backgroundImageLink: yup.string().label('Background image link').url().required(),
    reserveParts: yup
        .string()
        .label('Reserved PARTs')
        .trim()
        .notRequired()
        .matches(/[\s\d\-;]+/, { message: 'Example: 1-10; 20-30; 40; 50', excludeEmptyString: true }),
    reservePartsAddress: yup.string().label('Reserved PARTs address').required(),
});
export type PartFormValue = yup.InferType<typeof partFormSchema>;

const CreatePartForm: React.FC<PartFormSchemaProps> = ({ values, disabled, onCreatePartRequest }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<PartFormValue>({ resolver: yupResolver(partFormSchema) });

    useEffect(() => {
        if (values) {
            values.projectName && setValue('projectName', values.projectName);
            values.partAmount && setValue('partAmount', values.partAmount);
            values.saleOpeningBlock && setValue('saleOpeningBlock', values.saleOpeningBlock);
            values.saleCloseBlock && setValue('saleCloseBlock', values.saleCloseBlock);
            values.partPrice && setValue('partPrice', values.partPrice);
            values.backgroundImageLink && setValue('backgroundImageLink', values.backgroundImageLink);
            values.reserveParts && setValue('reserveParts', values.reserveParts);
            values.reservePartsAddress && setValue('reservePartsAddress', values.reservePartsAddress);
        }

        if (process.env.NODE_ENV === 'development' && !values) {
            setValue('projectName', 'FF demo project');
            setValue('partAmount', 100);
            setValue('saleOpeningBlock', new Date().toISOString().split('T')[0] as unknown as Date);
            setValue('saleCloseBlock', '2022-12-31' as unknown as Date);
            setValue('partPrice', 1);
            setValue('backgroundImageLink', 'https://example.com');
            setValue('reserveParts', '1-10; 20-30; 40; 50');
            setValue('reservePartsAddress', 'architect_name.near');
        }
    }, [values, setValue]);

    const onSubmit = (data: PartFormValue) => {
        onCreatePartRequest(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-x-20">
                <Input
                    id="projectName"
                    type="text"
                    placeholder="Project Name"
                    isInvalid={!!errors.projectName}
                    errorText={errors.projectName?.message as string | undefined}
                    {...register('projectName')}
                />
                <Input
                    id="partAmount"
                    type="number"
                    placeholder="Amount of PARTs"
                    isInvalid={!!errors.partAmount}
                    errorText={errors.partAmount?.message as string | undefined}
                    {...register('partAmount')}
                />
                <Input
                    id="saleOpeningBlock"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Sale Opening Block"
                    isInvalid={!!errors.saleOpeningBlock}
                    errorText={errors.saleOpeningBlock?.message as string | undefined}
                    {...register('saleOpeningBlock')}
                />
                <Input
                    id="saleCloseBlock"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Sale Close Block"
                    isInvalid={!!errors.saleCloseBlock}
                    errorText={errors.saleCloseBlock?.message as string | undefined}
                    {...register('saleCloseBlock')}
                />
                <Input
                    id="partPrice"
                    type="number"
                    placeholder="PART Price (NEAR)"
                    isInvalid={!!errors.partPrice}
                    errorText={errors.partPrice?.message as string | undefined}
                    {...register('partPrice')}
                />
                <Input
                    id="backgroundImageLink"
                    type="text"
                    placeholder="Background Image Link"
                    isInvalid={!!errors.backgroundImageLink}
                    errorText={errors.backgroundImageLink?.message as string | undefined}
                    {...register('backgroundImageLink')}
                />
                <Input
                    id="reserveParts"
                    type="text"
                    placeholder="Reserved PARTs"
                    isInvalid={!!errors.reserveParts}
                    errorText={errors.reserveParts?.message as string | undefined}
                    {...register('reserveParts')}
                />
                <Input
                    id="reservePartsAddress"
                    type="text"
                    placeholder="Reserved PARTs Address"
                    isInvalid={!!errors.reservePartsAddress}
                    errorText={errors.reservePartsAddress?.message as string | undefined}
                    {...register('reservePartsAddress')}
                />
                <Button isInvertedColor className="mt-10 w-2/3" type="submit">
                    CREATE
                </Button>
            </div>
        </form>
    );
};

export default CreatePartForm;
