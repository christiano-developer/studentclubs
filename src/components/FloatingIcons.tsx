"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const TOTAL_ICONS = 20;
// percentage boundaries for the central exclusion zone
const CENTER_EXCLUSION = {
  left: 30, // avoid icons with left between 30vw and 70vw
  right: 70,
  top: 30, // avoid icons with top between 30vh and 70vh
  bottom: 70,
};

interface IconData {
  src: string;
  top: string;
  left: string;
  delay: string;
  duration: string;
}

const isInCenterZone = (top: number, left: number) => {
  return (
    left > CENTER_EXCLUSION.left &&
    left < CENTER_EXCLUSION.right &&
    top > CENTER_EXCLUSION.top &&
    top < CENTER_EXCLUSION.bottom
  );
};

const FloatingIcons: React.FC = () => {
  const [iconData, setIconData] = useState<IconData[]>([]);

  useEffect(() => {
    const cols = Math.ceil(Math.sqrt(TOTAL_ICONS));
    const rows = Math.ceil(TOTAL_ICONS / cols);
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;

    // build and shuffle the cells
    const cells: { row: number; col: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        cells.push({ row, col });
      }
    }
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    const data: IconData[] = [];
    let index = 0;
    // generate until we fill TOTAL_ICONS positions outside the center zone
    while (data.length < TOTAL_ICONS && index < cells.length) {
      const { row, col } = cells[index];
      const rawTop = row * cellHeight + Math.random() * cellHeight;
      const rawLeft = col * cellWidth + Math.random() * cellWidth;

      // only include if not in the exclusion zone
      if (!isInCenterZone(rawTop, rawLeft)) {
        data.push({
          src: `/elementsFloat/f${data.length + 1}.png`,
          top: `${rawTop}vh`,
          left: `${rawLeft}vw`,
          delay: `${Math.random() * 3}s`,
          duration: `${4 + Math.random() * 4}s`,
        });
      }
      index++;
    }

    setIconData(data);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden ">
      {iconData.map((icon, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            top: icon.top,
            left: icon.left,
            animationDelay: icon.delay,
            animationDuration: icon.duration,
            width: 50,
            height: 50,
          }}
        >
          <Image
            src={icon.src}
            alt={`icon-${i + 1}`}
            width={40}
            height={40}
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
