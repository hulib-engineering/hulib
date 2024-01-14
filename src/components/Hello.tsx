// import { currentUser } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

const Hello = async () => {
  const t = await getTranslations('Dashboard');
  // const user = await currentUser();

  return <p>👋 {t('hello_message', { email: 'Admin' })}</p>;
};

export { Hello };
