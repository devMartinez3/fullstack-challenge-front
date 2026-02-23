"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 25,
        scale: 0.97,
        filter: "blur(10px)",
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  return <div ref={containerRef}>{children}</div>;
}
