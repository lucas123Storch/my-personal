import Navbar from '@/components/NavBar/navbar';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (!router.pathname.includes('/login')) {
    return (
      <>
        <Navbar />
        <Component {...pageProps} />
      </>
    );
  }

  return <Component {...pageProps} />;
}

export default MyApp;
