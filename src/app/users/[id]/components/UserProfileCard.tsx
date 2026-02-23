import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface UserProfileCardProps {
  user: any;
  authUserId?: number;
  openEditProfileModal: () => void;
}

export function UserProfileCard({
  user,
  authUserId,
  openEditProfileModal,
}: UserProfileCardProps) {
  return (
    <Card className="m-0">
      <CardHeader className="flex flex-col md:flex-row items-center md:justify-between sm:items-start text-center sm:text-left gap-4">
        <div className="flex items-center justify-between gap-4">
          <Avatar className="h-20 w-20 sm:h-16 sm:w-16">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xl">
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl flex items-center justify-between gap-4">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
        {authUserId === user.id && (
          <Button variant="outline" size="sm" onClick={openEditProfileModal}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}
