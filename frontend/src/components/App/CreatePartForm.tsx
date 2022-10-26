import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import Input from '../ui-components/Input';
import Button from '../ui-components/Button';
import * as yup from 'yup';

export type PartFormSchemaProps = {
    values?: Partial<PartFormValue>;
    onCreatePartRequest: (values: PartFormValue) => unknown;
};

const partFormSchema = yup.object({
    projectName: yup
        .string()
        .label('Project name')
        .required()
        .test('all ascii', 'Project name must be all ascii letters or space or _', (value) => {
            const re = /[ -~_]/; // all ascii + " " + -

            if (re.test(String(value).toLowerCase())) {
                return true;
            } else {
                return false;
            }
        })
        .min(3)
        .max(16),
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
        .required(),
        // .positive()
        // .min(0.001)
        // .max(1_000_000),
        // .moreThan(0.001),
    backgroundImageLink: yup.string().label('Background image link').url().required(),
    reserveParts: yup
        .string()
        .label('Reserved PARTs')
        .trim()
        .notRequired()
        .matches(/^[\s\d\-;]+$/, { message: 'Example: 1-10; 20-30; 40; 50', excludeEmptyString: true }),
    reservePartsAddress: yup.string().label('Reserved PARTs address').required(),
});
export type PartFormValue = yup.InferType<typeof partFormSchema>;

const CreatePartForm: React.FC<PartFormSchemaProps> = ({ values, onCreatePartRequest }) => {
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
            const nowPlus5Days = new Date(new Date().setDate(new Date().getDate() + 5));
            const nowPlus10Days = new Date(new Date().setDate(new Date().getDate() + 10));

            setValue('projectName', 'FF demo project');
            setValue('partAmount', 100);
            setValue('saleOpeningBlock', (nowPlus5Days.toISOString().split('T')[0] + 'T10:00') as unknown as Date);
            setValue(
                'saleCloseBlock',
                (nowPlus10Days.toISOString().split('T')[0] + 'T10:00') as unknown as Date as unknown as Date
            );
            setValue('partPrice', 0.001);
            setValue(
                'backgroundImageLink',
                'https://images.squarespace-cdn.com/content/v1/63283ec16922c81dc0f97e2f/e3150b7f-bfc8-4251-ad50-3344f4b21b3d/image.jpg?format=2500w'
            );
            setValue('reserveParts', '1-10; 20-30; 40; 50');
            setValue('reservePartsAddress', 'groundone.testnet');
        }
    }, [values, setValue]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = () => {
        setIsSubmitting(false);
    };

    const onSubmit = (data: PartFormValue) => {
        if (isSubmitting) {
            onCreatePartRequest(data);
        } else {
            setIsSubmitting(true);
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
                    id="partAmount"
                    type="number"
                    placeholder="Amount of PARTs"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.partAmount}
                    errorText={errors.partAmount?.message as string | undefined}
                    {...register('partAmount')}
                />
                <Input
                    id="saleOpeningBlock"
                    type="datetime-local"
                    min={new Date().toISOString().split('T')[0]}
                    isDisabled={isSubmitting}
                    placeholder="Sale Opening Block"
                    isInvalid={!!errors.saleOpeningBlock}
                    errorText={errors.saleOpeningBlock?.message as string | undefined}
                    {...register('saleOpeningBlock')}
                />
                <Input
                    id="saleCloseBlock"
                    type="datetime-local"
                    min={new Date().toISOString().split('T')[0]}
                    isDisabled={isSubmitting}
                    placeholder="Sale Close Block"
                    isInvalid={!!errors.saleCloseBlock}
                    errorText={errors.saleCloseBlock?.message as string | undefined}
                    {...register('saleCloseBlock')}
                />
                <Input
                    id="partPrice"
                    type="number"
                    placeholder="PART Price (NEAR)"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.partPrice}
                    errorText={errors.partPrice?.message as string | undefined}
                    {...register('partPrice')}
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
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.reserveParts}
                    errorText={errors.reserveParts?.message as string | undefined}
                    {...register('reserveParts')}
                />
                <Input
                    id="reservePartsAddress"
                    type="text"
                    placeholder="Reserved PARTs Address"
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.reservePartsAddress}
                    errorText={errors.reservePartsAddress?.message as string | undefined}
                    {...register('reservePartsAddress')}
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
