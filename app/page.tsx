"use client"

import { Navbar, Hero, Announcements, Footer } from "@/components";
import { Divider } from 'antd';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
  if (!user) {
    router.push('/auth/signin');
    return null; // Redirection en cours, le rendu est interrompu
  }

  // Si l'utilisateur est connecté, affichez la page d'accueil normalement
  return (
    <>
      <Navbar />
      <Hero />
      <Divider className="absolute top-92 my-32" />
      <Announcements />
      <Footer />
    </>
  );
}
