"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { SiInstagram, SiLinkedin } from "react-icons/si";

// Define the Card type
type CardProps = {
  title: string;
  src: string;
  disc: string;
  role: string;
};

interface SingleCardProps {
  card: CardProps;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}

// Individual card component
export const Card: React.FC<SingleCardProps> = React.memo(
  ({ card, index, hovered, setHovered }) => {
    const isHovered = hovered === index;

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "relative rounded-lg  overflow-hidden bg-gray-100  h-28 w-24 lg:h-60 lg:w-48 transition-all duration-500 ease-out",
          hovered !== null && !isHovered && "scale-95",
        )}
      >
        <Image
          src={card.src}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn(
            "object-cover transition-filter duration-500 ease-out ",
            hovered !== null && !isHovered && "filter blur-sm",
            isHovered ? " mt-0 lg:mt-0" : "mt-5 lg:mt-10  duration-[2s]",
          )}
        />

        {/* Overlay container */}
        <div
          className={cn(
            "absolute pb-2 inset-0 flex flex-col justify-between transition-all duration-700",
            isHovered ? "bg-black/25" : "bg-black/50 ",
          )}
        >
          {/* Title & Role when not hovered - positioned at top */}
          <AnimatePresence>
            {!isHovered && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.75 }}
                className="flex flex-col items-center justify-between h-full p-0"
              >
                <h1 className="text-xs lg:text-lg   text-center backdrop-blur-md w-full">
                  <div>{card.title.split(" ")[0]}</div>
                  <div>{card.title.split(" ")[1]}</div>
                  {card.title.split(" ").length > 2 && (
                    <div>{card.title.split(" ")[2]}</div>
                  )}
                </h1>
                <p className="text-xs lg:text-xl text-center ">{card.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Disc panel with enter/exit animation */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="disc"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute  flex-col bottom-0  left-0 right-0 h-fit bg-white/20 backdrop-blur-sm lg:p-4 flex items-center justify-center"
              >
                <p className="text-xs lg:text-base text-white text-center py-1">
                  {card.disc}
                </p>
                <div className="flex  mb-1 gap-2">
                  <Link
                    href="https://www.instagram.com/orggec/"
                    aria-label="Instagram"
                    target="_blank"
                  >
                    <SiInstagram
                      className="hover:text-blue-400 transition-colors"
                      size={15}
                    />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/orggec/"
                    aria-label="LinkedIn"
                    target="_blank"
                  >
                    <SiLinkedin
                      className="hover:text-blue-400 transition-colors"
                      size={15}
                    />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);

Card.displayName = "Card";

// Main card group component
export const FocusCards: React.FC<{ cards: CardProps[] }> = ({ cards }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={`grid grid-rows-2 grid-cols-3  gap-5 lg:gap-2 lg:max-w-5xl lg:mx-auto lg:px-8 lg:w-full mx-auto lg:flex justify-center items-center`}
    >
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
};
