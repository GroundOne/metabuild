import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const ProductionHomepageGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const isProduction = window?.location?.host === 'app.groundone.io';
    const homepage = 'https://www.groundone.io/demo2022';

    useEffect(() => {
        if (router.pathname === '/' && isProduction) {
            router.replace(homepage);
        }
        console.log('router.pathname', router.pathname);
    }, [isProduction, router]);

    return <>{children}</>;
};
