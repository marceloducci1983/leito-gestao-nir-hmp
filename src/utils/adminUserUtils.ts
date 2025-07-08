
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const changeUserPassword = async (email: string, newPassword: string) => {
  try {
    console.log('🔄 Iniciando alteração de senha para:', email);
    
    // Primeiro, buscar o usuário pelo email
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (profileError) {
      console.error('❌ Erro ao buscar usuário:', profileError);
      toast.error('Erro ao buscar usuário: ' + profileError.message);
      return { error: profileError };
    }

    if (!profiles) {
      console.error('❌ Usuário não encontrado:', email);
      toast.error('Usuário não encontrado');
      return { error: { message: 'Usuário não encontrado' } };
    }

    console.log('✅ Usuário encontrado:', profiles);

    // Usar Admin API para atualizar a senha
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      profiles.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('❌ Erro ao alterar senha via Admin API:', updateError);
      toast.error('Erro ao alterar senha: ' + updateError.message);
      return { error: updateError };
    }

    console.log('🎉 Senha alterada com sucesso para:', email);
    toast.success(`✅ Senha alterada com sucesso para ${profiles.full_name} (${email})`);
    
    return { error: null, user: profiles };

  } catch (error) {
    console.error('💥 Erro inesperado ao alterar senha:', error);
    const errorMsg = 'Erro inesperado ao alterar senha: ' + (error as Error).message;
    toast.error(errorMsg);
    return { error: { message: errorMsg } };
  }
};
