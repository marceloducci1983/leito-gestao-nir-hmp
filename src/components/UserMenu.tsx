
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Shield, UserPen, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileModal } from '@/components/settings/UserProfileModal';

interface UserMenuProps {
  onSettingsClick: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onSettingsClick }) => {
  const { profile, signOut, isAdmin } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (!profile) return null;

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{profile.full_name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
            <div className="flex items-center gap-1 mt-1">
              {isAdmin && <Shield className="h-3 w-3 text-purple-600" />}
              <span className="text-xs text-muted-foreground">
                {isAdmin ? 'Administrador' : 'Usuário'}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
          <UserPen className="mr-2 h-4 w-4" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Users className="mr-2 h-4 w-4" />
              <span>Gerenciar Usuários</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={signOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
    <UserProfileModal
      open={isProfileModalOpen}
      onOpenChange={setIsProfileModalOpen}
    />
  </>
  );
};
