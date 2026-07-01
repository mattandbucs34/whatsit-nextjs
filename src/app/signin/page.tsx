import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignInPageClient from './page.client';

interface PageProps {
    searchParams: Promise<{
        callbackUrl?: string;
    }>;
}

const SignInPage = async ({ searchParams }: PageProps) => {
    const session = await auth();
    const { callbackUrl } = await searchParams;

    if (session) {
        redirect(callbackUrl || '/topics');
    }

    return <SignInPageClient callbackUrl={callbackUrl} />;
};

export default SignInPage;
