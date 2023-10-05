import '../styles/globals.css'
import { Montserrat } from "next/font/google"
import Head from "next/head"
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react';
import { NextUIProvider } from '@nextui-org/react'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: "--font-mont"
})

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    // Listen to route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup the event listener when the component is unmounted
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Conditionally apply 'bg-light' class
  const bgColorClass = router.pathname !== '/projects' ? 'bg-light' : 'bg-transparent';
  const colorClass = router.pathname !== '/projects' ? '' : '!bg-transparent !text-light';

  // Determine if it's the projects page
  const isProjectsPage = router.pathname === '/projects';
  const fixedClass = isProjectsPage ? 'fixed w-full z-50' : '';

  return (
    <>
      <NextUIProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={`dark:bg-dark ${montserrat.variable} font-mont ${bgColorClass} w-full min-h-screen`}>
          <div className={`${fixedClass} top-0`}>
            <NavBar className={`${colorClass}`} />
          </div>
          <Component {...pageProps} />
          <div className={`${fixedClass} bottom-0`}>
            <Footer className={`${colorClass}`} />
          </div>
        </main>
      </NextUIProvider>
    </>
  );
}
