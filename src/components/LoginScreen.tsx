
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simular delay de autenticação
    setTimeout(() => {
      if (username === 'admin' && password === '12345') {
        onLogin();
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao Sistema de Gestão de Leitos NIR-HMP",
        });
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Usuário ou senha incorretos",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url('/lovable-uploads/e0710d35-e746-4dd3-b74e-aa7fa404e37c.png'), linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)`,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundColor: '#1e40af'
      }}
    >
      {/* Overlay semi-transparente para melhor legibilidade */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Card de login com fundo semi-transparente */}
      <Card className="w-full max-w-md mx-4 relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            SISTEMA DE GESTÃO DE LEITOS
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">NIR - HMP</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleLogin()}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleLogin} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Usuário: admin</p>
            <p>Senha: 12345</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
