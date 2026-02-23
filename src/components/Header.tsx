"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleToggle } from "@/components/LocaleToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter();
  const t = useTranslations("header");
  const { logout, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayTitle = title || t("defaultTitle");

  return (
    <header className="flex h-16 items-center border-b bg-white dark:bg-background px-4 md:px-6 shrink-0 gap-2">
      {showBack && (
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      )}
      <Link
        href="/"
        className="flex items-center gap-2 mr-6 shrink-0 transition-opacity hover:opacity-80"
      >
        <h1 className="text-lg sm:text-xl font-bold truncate max-w-[140px] sm:max-w-none">
          {displayTitle}
        </h1>
      </Link>

      {!showBack && (
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("nav.dashboard")}
          </Link>
          <Link
            href="/users"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("nav.users")}
          </Link>
        </nav>
      )}
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <LocaleToggle />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={mounted && user?.avatar ? user.avatar : undefined}
                  alt={
                    mounted && user
                      ? `${user.first_name} ${user.last_name}`
                      : t("user.fallback")
                  }
                />
                <AvatarFallback>
                  {mounted && user ? (
                    `${user.first_name} ${user.last_name}`
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal flex justify-between">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {mounted && user
                    ? `${user.first_name} ${user.last_name}`
                    : t("user.loading")}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {mounted && user ? user.email : ""}
                </p>
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {mounted && user ? user.role : ""}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/users/${user?.id}?editProfile=true`}
                className="cursor-pointer w-full text-foreground"
              >
                <span>{t("user.editProfile")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("user.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
