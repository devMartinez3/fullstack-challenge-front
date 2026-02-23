"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Initial mount animation to ensure it becomes visible
      gsap.fromTo(
        containerRef.current,
        { y: -20, opacity: 0, rotation: 180 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          delay: 0.2,
        },
      );
    },
    { scope: containerRef },
  );

  const handleMouseEnter = () => {
    gsap.to(containerRef.current, {
      rotation: theme === "dark" ? -15 : 15,
      scale: 1.1,
      duration: 0.3,
      ease: "back.out(2)",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(containerRef.current, {
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm border border-gray-200"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
