import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!formData.full_name.trim()) {
      toast.error('Nome completo é obrigatório');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    try {
      setUpdating(true);
      
      const result = await updateProfile({
        full_name: formData.full_name.trim(),
        email: formData.email.toLowerCase().trim()
      });

      if (result.error) {
        toast.error('Erro ao atualizar perfil: ' + result.error.message);
        return;
      }

      toast.success('Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro inesperado ao atualizar perfil:', error);
      toast.error('Erro inesperado ao atualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Por favor, preencha todos os campos de senha');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('A nova senha deve ter pelo menos 8 caracteres');
      return;
    }

    try {
      setChangingPassword(true);
      
      // Primeiro, verificar a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || '',
        password: passwordData.currentPassword
      });

      if (signInError) {
        toast.error('Senha atual incorreta');
        return;
      }

      // Alterar para a nova senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) {
        toast.error('Erro ao alterar senha: ' + updateError.message);
        return;
      }

      toast.success('Senha alterada com sucesso!');
      
      // Limpar campos de senha
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswords(false);
      
    } catch (error) {
      console.error('Erro inesperado ao alterar senha:', error);
      toast.error('Erro inesperado ao alterar senha');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      email: profile?.email || ''
    });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswords(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Seção de Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">Informações Pessoais</h3>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Digite seu nome completo"
                disabled={updating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                disabled={updating}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Usuário</Label>
              <div className="p-3 bg-muted rounded-lg">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  profile?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {profile?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleUpdateProfile} 
              disabled={updating}
              className="w-full"
            >
              {updating ? 'Atualizando...' : 'Atualizar Perfil'}
            </Button>
          </div>

          {/* Seção de Mudança de Senha */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">Alterar Senha</h3>
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual *</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Digite sua senha atual"
                  disabled={changingPassword}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha *</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Digite a nova senha"
                  disabled={changingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
              <Input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirme a nova senha"
                disabled={changingPassword}
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <p>• A senha deve ter pelo menos 8 caracteres</p>
              <p>• Use uma combinação de letras, números e símbolos</p>
            </div>

            <Button 
              onClick={handleChangePassword} 
              disabled={changingPassword}
              variant="outline"
              className="w-full"
            >
              {changingPassword ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};