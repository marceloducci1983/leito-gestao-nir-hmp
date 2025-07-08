import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon } from 'lucide-react';
interface LoginScreenProps {
  onLogin: () => void;
}
const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {
    toast
  } = useToast();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || !savedTheme && systemPrefersDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  const handleLogin = async () => {
    setIsLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      if (email === 'admin@hospital.com' && password === '12345') {
        onLogin();
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao Sistema de Gestão de Leitos NIR-HMP"
        });
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 500);
  };
  return <div className="min-h-screen flex items-center justify-center relative" style={{
    backgroundImage: `url('/lovable-uploads/e88a02d5-fb65-4fd9-abed-f27eb630e39b.png'), linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)`,
    backgroundSize: 'cover, cover',
    backgroundPosition: 'center, center',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundAttachment: 'fixed, fixed',
    backgroundColor: '#1e40af'
  }}>
      {/* Theme toggle button */}
      <Button onClick={toggleTheme} variant="outline" size="icon" className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white/100 dark:bg-gray-800/90 dark:hover:bg-gray-800/100 transition-all duration-300">
        {isDarkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-600" />}
      </Button>

      {/* Overlay with dynamic opacity for better contrast */}
      <div className={`absolute inset-0 transition-all duration-300 ${isDarkMode ? 'bg-black bg-opacity-70' : 'bg-white bg-opacity-20'}`}></div>
      
      {/* Card de login adaptável ao tema */}
      <Card className="w-full max-w-md mx-4 relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl transition-all duration-300 border-2 border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
            SISTEMA DE GESTÃO DE LEITOS
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">NIR - HMP</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Digite seu email" 
              disabled={isLoading} 
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" 
            />
          </div>
          <div>
            <Label htmlFor="password" className="dark:text-gray-200">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Digite sua senha" onKeyPress={e => e.key === 'Enter' && !isLoading && handleLogin()} disabled={isLoading} className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" />
          </div>
          <Button onClick={handleLogin} className="w-full dark:bg-blue-600 dark:hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 transition-colors duration-300">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-300">
                <strong>Acesso de Teste:</strong><br />
                Email: admin@hospital.com<br />
                Senha: 12345
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default LoginScreen;