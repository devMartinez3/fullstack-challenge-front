"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LocaleToggle() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Initial mount animation
      gsap.fromTo(
        containerRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.3,
        },
      );
    },
    { scope: containerRef },
  );

  const handleMouseEnter = () => {
    gsap.to(containerRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(containerRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
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
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{t("toggle")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => switchLocale("en")}
            className={
              locale === "en" ? "bg-accent text-accent-foreground" : ""
            }
          >
            {t("en")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => switchLocale("es")}
            className={
              locale === "es" ? "bg-accent text-accent-foreground" : ""
            }
          >
            {t("es")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
