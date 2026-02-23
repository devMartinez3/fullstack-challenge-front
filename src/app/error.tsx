"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { contextSafe } = useGSAP({ scope: buttonRef });
  const router = useRouter();

  const handleMouseEnter = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleMouseMove = contextSafe((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(e.currentTarget, {
      x: x * 0.1,
      y: y * 0.1,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleMouseDown = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 0.95,
      duration: 0.1,
    });
  });

  const handleMouseUp = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.02,
      duration: 0.1,
    });
  });
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <h2 className="text-xl font-semibold text-destructive">
        ¡Algo salió mal!
      </h2>
      <p className="text-muted-foreground">
        No se pudieron cargar los ajustes. Por favor, intenta de nuevo.
      </p>
      <button
        ref={buttonRef}
        type="submit"
        onClick={() => router.push("/")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className={cn(
          "w-full py-4 rounded-lg font-bold text-lg transition-colors shadow-lg flex justify-center items-center cursor-pointer gap-2 relative overflow-hidden group",
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20",
        )}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out skew-y-12 origin-bottom" />

        <span className="relative flex items-center gap-2">
          Regresar al inicio
        </span>
      </button>
    </div>
  );
}
