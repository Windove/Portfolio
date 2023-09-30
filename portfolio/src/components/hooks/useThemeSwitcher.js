import React, { useEffect, useState } from "react";

const useThemeSwitcher = () => {

    const preferDarkQuery = '(prefers-color-scheme: dark)';
    const [mode, setMode] = useState("");

    useEffect(() => {
        const mediaQuery = window.matchMedia(preferDarkQuery);
        const userPref = window.localStorage.getItem('color-theme');

        const handleChange = () => {
            if (userPref) {
                let check = userPref === "dark" ? "dark" : "light";
                setMode(check);

                if (check === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } else {
                let check = mediaQuery.matches ? "dark" : "light";
                setMode(check);

                if (check === "dark") {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (mode === "dark") {
            document.documentElement.classList.add('dark');
            window.localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            window.localStorage.setItem('color-theme', 'light');
        }
    }, [mode]);


    return [mode, setMode];
};

export default useThemeSwitcher;