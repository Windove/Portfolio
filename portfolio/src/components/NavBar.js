import React from 'react'
import Link from 'next/link'
import Logo from './Logo'
import { useRouter } from 'next/router'
import { GithubIcon, LinkedInIcon, MoonIcon, SunIcon, TwitterIcon } from './Icons'
import { motion } from 'framer-motion'
import useThemeSwitcher from './hooks/useThemeSwitcher'

const CustomLink = ({ href, title, className = "" }) => {
    const router = useRouter();

    return (
        <Link href={href} className={`${className} relative group`}>
            {title}

            <span className={`
            h-[2px] inline-block bg-dark 
            absolute left-0 -bottom-0.5
            group-hover:w-full transition-[width] ease duration-300
            ${router.pathname === href ? "w-full" : "w-0"}
            dark:bg-light
            `}>&nbsp;</span>
        </Link>
    )
}


const NavBar = ({ className = "" }) => {

    const [mode, setMode] = useThemeSwitcher();

    return (
        <header className={`w-full px-32 py-8 font-medium flex items-center justify-between ${className}
        dark:text-light
        `}>
            <nav>
                <CustomLink href='/' title={"Home"} className='mr-4' />
                <CustomLink href='/about' title={"About"} className='mx-4' />
                <CustomLink href='/projects' title={"Projects"} className='mx-4' />
                <CustomLink href='/articles' title={"Articles"} className='mx-4' />
                <CustomLink href='/contact' title={"Contact"} className='ml-4' />
            </nav>

            <nav className="flex items-center justify-center flex-wrap">
                <motion.a href='https://linkedin.com' target={'_blank'}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className='w-8 mr-4'
                >
                    <LinkedInIcon />
                </motion.a>
                <motion.a href='https://github.com' target={'_blank'}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className='w-8 mx-4'
                >
                    <GithubIcon />
                </motion.a>
                <motion.a href='https://twitter.com' target={'_blank'}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className='w-8 ml-4'
                >
                    <TwitterIcon />
                </motion.a>

                <button 
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                className={`ml-4 flex items-center justify-center rounded-full p-1 w-10
                ${mode === "dark" ? "bg-light text-dark" : "bg-dark text-light"}`}>
                    {
                        mode === "dark" ?
                            <SunIcon onClick={() => setMode("light")} className={"fill-dark"} />
                            :
                            <MoonIcon onClick={() => setMode("dark")} className={"fill-dark"} />
                    }
                </button>
            </nav>

            <div className='absolute left-[50%] top-2 translate-x-[.50%]'>
                <Logo />
            </div>
        </header>
    )
}

export default NavBar