"use client";

import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/services/stats.service";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, FileText, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: statsService.getStats,
  });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-background">
      <Header title={t("title")} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Welcome / Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t("welcomeTitle")}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                {t("welcomeDescription")}
              </p>
            </div>
            <Button asChild>
              <Link href="/users">{t("manageUsers")}</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
              {[1, 2].map((i) => (
                <Card key={i} className="h-32 bg-muted/40" />
              ))}
            </div>
          ) : stats ? (
            <>
              {/* Stats Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("stats.users.title")}
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      {t("stats.users.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("stats.posts.title")}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPosts}</div>
                    <p className="text-xs text-muted-foreground">
                      {t("stats.posts.description")}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detail Lists */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Latest Users */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("latestUsers.title")}</CardTitle>
                    <CardDescription>
                      {t("latestUsers.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.latestUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-4">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt="Avatar" />
                            <AvatarFallback>
                              <UserCircle className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1 overflow-hidden">
                            <p className="text-sm font-medium leading-none truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                          <Link href={`/users/${user.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hidden sm:flex"
                            >
                              {t("latestUsers.view")}
                            </Button>
                          </Link>
                        </div>
                      ))}
                      {stats.latestUsers.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          {t("latestUsers.empty")}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("recentPosts.title")}</CardTitle>
                    <CardDescription>
                      {t("recentPosts.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between gap-4 border-b border-muted/50 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex-1 space-y-1 overflow-hidden">
                            <p className="text-sm font-medium leading-none truncate">
                              {post.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              <span className="font-medium text-foreground">
                                {post.author.firstName} {post.author.lastName}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                      {stats.recentPosts.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          {t("recentPosts.empty")}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-red-500">{t("error")}</div>
          )}
        </div>
      </main>
    </div>
  );
}
