
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { changeUserPassword } from '@/utils/adminUserUtils';

export const AdminPasswordChanger: React.FC = () => {
  const [changing, setChanging] = useState(false);

  const handleChangePassword = async () => {
    setChanging(true);
    try {
      await changeUserPassword('sociocecel@yahoo.com.br', '12345678');
    } finally {
      setChanging(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Alteração de Senha - Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Alterar senha do usuário: <strong>sociocecel@yahoo.com.br</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Nova senha: <strong>12345678</strong>
          </p>
          <Button 
            onClick={handleChangePassword} 
            disabled={changing}
            className="w-full"
          >
            {changing ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
