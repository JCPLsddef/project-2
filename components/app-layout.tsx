'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Calendar, BookOpen, Target, User, LogOut, Trophy } from 'lucide-react';
import Link from 'next/link';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Accueil' },
    { href: '/today', icon: Target, label: 'Aujourd\'hui' },
    { href: '/plan', icon: Calendar, label: 'Plan 12S' },
    { href: '/drills', icon: BookOpen, label: 'Exercices' },
    { href: '/theory', icon: Trophy, label: 'Théorie' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="premium-gradient text-white py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">GOAT SETTER</h1>
            <p className="text-sm opacity-90">{profile?.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-white hover:bg-white/20">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        <nav className="lg:w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start ${isActive ? '' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {profile && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Streak</span>
                  <span className="font-bold text-[#2F6BFF]">{profile.streak} 🔥</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Moyenne</span>
                  <span className="font-bold">{profile.total_score_avg.toFixed(0)}/100</span>
                </div>
              </div>
            </div>
          )}
        </nav>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around p-2">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                size="icon"
                className={isActive ? '' : 'text-gray-600'}
              >
                <Icon className="w-5 h-5" />
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
