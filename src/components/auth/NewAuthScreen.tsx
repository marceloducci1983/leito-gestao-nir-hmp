import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Moon } from 'lucide-react';
export const NewAuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {
    signIn
  } = useAuth();
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
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };
  React.useEffect(() => {
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
  return <div className="min-h-screen flex items-center justify-center relative" style={{
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
    backgroundColor: '#1e40af'
  }}>
      {/* Theme toggle button */}
      <Button onClick={toggleTheme} variant="outline" size="icon" className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white/100 dark:bg-gray-800/90 dark:hover:bg-gray-800/100 transition-all duration-300">
        {isDarkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-600" />}
      </Button>

      {/* Overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${isDarkMode ? 'bg-black bg-opacity-70' : 'bg-white bg-opacity-20'}`}></div>
      
      {/* Auth Card */}
      <Card className="w-full max-w-md mx-4 relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl transition-all duration-300 border-2 border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
            SISTEMA DE GESTÃO DE LEITOS
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">NIR - HMP</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Digite seu email" disabled={loading} className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" required />
            </div>
            <div>
              <Label htmlFor="password" className="dark:text-gray-200">Senha</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Digite sua senha" disabled={loading} className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" required />
            </div>
            <Button type="submit" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          
        </CardContent>
      </Card>
    </div>;
};