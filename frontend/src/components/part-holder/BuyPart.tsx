import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import constants from '../../constants';
import Button from '../ui-components/Button';
import Input from '../ui-components/Input';

const distributionFormSchema = yup.object({
    projectAddress: yup
        .string()
        .label('Project address')
        .trim()
        .required()
        .matches(/^[a-z0-9_]+$/, { message: 'Use only lowercase letters, numbers and "_"', excludeEmptyString: true })
        .min(3)
        .max(50),
});
export type DistributionFormValue = yup.InferType<typeof distributionFormSchema>;

const BuyPart: React.FC = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<DistributionFormValue>({ resolver: yupResolver(distributionFormSchema) });

    const contractSuffix = constants.CONTRACT_ADDRESS_SUFFIX;

    const onSubmit = async (data: DistributionFormValue) => {
        try {
            // const contract = await tokenContract.contract_vars(data.projectAddress + contractSuffix);
            router.push(router.pathname + '/confirm?project=' + data.projectAddress);
        } catch (e) {
            setError('projectAddress', { type: 'manual', message: 'Contract address does not exist' });
        }
    };

    return (
        <>
            <div className="text-lg font-semibold">Please Enter Project Contract Address</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Input
                        id="projectAddress"
                        type="text"
                        placeholder=""
                        labelRight={contractSuffix}
                        isInvalid={!!errors.projectAddress}
                        errorText={errors.projectAddress?.message as string | undefined}
                        {...register('projectAddress')}
                    />
                    <div className="col-span-2">
                        <Button isInvertedColor size="md" className="mt-4 " type="submit">
                            NEXT
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default BuyPart;
