"use client"

import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { UserButton } from '@clerk/clerk-react';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="relative z-10 flex md:flex-row items-center justify-between p-4 md:p-10 w-full h-24 bg-blue-900 text-white">
            <p className="text-5xl">Resdiasen</p>
            <div className="flex flex-col items-center justify-start">
                <button onClick={toggleMenu} className="text-xl focus:outline-none cursor-pointer">
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
                {menuOpen && (
                    <div className="absolute flex flex-col bg-blue-900 top-20 right-[0px] p-4 rounded-bl-lg gap-4 z-20">
                        <Link href='/' className="text-xl hover:underline">Accueil</Link>
                        <Link href="/community" className="text-xl hover:underline">Communauté</Link>
                        <Link href="/profile" className="text-xl hover:underline">Profil</Link>
                        <UserButton />
                    </div>
                )}
            </div>
        </nav>
    );
}
