import React from 'react';
import Image from 'next/image';

const Hero = () => {
    return (
        <div className='relative top-10 flex flex-col md:flex-row items-center justify-around w-11/12 m-auto gap-10'>
            <div className='w-full md:w-3/4'>
                <p className='text-4xl text-blue-900 font-bold'>Réseau de la Diaspora Sénégalaise</p>
                <div className="pt-6">
                    <p className='text-2xl text-blue-900 font-bold'>Quelle est notre devise ?</p>
                    <p className='text-lg'>La diaspora au service du Sénégal</p>
                </div>
                <div className='pt-6'>
                    <p className='text-2xl text-blue-900 font-bold'>Quel est notre but ?</p>
                    <p className='text-lg'>Identifier, échanger ainsi que partager nos compétences et développer de nouvelles idées pour un Sénégal radieux.</p>
                </div>
            </div>
            <div className='w-full md:w-1/2 flex justify-center'>
                <Image src="/images/main.svg" alt="hero image" width="0" height="0" className="xl:w-1/2 md:w-full opacity-75 hidden md:block"/>
            </div>
        </div>
    )
}

export default Hero
