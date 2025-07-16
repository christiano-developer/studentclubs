"use client";
import { useEffect, useRef, useState } from "react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import FloatingIcons from "@/components/FloatingIcons";
import About from "@/components/About";
import Team from "@/components/Team";
import { organizationConfig } from "@/config/organization";

export default function Home() {
  const [showTypewriter, setShowTypewriter] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setShowTypewriter(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      el.style.setProperty("--mouse-x", `${x}%`);
      el.style.setProperty("--mouse-y", `${y}%`);
    };
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Create dynamic words from organization config
  const organizationWords = organizationConfig.name.split(" ");
  const words = [
    { text: "Welcome", className: "text-blue-100 text-lg lg:text-7xl" },
    { text: "To", className: "text-blue-100 text-lg lg:text-7xl" },
    ...organizationWords.map((word, index) => ({
      text: word,
      className: index % 2 === 0 
        ? "text-blue-900 text-lg lg:text-7xl" 
        : "text-orange-500 text-lg lg:text-7xl"
    })),
  ];

  const gradientStyle = {
    background: `radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(37,100,235,0.5) 0%,
      rgba(37,99,235,0.6) 15%,
      rgba(29,78,216,0.6) 20%,
      rgba(30,64,175,0.8) 30%,
      #0a192f 100%
    )`,
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  return (
    <div className="font-mono">
      <div
        ref={containerRef}
        className="gradient-bg  font-[family-name:var(--font-black-han-sans)] h-screen w-screen "
        style={gradientStyle}
      >
        <section className="flex inset-0 z-10   items-center justify-center h-screen w-full overflow-hidden">
          {showTypewriter ? (
            <TypewriterEffect words={words} />
          ) : (
            <div
              className={`lg:text-9xl z-10 text-7xl text-blue-100 transition-normal duration-1000 text-center ${showTypewriter ? "hidden" : "flex"}`}
            >
              {organizationWords.map((word, index) => (
                <div 
                  key={index} 
                  className={`${index > 0 ? "ml-4" : ""} ${index % 2 === 1 ? "text-orange-400" : ""}`}
                >
                  {word}
                </div>
              ))}
            </div>
          )}
        </section>
        <FloatingIcons />
      </div>

      {/* Hero Section */}
      <section id="about">
        <About />
      </section>
      <section id="team">
        <Team />
      </section>
    </div>
  );
}
