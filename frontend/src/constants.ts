export const env: {
    NEXT_PUBLIC_TOKEN_CONTRACT_NAME: string;
    NEXT_PUBLIC_FACTORY_CONTRACT_NAME: string;
    NEXT_PUBLIC_API_URL: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
    EMAIL_HOST: string;
    EMAIL_PORT: number;
    EMAIL_SENDER_ADDRESS: string;
} = {
    NEXT_PUBLIC_TOKEN_CONTRACT_NAME: process.env.NEXT_PUBLIC_CONTRACT_NAME ?? 'part.groundone.testnet',
    NEXT_PUBLIC_FACTORY_CONTRACT_NAME:
        process.env.NEXT_PUBLIC_FACTORY_CONTRACT_NAME ?? 'part_factory.groundone.testnet',

    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '/api',

    /** Available only on server */
    EMAIL_USER: process.env.EMAIL_USER ?? '',
    /** Available only on server */
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ?? '',
    /** Available only on server */
    EMAIL_HOST: process.env.EMAIL_HOST ?? '',
    /** Available only on server */
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT ?? '587'),
    /** Available only on server */
    EMAIL_SENDER_ADDRESS: process.env.EMAIL_SENDER_ADDRESS ?? '',
};

const constants = {
    env,
    NFT_METADATA_SPEC: 'nft-1.0.0',
    MAX_PART_PRICE: 1_000_000,
    MIN_PART_PRICE: 0.01,
    CONTRACT_ADDRESS_SUFFIX: '.part_factory.groundone.testnet',
    MAX_UPLOAD_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    // CONTRACT_ADDRESS_SUFFIX:
    //     process.env.NODE_ENV === 'development' ? '.part_factory.groundone.testnet' : '.part_factory.groundone.near',
};

export default constants;
