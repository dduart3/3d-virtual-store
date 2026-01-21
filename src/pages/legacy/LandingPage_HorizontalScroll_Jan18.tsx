import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { FaInstagram, FaFacebook, FaPinterest } from "react-icons/fa";
import { Product } from "../modules/experience/store/types/product";
import { getProductThumbnailUrl } from "../modules/experience/store/utils/supabaseStorageUtils";
import { useLandingPageAnimations } from "../shared/hooks/useLandingPageAnimations";

export function LandingPage() {
  const [mostPopularProducts, setMostPopularProducts] = useState<Product[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    { name: "Trajes", tags: ["HOMBRE", "FORMAL"], image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Vestidos", tags: ["MUJER", "NOCHE"], image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Pantalones", tags: ["SASTRERÍA", "CASUAL"], image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Camisas y Blusas", tags: ["SEDA", "ALGODÓN"], image: "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Faldas", tags: ["MUJER", "ESTILO"], image: "https://images.pexels.com/photos/601316/pexels-photo-601316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Zapatos", tags: ["PIEL", "BOTAS"], image: "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Bolsos", tags: ["LUJO", "PIEL"], image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Accesorios", tags: ["JOYERÍA", "GAFAS"], image: "https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
  ];

  /* Newsletter Section */
  const headerRef = useRef<HTMLElement>(null);
  const normalNavRef = useRef<HTMLDivElement>(null);
  const minimalNavRef = useRef<HTMLDivElement>(null);

  // Section 4 Refs
  const section4Ref = useRef<HTMLElement>(null);
  const section4LeftTextRef = useRef<HTMLDivElement>(null);
  const section4RightTextRef = useRef<HTMLDivElement>(null);
  const section4CubeRef = useRef<HTMLDivElement>(null);
  const section4CubeWrapperRef = useRef<HTMLDivElement>(null);
  const section4ParagraphRef = useRef<HTMLParagraphElement>(null);
  
  // Section 5 Ref
  const section5Ref = useRef<HTMLElement>(null);

  // Refs for GSAP animations
  // Refs for GSAP animations (Original comment was duplicated in view_file)
  const newsletterRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoIconRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLHeadingElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const languageTextRef = useRef<HTMLSpanElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const japaneseTextRef = useRef<HTMLDivElement>(null);

  // Horizontal Scroll Refs
  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);

  // Complete GSAP Timeline for entire landing page
  useLandingPageAnimations({
    // Navbar elements
    newsletter: newsletterRef.current,
    logo: logoRef.current,
    logoIcon: logoIconRef.current,
    logoText: logoTextRef.current,
    language: languageRef.current,
    languageText: languageTextRef.current,
    navigation: navigationRef.current,

    // Hero elements
    heroText: heroTextRef.current,
    japaneseText: japaneseTextRef.current,

    // Navbar refs for scroll animations
    normalNav: normalNavRef.current,
    minimalNav: minimalNavRef.current,
    header: headerRef.current,

    // Scroll state callback
    onScrollChange: (scrolled) => {
      setIsScrolled(scrolled);
    },

    // Horizontal Scroll
    pinnedSection: pinnedSectionRef.current,
    horizontalWrapper: horizontalWrapperRef.current,
    
    // Section 4
    section4: section4Ref.current,
    section4LeftText: section4LeftTextRef.current,
    section4RightText: section4RightTextRef.current,
    section4CubeWrapper: section4CubeWrapperRef.current,
    section4Cube: section4CubeRef.current,
    section4Paragraph: section4ParagraphRef.current,
    section5: section5Ref.current, // Pass the new ref
  });

  useEffect(() => {
    // Fetch random products for most popular section
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.rpc("get_random_products", {
          limit_count: 4,
        });

        if (error) {
          console.error("Error fetching products:", error);
          return;
        }

        const productsWithThumbnails = data.map((product: any) => {
          return {
            ...product,
            thumbnail_url: getProductThumbnailUrl(product.id),
          };
        });

        setMostPopularProducts(productsWithThumbnails || []);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white text-black">
      {/* Header - Top Navigation Bar */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        style={{
          backdropFilter: isScrolled ? "blur(8px)" : "none",
          minHeight: "120px",
        }}
      >
        {/* Normal Navbar */}
        <div ref={normalNavRef} className="absolute inset-0 w-full">
          {/* Top Row - Newsletter, Logo, Language */}
          <div className="flex items-center justify-between mb-8 px-6 md:px-12 py-6">
            {/* Left - Newsletter */}
            <div
              ref={newsletterRef}
              className="text-xs uppercase tracking-[0.15em] cursor-pointer hover:text-gray-300 transition-colors text-black"
            >
              Newsletter Sign Up
            </div>

            {/* Center - Main Logo */}
            <div ref={logoRef} className="text-center">
              {/* Stylized logo/icon */}
              <div ref={logoIconRef} className="mb-3 mx-auto">
                <div className="relative w-12 h-12 mx-auto">
                  <div className="absolute inset-0 border border-black/20 rounded-full"></div>
                  <div className="absolute inset-2 border border-black/30 rounded-full"></div>
                  <div className="absolute inset-4 border border-black/40 rounded-full"></div>
                  <div className="absolute inset-6 border border-black/50 rounded-full"></div>
                </div>
              </div>
              <h1
                ref={logoTextRef}
                className="text-2xl md:text-3xl font-extralight tracking-[0.2em] uppercase text-black"
              >
                <span className="block text-sm md:text-base tracking-[0.3em] text-black font-light mb-1">
                  Uribe's
                </span>
                <span className="relative text-black">
                  Boutique
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-black/70 to-transparent"></div>
                </span>
              </h1>
            </div>

            {/* Right - Language Selector */}
            <div
              ref={languageRef}
              className="text-xs uppercase tracking-[0.15em] cursor-pointer hover:text-gray-600 transition-colors flex items-center gap-1 text-black"
            >
              <span ref={languageTextRef}>ENGLISH</span>
              <svg
                className="w-3 h-3 text-black"
                fill="none"
                stroke="black"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav
            ref={navigationRef}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-xs uppercase tracking-[0.2em] text-black px-6 md:px-12 pb-6"
          >
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Our Story
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Store
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Collections
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Experiences
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Wellness
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Drink & Dine
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Around Us
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Minimalistic Navbar when scrolled */}
        <div
          ref={minimalNavRef}
          className="absolute inset-0 w-full flex items-center justify-between px-6 md:px-12 py-3"
          style={{ display: "none" }}
        >
          {/* Logo - Left side, icon only */}
          <Link to="/" className="flex items-center">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border border-black/20 rounded-full"></div>
              <div className="absolute inset-1 border border-black/30 rounded-full"></div>
              <div className="absolute inset-2 border border-black/40 rounded-full"></div>
              <div className="absolute inset-3 border border-black/50 rounded-full"></div>
            </div>
          </Link>

          {/* Minimalistic Navigation - Center */}
          <nav className="hidden md:flex items-center gap-4 md:gap-6 text-xs uppercase tracking-[0.15em] text-black">
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Store
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Collections
            </Link>
            <Link to="/store" className="hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side - Language selector (minimal) */}
          <div className="text-xs uppercase tracking-[0.15em] cursor-pointer hover:text-gray-600 transition-colors flex items-center gap-1 text-black">
            <span className="hidden sm:inline">EN</span>
            <svg
              className="w-3 h-3 text-black"
              fill="none"
              stroke="black"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-screen bg-gray-200 pt-32 overflow-visible">
        {/* Hero Content */}
        <div className="relative z-0 h-full flex items-center px-6 md:px-12 overflow-visible">
          <div className="w-full max-w-7xl mx-auto">
            {/* Top right text box */}
            <div className="absolute top-12 right-6 md:right-12 max-w-xs">
              <p className="text-black text-xs md:text-sm leading-relaxed">
                Discover the essence of modern elegance through our curated
                collection of premium fashion pieces.
              </p>
            </div>

            {/* Main content - Left side with Japanese text */}
            <div className="absolute left-6 md:left-12 bottom-24 md:bottom-32">
              {/* Descriptive text above Japanese */}
              <div ref={heroTextRef} className="mb-6 max-w-md">
                <p className="text-black text-sm md:text-base leading-relaxed opacity-80">
                  Experience a new way of living through fashion. Our collection
                  represents the perfect blend of tradition and innovation,
                  creating timeless pieces for your wardrobe.
                </p>
              </div>

              {/* Japanese Text - 新生活 (New Life) */}
              <div ref={japaneseTextRef} className="mb-8">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-black leading-none">
                  新生活
                </h1>
              </div>
            </div>

            {/* Image Block 1 - Dark gray block with background image (right side, overlapping next section) */}
            <div
              className="absolute right-12 md:right-20 top-[20%] w-96 h-[500px] bg-gray-800 rounded-sm overflow-hidden z-10"
              style={{ transform: "translateY(0)" }}
            >
              {/* Background image placeholder */}
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Text overlay - top left */}
              <div className="absolute top-8 left-8 max-w-xs z-20">
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                  Experience is the ultimate combination of art and
                  functionality, creating timeless pieces that transcend trends.
                </p>
              </div>
            </div>

            {/* Image Block 2 - Person image overlapping (closer to block 1, overlapping both Japanese text and block 1) */}
            <div
              className="absolute right-24 md:right-[400px] top-[25%] w-[500px] h-[350px] z-30"
              style={{ transform: "translateY(0)" }}
            >
              {/* Person image placeholder */}
              <div className="w-full h-full bg-gray-300 flex items-end justify-center overflow-hidden rounded-sm">
                <svg
                  className="w-48 h-64 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section Wrapper */}
      <div ref={pinnedSectionRef} className="relative w-full h-screen overflow-hidden bg-white z-20">
        <div ref={horizontalWrapperRef} className="flex h-full w-[400%]">
          
          {/* Section 1: Mission & Vision (Grid Layout - Cream & Black) */}
          <section className="w-1/4 h-full bg-[#fdfbf7] text-black relative flex-shrink-0 pt-20 md:pt-24 border-r border-black/10">
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 grid-rows-12 md:grid-rows-2 border-t border-black/10">
              
              {/* Row 1 - Left: Mission (Desktop: col-span-3) */}
              <div className="col-span-1 md:col-span-3 row-span-2 md:row-span-1 border-r border-b border-black/10 p-6 flex flex-col relative group">
                <h3 className="text-[10px] font-bold tracking-widest uppercase mb-auto text-black/60">Our Mission</h3>
                <p className="font-mono text-xs md:text-sm leading-relaxed uppercase opacity-90 text-black">
                  We verify lifestyle brands on Shopify position themselves as the premium solution to their ideal customers.
                </p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>

              {/* Row 1 - Middle: Vision (Desktop: col-span-4) */}
              <div className="col-span-1 md:col-span-4 row-span-2 md:row-span-1 border-r border-b border-black/10 p-6 flex flex-col relative hover:bg-black/5 transition-colors">
                <div className="flex justify-between items-center mb-auto">
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-black/60">Our Vision</h3>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-black/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  </div>
                </div>
                <div>
                   <h4 className="text-xl md:text-2xl font-light leading-tight mb-4 text-black">
                     How To Create Viral Compounding Profits - Without Any Ad Spend
                   </h4>
                   <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-black/60">
                     <span>↳ 4 min read</span>
                   </div>
                </div>
              </div>

              {/* Row 1 - Right: Recent Projects (Image) (Desktop: col-span-5) */}
              <div className="col-span-1 md:col-span-5 row-span-4 md:row-span-1 border-b border-black/10 relative overflow-hidden group">
                {/* Image Placeholder */}
                <div className="w-full h-full bg-gray-200 transition-transform duration-700 group-hover:scale-105">
                   <img 
                     src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                     alt="Recent Projects" 
                     className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500 grayscale"
                   />
                </div>
              </div>

              {/* Row 2 - Left: Highlights (Image) (Desktop: col-span-6) */}
              <div className="col-span-1 md:col-span-6 row-span-4 md:row-span-1 border-r border-black/10 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full p-4 z-20">
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-white/90 drop-shadow-md">Highlights</h3>
                </div>
                 <div className="w-full h-full bg-gray-200 transition-transform duration-700 group-hover:scale-105">
                   <img 
                     src="https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2670&auto=format&fit=crop" 
                     alt="Highlights" 
                     className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500 grayscale"
                   />
                </div>
              </div>

              {/* Row 2 - Middle: Product Update (Desktop: col-span-4) */}
              <div className="col-span-1 md:col-span-4 row-span-2 md:row-span-1 border-r border-black/10 p-6 flex flex-col justify-end hover:bg-black/5 transition-colors">
                <div className="mb-auto">
                   <h3 className="text-[10px] font-bold tracking-widest uppercase text-black/60">Product Update</h3>
                </div>
                <div>
                   <p className="text-lg md:text-xl font-light mb-4 text-black/90">
                     Almond Labs launches Loyalty on Roadmap - including Shopify POS support
                   </p>
                   <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-black/60">
                     <span>↳ 1 min read</span>
                   </div>
                </div>
              </div>

              {/* Row 2 - Right: Resources (List) (Desktop: col-span-2) */}
              <div className="col-span-1 md:col-span-2 row-span-2 md:row-span-1 p-6 flex flex-col bg-[#f0ede6] overflow-hidden">
                <h3 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-black/60">Resources</h3>
                <ul className="space-y-4">
                  {[
                    "001 Choosing the right ecommerce platform",
                    "002 Fitting your design + development",
                    "003 The ecommerce brand's guide to UX",
                    "004 Tilising UI design for ecommerce",
                    "005 How to work with a Shopify developer",
                    "006 A Testing your new website QA",
                    "007 Achieving digital autonomy"
                  ].map((item, i) => {
                    const firstSpaceIndex = item.indexOf(' ');
                    const number = item.substring(0, firstSpaceIndex);
                    const text = item.substring(firstSpaceIndex + 1);
                    
                    return (
                      <li key={i} className="flex w-full items-center">
                         {/* Static Number */}
                         <span className="shrink-0 w-6 text-[8px] md:text-[9px] font-mono uppercase text-black/60 mr-2">{number}</span>
                         
                         {/* Scrolling Text Container */}
                         <div className="relative flex-1 overflow-hidden h-4 flex items-center">
                             {/* Gradient Overlay - Left */}
                             <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[#f0ede6] to-transparent pointer-events-none"></div>
                             {/* Gradient Overlay - Right */}
                             <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[#f0ede6] to-transparent pointer-events-none"></div>
                             
                             {/* Marquee Wrappers */}
                             <div className="flex animate-marquee-reverse whitespace-nowrap min-w-full shrink-0 items-center">
                                 <span className="pr-2 text-[8px] md:text-[9px] font-mono uppercase leading-tight text-black/60 hover:text-black cursor-pointer transition-colors">{text}</span>
                             </div>
                             <div className="flex animate-marquee-reverse whitespace-nowrap min-w-full shrink-0 items-center">
                                 <span className="pr-2 text-[8px] md:text-[9px] font-mono uppercase leading-tight text-black/60 hover:text-black cursor-pointer transition-colors">{text}</span>
                             </div>
                         </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

            </div>
          </section>

          {/* Section 2: Design Philosophy (Cream & Black) */}
          <section className="w-1/4 h-full bg-[#fdfbf7] text-black relative flex-shrink-0 flex flex-col justify-center items-center px-12 md:px-24 border-r border-black/10">
            <div className="max-w-6xl mx-auto">
              {/* Main Headline */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight text-center mb-16 md:mb-24">
                Through innovation and artful design, we lead lifestyle brands towards their ecommerce independence.
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Spacer to push text to the right */}
                <div className="hidden md:block"></div> 
                
                {/* Text Content */}
                <div className="max-w-xl">
                  <p className="text-sm md:text-base leading-relaxed text-black/80 mb-8 font-light">
                    An aesthetically pleasing interface is just one part of a well-designed website. Strategic content elevates a brand visually; intuitive UX turns visitors into customers, and comprehensive admin functionality gives businesses the freedom to evolve with autonomy. That's the winning combo.
                  </p>
                  <Link to="/store" className="inline-flex items-center text-xs font-bold tracking-widest uppercase hover:text-black/60 transition-colors">
                    <span className="mr-2">→</span> GET IN TOUCH
                  </Link>
                </div>
              </div>
            </div>
          </section>



          {/* Section 3: Full Screen Image */}
          <section className="w-1/4 h-full relative flex-shrink-0">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
                alt="Full Screen Lifestyle" 
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </section>

          {/* Section 4: 3D Cube & Moving Text */}
          <section ref={section4Ref} className="w-1/4 h-full relative flex-shrink-0 bg-[#f0ede6] flex flex-col items-center justify-center overflow-hidden">
             
             {/* Text Container - Centered */}
             <div className="flex items-center gap-4 z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* Left Text */}
                <div ref={section4LeftTextRef} className="text-xs md:text-sm font-light tracking-widest uppercase text-black">
                  RECENT PROJECT
                </div>

                {/* Right Text */}
                <div ref={section4RightTextRef} className="text-xs md:text-sm font-light tracking-widest uppercase text-black">
                  4P—CREATIVE—CAMPAIGN
                </div>
             </div>

             {/* Image & Description Container - Centered */}
             <div className="relative z-10 flex flex-col items-center justify-center perspective-[1000px] group">
               {/* 3D Cube Wrapper (Handles Scale/Entrance) */}
               <div ref={section4CubeWrapperRef}>
                 {/* 3D Cube (Handles Rotation) */}
                 <div 
                   ref={section4CubeRef}
                   className="relative w-[300px] h-[225px] md:w-[500px] md:h-[375px] [--cube-depth:150px] md:[--cube-depth:250px]"
                   style={{ 
                     transformStyle: "preserve-3d"
                   }}
                 >
                  {[
                   {
                     image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2676&auto=format&fit=crop",
                     title: "OLD RESIDENCE — 24",
                     desc: "Historic renovation project preserving cultural heritage.",
                     id: "2024-001"
                   },
                   {
                    image: "https://images.unsplash.com/photo-1517524285303-d7544e2075a8?q=80&w=2670&auto=format&fit=crop",
                    title: "BAEMIN B OOH CAMPAIGN — 25",
                    desc: "Affordable & Fast campaign in Hannam-dong district.",
                    id: "2025-002"
                   },
                   {
                     image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
                     title: "URBAN COMPLEX — 25",
                     desc: "Modern mixed-use integration in the city center.",
                     id: "2025-003"
                   },
                   {
                     image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop",
                     title: "INTERIOR SPACES — 24",
                     desc: "Minimalist interior design for contemporary living.",
                     id: "2024-004"
                   }
                 ].map((project, index) => (
                   <div 
                     key={index}
                     className="absolute inset-0 backface-hidden overflow-hidden"
                     style={{ 
                       transform: `rotateY(${index * 90}deg) translateZ(var(--cube-depth))`,
                       boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
                     }}
                   >
                     {/* Background Image */}
                     <img 
                       src={project.image} 
                       alt={project.title}
                       className="w-full h-full object-cover grayscale"
                     />
                     
                     {/* Dark Overlay */}
                     <div className="absolute inset-0 bg-black/30"></div>
                     
                     {/* Text Overlay - Bottom Left */}
                     <div className="absolute bottom-0 left-0 p-4 md:p-6 z-10">
                       <h3 className="text-white text-xs md:text-sm font-bold tracking-wider uppercase mb-1">
                         {project.title}
                       </h3>
                       <p className="text-white/80 text-[10px] md:text-xs leading-relaxed max-w-xs">
                         {project.desc}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
              </div>

               {/* Description Paragraph */}
               <div className="mt-16 h-24 flex items-center justify-center"> {/* Fixed height container to prevent jumping */}
                 <p 
                   ref={section4ParagraphRef}
                   className="max-w-xl text-center text-xs md:text-sm font-semibold leading-relaxed text-black/70 opacity-0 transform translate-y-4 transition-all duration-500"
                 >
                   "In September 2025, Big Picture Company executed Baemin's 'Affordable & Fast' campaign in the key commercial district of Hannam-dong through an out-of-home (OOH) advertising installation."
                 </p>
               </div>
             </div>

          </section>

        </div>
      </div>

      {/* About the Brand Section (Video Background) */}
      <section ref={section5Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden z-20 bg-black -mt-[100vh]">
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/3205917/3205917-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Optional Overlay if needed */}
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* Categories Section */}
      <section className="bg-[#f0f0ed] text-black w-full h-screen flex flex-col justify-center border-t border-black pt-[120px] pb-0 overflow-hidden">
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-end border-b border-black pb-4 px-6 md:px-12 flex-shrink-0">
               <h2 className="text-sm font-bold tracking-widest uppercase">Our Collection</h2>
               <span className="text-xs opacity-50 hidden md:block">SELECT TO PREVIEW</span>
            </div>
            
            <div className="relative w-full flex-1 border-b border-black bg-transparent min-h-0">
                
                {/* Vertical Line in the middle */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black hidden md:block z-0"></div>

                {/* List Column - Full Width (Background Layer) */}
                <div className="w-full h-full">
                    <ul className="flex flex-col h-full">
                        {[
                          { name: "Suits", tags: ["MEN", "FORMAL"], image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", id: "01" },
                          { name: "Dresses", tags: ["WOMEN", "EVENING"], image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", id: "02" },
                          { name: "Trousers", tags: ["TAILORING", "CASUAL"], image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", id: "03" },
                          { name: "Shirts & Blouses", tags: ["SILK", "COTTON"], image: "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", id: "04" },
                          { name: "Skirts", tags: ["WOMEN", "STYLE"], image: "https://images.pexels.com/photos/601316/pexels-photo-601316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", id: "05" },
                          { name: "Shoes", tags: ["LEATHER", "BOOTS"], image: "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", id: "06" },
                          { name: "Bags", tags: ["LUXURY", "LEATHER"], image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", id: "07" },
                          { name: "Accessories", tags: ["JEWELRY", "GLASSES"], image: "https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", id: "08" }
                        ].map((category, index) => (
                            <li 
                                key={index} 
                                className={`group w-full flex-1 border-b first:border-t-0 last:border-b-0 md:border-y-0 transition-colors duration-300 relative z-10 ${activeCategory === index ? 'bg-black/5' : 'hover:bg-black/5'}`}
                                onMouseEnter={() => setActiveCategory(index)}
                            >
                                {/* Active/Hover Borders */}
                                <div className={`absolute inset-x-0 top-0 h-px bg-black transition-opacity duration-300 ${activeCategory === index || 'group-hover:opacity-100'} opacity-0`}></div>
                                <div className={`absolute inset-x-0 bottom-0 h-px bg-black transition-opacity duration-300 ${activeCategory === index || 'group-hover:opacity-100'} opacity-0`}></div>

                                <div className="flex w-full h-full">
                                    {/* LEFT HALF - Category Name & View Project Button */}
                                    <div className="w-full md:w-1/2 flex items-center justify-between px-6 md:px-12 relative border-r border-transparent md:border-black/5">
                                        
                                        {/* Category Name (Left Aligned) */}
                                        <div className="relative overflow-hidden h-14 w-full flex items-center">
                                            <span className={`absolute left-0 block text-2xl md:text-3xl lg:text-4xl font-serif transition-transform duration-500 ease-out group-hover:translate-y-full ${activeCategory === index ? 'opacity-100' : 'opacity-60'}`}>
                                                {category.name}
                                            </span>
                                            <span className={`absolute left-0 block text-2xl md:text-3xl lg:text-4xl font-serif transition-transform duration-500 ease-out -translate-y-full group-hover:translate-y-0 ${activeCategory === index ? 'opacity-100' : 'opacity-80'}`}>
                                                {category.name}
                                            </span>
                                        </div>

                                        {/* View Project Button (Right Aligned in Left Half) */}
                                        <div className={`transition-all duration-300 ${activeCategory === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                                            <div className="border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer group/btn overflow-hidden relative mr-4">
                                                <div className="relative h-3 w-28 overflow-hidden flex items-center justify-center">
                                                    <span className="absolute block text-[10px] font-bold tracking-widest uppercase transition-transform duration-500 ease-out group-hover:translate-y-full">
                                                        → View Project
                                                    </span>
                                                    <span className="absolute block text-[10px] font-bold tracking-widest uppercase transition-transform duration-500 ease-out -translate-y-full group-hover:translate-y-0">
                                                        → View Project
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT HALF - Identifiers/Tags */}
                                    <div className="hidden md:flex w-1/2 items-center px-12 relative">
                                        {/* Identifier/Tags (Left Aligned in Right Half) */}
                                        <div className="relative overflow-hidden h-4 flex gap-4 items-center">
                                            {/* Static set of tags for demo, sliding together */}
                                            <div className={`flex gap-3 transition-transform duration-500 ease-out group-hover:translate-y-[150%] ${activeCategory === index ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'}`}>
                                                <span className="text-[10px] font-mono tracking-widest bg-black/10 px-1">CAT—{category.id}</span>
                                                <span className="text-[10px] font-mono tracking-widest bg-black/10 px-1">{category.tags[0]}</span>
                                                <span className="text-[10px] font-mono tracking-widest bg-black/10 px-1 display-none xl:inline-block">AUS</span> 
                                            </div>
                                            
                                            <div className={`absolute top-0 left-0 flex gap-3 transition-transform duration-500 ease-out -translate-y-[150%] group-hover:translate-y-0 ${activeCategory === index ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'}`}>
                                                <span className="text-[10px] font-mono tracking-widest bg-black/10 px-1">CAT—{category.id}</span>
                                                <span className="text-[10px] font-mono tracking-widest bg-black/10 px-1">{category.tags[0]}</span>
                                                <span className="text-[10px] font-mono tracking-widest bg-black/10 px-1 display-none xl:inline-block">AUS</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Preview Column - Overlay (Top Layer) */}
                <div className="hidden lg:flex absolute top-0 right-0 w-[40%] h-full flex-col items-center justify-center pointer-events-none z-20">
                     {/* Image Frame - Sticky-like behavior or Centered in container */}
                     <div className="relative w-[25vw] aspect-[3/4] shadow-2xl overflow-hidden border-4 border-black bg-[#f9f9f7] pointer-events-auto transform rotate-2 hover:rotate-0 transition-transform duration-700">
                        {/* We use index access safely since we hardcoded the array above. In a real app we'd use state or props */}
                        {(() => {
                           const currentCat = [
                              { name: "Suits", tags: ["MEN", "FORMAL"], image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                              { name: "Dresses", tags: ["WOMEN", "EVENING"], image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                              { name: "Trousers", tags: ["TAILORING", "CASUAL"], image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                              { name: "Shirts & Blouses", tags: ["SILK", "COTTON"], image: "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                              { name: "Skirts", tags: ["WOMEN", "STYLE"], image: "https://images.pexels.com/photos/601316/pexels-photo-601316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                              { name: "Shoes", tags: ["LEATHER", "BOOTS"], image: "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                              { name: "Bags", tags: ["LUXURY", "LEATHER"], image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                              { name: "Accessories", tags: ["JEWELRY", "GLASSES"], image: "https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
                           ][activeCategory];
                           
                           return (
                             <>
                                <img 
                                    key={activeCategory} 
                                    src={currentCat.image} 
                                    alt={currentCat.name}
                                    className="w-full h-full object-cover animate-fadeIn"
                                />
                                
                                {/* Overlay Tags */}
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    {currentCat.tags.map((tag, i) => (
                                       <span key={i} className="text-[9px] bg-black text-white px-2 py-1 tracking-widest uppercase">{tag}</span>
                                    ))}
                                </div>
                             </>
                           );
                        })()}
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-black py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Order Column */}
            <div>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">
                Order
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Order
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Returns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Payment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info Column */}
            <div>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">
                Info
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Campaign offers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Contact with us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Socials Column */}
            <div>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">
                Socials
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61573912029854"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/uribesboutique"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Pinterest
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Youtube
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Behance
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">
                Contact
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                info@uribesboutique.pages.dev
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61573912029854"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/uribesboutique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <Link
                  to="/store"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <FaPinterest className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-300">
            <p className="text-gray-600 text-xs text-center">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
