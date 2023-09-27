import '../styles/globals.css'
import { Montserrat } from "next/font/google"
import Head from "next/head"
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: "--font-mont"
})

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Conditionally apply 'bg-light' class
  const bgColorClass = router.pathname !== '/projects' ? 'bg-light' : 'bg-transparent';
  const footerColorClass = router.pathname !== '/projects' ? '' : '!bg-spaceColor1';

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${montserrat.variable} font-mont ${bgColorClass} w-full min-h-screen`}>
        <NavBar />
        <Component {...pageProps} />
        <Footer className={`${footerColorClass}`} />
      </main>
    </>
  );
}
