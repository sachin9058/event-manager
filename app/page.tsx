"use client"

import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PremiumEventPlanner = () => {
  // Define a richer, more luxurious color palette
  const primaryColor = '#70001A'; // Deep, rich Burgundy/Wine
  const secondaryColor = '#C89446'; // Muted, sophisticated Gold/Brass
  const backgroundColor = '#FAF9F8'; // Off-white/Cream for warmth

  const serifBold = 'font-serif font-extrabold';

  const router = useRouter()

  return (
    <>
      <Head>
        <title>The Premier Campus Event Architects</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen font-sans text-gray-800" style={{ backgroundColor: backgroundColor }}>

        <Navbar />
        
        {/* Hero Section (Responsive) */}
        <section className="relative w-full h-[500px] md:h-[650px] lg:h-[800px] overflow-hidden bg-linear-to-br from-purple-900 via-red-900 to-orange-900">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Decorative geometric shapes */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 border-4 rotate-45" style={{ borderColor: secondaryColor }}></div>
            <div className="absolute bottom-40 right-20 w-48 h-48 border-4 rounded-full" style={{ borderColor: secondaryColor }}></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4" style={{ borderColor: secondaryColor }}></div>
          </div>

          <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-16 lg:p-24 z-10">
            <div className="text-white max-w-4xl mb-8 md:mb-12">
              <div className="mb-6 inline-block px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: secondaryColor }}>
                ✨ Premium Event Management
              </div>
              <h1 className={`text-4xl md:text-6xl lg:text-8xl ${serifBold} tracking-tight leading-tight mb-4 md:mb-6`} style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
                Curating the Extraordinary <br className="hidden md:block" /> for Your Annual Fest.
              </h1>
              <p className="text-base md:text-xl max-w-3xl font-light mb-6 md:mb-10 opacity-90 leading-relaxed">
                Exclusive event design and management, empowering student leaders to host the most prestigious and large-scale campus celebrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/clubs')}
                  className="px-8 py-4 text-base font-bold uppercase tracking-wider text-white rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
                  style={{ backgroundColor: secondaryColor }}
                >
                  VIEW ALL CLUBS
                </button>
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-8 py-4 text-base font-bold uppercase tracking-wider text-white border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-all"
                >
                  GET STARTED
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* 4. Split-Layout Introduction */}
        <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
          <div className="relative pt-8 md:pt-16 order-last lg:order-first">
             <Image
                src="/hero.jpeg" 
                alt="Event detail sketch"
                width={600}
                height={400}
                layout="responsive"
                objectFit="cover"
                className="shadow-2xl"
              />
          </div>
          <div className="pt-8 md:pt-16">
            <p className="text-sm uppercase tracking-[0.3em] font-light mb-3 md:mb-4" style={{ color: secondaryColor }}>
              Empowering Student Leadership
            </p>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl ${serifBold} mb-6 md:mb-8 leading-tight`} style={{ color: primaryColor }}>
              Where Your Vision <br /> Meets Flawless Logistics.
            </h2>
            <hr className="w-12 h-1 mb-6 md:mb-8 border-0" style={{ backgroundColor: secondaryColor }} />
            <p className="text-lg md:text-xl text-gray-700 leading-8 md:leading-9 mb-4 md:mb-6 font-light">
              We specialize in the complex coordination required for major campus events—from securing headline artists and managing large-scale infrastructure to navigating university compliance and maximizing sponsor ROI. We handle the rigor; your club owns the spotlight.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-7 md:leading-8 font-light italic">
              &ldquo;Focus on inspiring your peers. We will ensure the experience is seamless and unforgettable.&rdquo;
            </p>
          </div>
        </section>

        {/* 5. Three-Tiered Offering */}
        <section className={`py-16 md:py-24 lg:py-32 text-white`} style={{ backgroundColor: primaryColor }}>
          <div className="container mx-auto px-6 lg:px-12 text-center mb-10 md:mb-16">
             <h2 className={`text-3xl md:text-4xl ${serifBold} mb-3 md:mb-4 tracking-wider`}>Our Signature Collections for Campus</h2>
             <p className="text-base md:text-lg opacity-80 font-light">Tailored services for your club&apos;s highest ambitions.</p>
          </div>
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              <div className="p-6 md:p-8 border-2 border-opacity-30 transition-all hover:shadow-2xl hover:border-opacity-100" style={{ borderColor: secondaryColor }}>
                <h3 className={`text-2xl md:text-3xl ${serifBold} mb-2 md:mb-3`} style={{ color: secondaryColor }}>The Annual Fest</h3>
                <p className="text-sm md:text-base opacity-80 font-light leading-relaxed">
                  End-to-end management for your flagship event, covering venue design, stage production, talent booking, and multi-day logistics.
                </p>
              </div>
              <div className="p-6 md:p-8 border-2 border-opacity-30 transition-all hover:shadow-2xl hover:border-opacity-100" style={{ borderColor: secondaryColor }}>
                <h3 className={`text-2xl md:text-3xl ${serifBold} mb-2 md:mb-3`} style={{ color: secondaryColor }}>The Symposium Gala</h3>
                <p className="text-sm md:text-base opacity-80 font-light leading-relaxed">
                  Designing distinguished academic conferences, debate competitions, and high-stakes award banquets for elite student organizations.
                </p>
              </div>
              <div className="p-6 md:p-8 border-2 border-opacity-30 transition-all hover:shadow-2xl hover:border-opacity-100" style={{ borderColor: secondaryColor }}>
                <h3 className={`text-2xl md:text-3xl ${serifBold} mb-2 md:mb-3`} style={{ color: secondaryColor }}>The Activation Lead</h3>
                <p className="text-sm md:text-base opacity-80 font-light leading-relaxed">
                  Full sponsorship package fulfillment, maximizing brand visibility and delivering measurable ROI for corporate partners and student funds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Footer */}
        <footer className="py-8 md:py-12 border-t border-gray-200" style={{ backgroundColor: backgroundColor }}>
          <div className="container mx-auto px-6 lg:px-12 text-center text-xs md:text-sm tracking-widest uppercase font-light text-gray-500">
            <p>Ready to manage your club? <a href="/dashboard" className="hover:text-gray-900 cursor-pointer">GET STARTED</a></p>
            <p className="mt-2">&copy; {new Date().getFullYear()} Fest Architects. Empowering Campus Communities.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PremiumEventPlanner;
