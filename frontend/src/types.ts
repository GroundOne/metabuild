import * as yup from "yup";

export const partSchema = yup.object({
    projectName: yup.string().required().min(3).max(16),
    partAmount: yup.number().typeError('You must specify a number').integer().required('Enter PART Amount').min(1, 'The minimum PART quantity is 1').max(1_000_000, 'The maximum PART quantity is 1,000,000'),
    // saleOpeningBlock: yup.string().required(),
    // saleCloseBlock: yup.string().required(),
    // partPrice: yup.number().required().min(1).max(1_000_000),
    // reserveParts: yup.number().min(0).max(1_000_000),
    // reservePartsAddress: yup.string(),
});
export type PartFormValue = yup.InferType<typeof partSchema>;
export type Part = PartFormValue;
