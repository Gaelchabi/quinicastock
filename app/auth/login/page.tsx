'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Package, Mail, Lock } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useApp();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = (provider: string) => {
    toast({
      title: 'Connexion sociale',
      description: `La connexion via ${provider} n'est pas encore disponible. Utilisez votre email et mot de passe.`,
      variant: 'destructive',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await api.auth.login(email, password);

    if (error) {
      toast({
        title: 'Erreur',
        description: error,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      if (data.tenantId) localStorage.setItem('tenantId', data.tenantId);
      localStorage.setItem('role', data.role);
      
      setUser({
        id: data.userId,
        email,
        name: email.split('@')[0],
        storeId: data.tenantId || undefined,
      });
      
      toast({
        title: 'Connexion réussie',
        description: data.tenantId ? 'Redirection vers le tableau de bord...' : 'Configuration de votre quincaillerie...',
      });

      if (data.tenantId) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Package className="h-8 w-8 text-primary" />
            <span className="font-semibold text-2xl">QuincaStock</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder à votre quincaillerie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social login buttons - disabled for now */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full gap-3"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
              </Button>

              <Button
                variant="outline"
                className="w-full gap-3"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuer avec Facebook
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground shrink-0">ou avec un email</span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <InputGroup>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <InputGroupInput
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Mot de passe</FieldLabel>
                  <InputGroup>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <InputGroupInput
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Field>
              </FieldGroup>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Pas encore de compte ? </span>
              <Link href="/auth/register" className="text-primary hover:underline">
                {"S'inscrire"}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
