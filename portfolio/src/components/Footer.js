import React from 'react'
import Layout from './Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Footer = ({ className = "" }) => {
    const router = useRouter();

    return (
        <footer className={`w-full border-t-2 border-solid border-dark font-medium text-lg dark:text-light dark:border-light ${router.pathname === "/projects" ? "!border-light" : ""}`}>
            <Layout className={`py-8 flex items-center justify-between ${className}`}>
                <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>
                <div className='flex items-center'>
                    Build With <span className='text-primary text-2xl px-1'>&#9825;</span> by&nbsp;
                    <Link href="/" className='underline underline-offset-2' target={"_blank"}>Lukas Thrane</Link>
                </div>
                <Link href="/" className='underline underline-offset-2' target={"_blank"}>Contact</Link>
            </Layout>
        </footer>
    )
}

export default Footer