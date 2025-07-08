import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
}

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  open, 
  onOpenChange, 
  user 
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Garantir pelo menos uma letra maiúscula, minúscula, número e símbolo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Completar com caracteres aleatórios até 12 caracteres
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Embaralhar a senha
    const shuffled = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setNewPassword(shuffled);
    setConfirmPassword(shuffled);
    setGeneratedPassword(shuffled);
    toast.success('Senha segura gerada automaticamente!');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Senha copiada para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar senha');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!newPassword || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    try {
      setUpdating(true);
      
      // Usar o Admin API do Supabase para atualizar a senha
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (error) {
        console.error('Erro ao alterar senha:', error);
        toast.error('Erro ao alterar senha: ' + error.message);
        return;
      }

      toast.success('Senha alterada com sucesso!');
      
      // Limpar formulário
      setNewPassword('');
      setConfirmPassword('');
      setGeneratedPassword('');
      setShowPasswords(false);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Erro inesperado ao alterar senha:', error);
      toast.error('Erro inesperado ao alterar senha');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setNewPassword('');
    setConfirmPassword('');
    setGeneratedPassword('');
    setShowPasswords(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Senha do Usuário</DialogTitle>
        </DialogHeader>
        
        {user && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="newPassword">Nova Senha *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateStrongPassword}
                disabled={updating}
              >
                Gerar Senha
              </Button>
            </div>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                disabled={updating}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
              disabled={updating}
            />
          </div>

          {generatedPassword && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Senha Gerada:</p>
                  <p className="text-sm font-mono text-green-700 break-all">{generatedPassword}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedPassword)}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Compartilhe esta senha com o usuário de forma segura
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>• A senha deve ter pelo menos 8 caracteres</p>
            <p>• Use uma combinação de letras, números e símbolos</p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={updating}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};