import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpPageClient from './page.client';

const SignUpPage = async () => {
    const session = await auth();

    if (session) {
        redirect('/topics');
    }

    return <SignUpPageClient />;
};

export default SignUpPage;
