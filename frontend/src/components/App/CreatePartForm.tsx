import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactNode, useEffect } from 'react';
import { partSchema, PartFormValue } from '../../types';
import router from 'next/router';
import Input from '../ui-components/Input';

// export type CompanyFormProps = {
//     isOnboarding: boolean | null;
//     values: PartFormValue;
//     disabled?: boolean;
//     genericMessage?: ReactNode;
//     onCompanyRequest: (values: PartFormValue) => unknown;
// };

export default function CreatePartForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PartFormValue>({
        resolver: yupResolver(partSchema),
    });

    const onSubmit = (data: PartFormValue) => {
        console.log(data);
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
                <button
                    type="submit"
                    className="ff-btn-primary mt-10 w-1/2 bg-[#C3CED8] text-white hover:bg-opacity-90 hover:text-white"
                >
                    CREATE
                </button>
            </div>
        </form>
    );
}
