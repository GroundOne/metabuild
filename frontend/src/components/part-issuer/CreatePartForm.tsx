import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import constants from '../../constants';
import Button from '../ui-components/Button';
import Input from '../ui-components/Input';
import { NearContext } from '../walletContext';

export type PartFormSchemaProps = {
    values?: Partial<PartFormValue>;
    onCreatePartRequest: (values: PartFormValue) => unknown;
};

const partFormSchema = yup.object({
    projectAddress: yup
        .string()
        .label('Project address')
        .trim()
        .required()
        .matches(/^[a-z0-9_]+$/, { message: 'Use only lowercase letters, numbers and "_"', excludeEmptyString: true })
        .min(3)
        .max(50),
    projectName: yup.string().label('Project name').trim().required().min(3).max(50),
    partAmount: yup
        .number()
        .label('PART Amount')
        .typeError('Enter the number of PARTs')
        .integer()
        .required()
        .min(1)
        .max(1_000_000),
    saleOpeningDate: yup.date().label('Sale opening time').typeError('Sale opening time is required').required(),
    saleCloseDate: yup
        .date()
        .label('Sale close time')
        .typeError('Sale close time is required')
        .required()
        .min(yup.ref('saleOpeningDate'), 'Sale close time must be after sale opening time'),
    partPrice: yup
        .number()
        .label('PART price')
        .typeError('PART Price is required')
        // .integer()
        .required()
        .min(constants.MIN_PART_PRICE, `PART price must be at least ${constants.MIN_PART_PRICE} Ⓝ`)
        .max(constants.MAX_PART_PRICE, `PART price must be at most ${constants.MAX_PART_PRICE} Ⓝ`),
    backgroundImageLink: yup.string().label('Background image link').url(),
    reserveParts: yup
        .string()
        .label('Reserved PARTs')
        .trim()
        .notRequired()
        .matches(/^[\s\d\-;]+$/, { message: 'Example: 1-10; 20-30; 40; 50', excludeEmptyString: true }),
});
export type PartFormValue = yup.InferType<typeof partFormSchema>;

const CreatePartForm: React.FC<PartFormSchemaProps> = ({ values, onCreatePartRequest }) => {
    const { contract } = useContext(NearContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm<PartFormValue>({ resolver: yupResolver(partFormSchema) });

    useEffect(() => {
        if (values) {
            values.projectAddress && setValue('projectAddress', values.projectAddress);
            values.projectName && setValue('projectName', values.projectName);
            values.partAmount && setValue('partAmount', values.partAmount);
            values.saleOpeningDate && setValue('saleOpeningDate', values.saleOpeningDate);
            values.saleCloseDate && setValue('saleCloseDate', values.saleCloseDate);
            values.partPrice && setValue('partPrice', values.partPrice);
            values.backgroundImageLink && setValue('backgroundImageLink', values.backgroundImageLink);
            values.reserveParts && setValue('reserveParts', values.reserveParts);
        }

        if (process.env.NODE_ENV === 'development' && !values) {
            const nowPlus5Days = new Date(new Date().setDate(new Date().getDate() + 5));
            const nowPlus10Days = new Date(new Date().setDate(new Date().getDate() + 10));

            const projectCode = new Date()
                .toISOString()
                .slice(0, -8)
                .replaceAll('-', '_')
                .replaceAll(':', '_')
                .replaceAll('T', '_');
            setValue('projectAddress', 'demo_' + projectCode);
            setValue('projectName', 'Demo ' + projectCode);
            setValue('partAmount', 50);
            setValue('partPrice', 0.1);
            setValue('saleOpeningDate', (nowPlus5Days.toISOString().split('T')[0] + 'T10:00') as unknown as Date);
            setValue('saleOpeningDate', new Date().toISOString().slice(0, -8) as unknown as Date);
            setValue('saleCloseDate', (nowPlus10Days.toISOString().split('T')[0] + 'T10:00') as unknown as Date);
            setValue('saleCloseDate', new Date().toISOString().slice(0, -8) as unknown as Date);
            setValue(
                'backgroundImageLink',
                'https://images.squarespace-cdn.com/content/v1/63283ec16922c81dc0f97e2f/e3150b7f-bfc8-4251-ad50-3344f4b21b3d/image.jpg'
            );
            setValue('reserveParts', '3-4;40');
        }
    }, [values, setValue]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = () => {
        setIsSubmitting(false);
    };

    const onSubmit = async (data: PartFormValue) => {
        if (isSubmitting) {
            onCreatePartRequest(data);
        } else {
            // Validate unique contract ID
            const existingProjectAddresses = await contract
                .getContracts()
                .then((contracts) => contracts.map((contract: { projectAddress: string }) => contract.projectAddress));

            if (existingProjectAddresses.includes(data.projectAddress)) {
                setError('projectAddress', {
                    type: 'manual',
                    message: 'Project address is already taken',
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
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.projectName}
                    errorText={errors.projectName?.message as string | undefined}
                    {...register('projectName')}
                />
                <Input
                    id="projectAddress"
                    type="text"
                    placeholder="Project Account"
                    // labelRight=".near"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.projectAddress}
                    errorText={errors.projectAddress?.message as string | undefined}
                    {...register('projectAddress')}
                />
                <Input
                    id="partAmount"
                    type="number"
                    placeholder="Amount of PARTs"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.partAmount}
                    errorText={errors.partAmount?.message as string | undefined}
                    {...register('partAmount')}
                />
                <Input
                    id="partPrice"
                    type="number"
                    min={constants.MIN_PART_PRICE}
                    max={constants.MAX_PART_PRICE}
                    step={constants.MIN_PART_PRICE}
                    inputMode="decimal"
                    placeholder="PART Price (NEAR)"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.partPrice}
                    errorText={errors.partPrice?.message as string | undefined}
                    {...register('partPrice')}
                />
                <Input
                    id="saleOpeningDate"
                    type="datetime-local"
                    min={new Date().toISOString().split('T')[0]}
                    isDisabled={isSubmitting}
                    placeholder="Sale Opening Time"
                    isInvalid={!!errors.saleOpeningDate}
                    errorText={errors.saleOpeningDate?.message as string | undefined}
                    {...register('saleOpeningDate')}
                />
                <Input
                    id="saleCloseDate"
                    type="datetime-local"
                    min={new Date().toISOString().split('T')[0]}
                    isDisabled={isSubmitting}
                    placeholder="Sale Close Time"
                    isInvalid={!!errors.saleCloseDate}
                    errorText={errors.saleCloseDate?.message as string | undefined}
                    {...register('saleCloseDate')}
                />
                <Input
                    id="backgroundImageLink"
                    type="text"
                    placeholder="Background Image Link"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.backgroundImageLink}
                    errorText={errors.backgroundImageLink?.message as string | undefined}
                    {...register('backgroundImageLink')}
                />
                <Input
                    id="reserveParts"
                    type="text"
                    placeholder="Reserved PARTs"
                    infoText='Example: "1-10; 20-30; 40; 50"'
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.reserveParts}
                    errorText={errors.reserveParts?.message as string | undefined}
                    {...register('reserveParts')}
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

export default CreatePartForm;
