"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslations } from "next-intl";
import { LocaleToggle } from "@/components/LocaleToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const t = useTranslations("login");

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data: any) => {
      const { user, token } = data;

      setAuth(token, user);
      toast.success(t("success"));
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("errors.default"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t("errors.missingCredentials"));
      return;
    }
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
      <Card className="md:w-full md:max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            {t("title")}
            <div className="flex items-center gap-2">
              <LocaleToggle />
              <ThemeToggle />
            </div>
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="eve.holt@reqres.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t("submitting") : t("submit")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
