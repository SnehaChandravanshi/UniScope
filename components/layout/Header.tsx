'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  GraduationCap, 
  Search, 
  GitCompare, 
  Bookmark, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard,
  Compass,
  MessageSquare,
  Sun,
  Moon
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const compareColleges = useStore((state) => state.compareColleges);
  const isAuroraMode = useStore((state) => state.isAuroraMode);
  const setIsAuroraMode = useStore((state) => state.setIsAuroraMode);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: '/colleges', label: 'Explore Colleges', icon: Compass },
    { href: '/compare', label: 'Compare', icon: GitCompare, badge: compareColleges.length },
    { href: '/predictor', label: 'Rank Predictor', icon: GraduationCap },
    { href: '/discussions', label: 'Discussions', icon: MessageSquare },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-350 ${
      isAuroraMode 
        ? 'bg-[#07080e]/75 border-white/5 shadow-[0_4px_25px_rgba(0,0,0,0.3)]' 
        : 'bg-background/80 border-border/40'
    }`}>
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-400 text-white shadow-md shadow-primary/20 transition-all group-hover:scale-105">
            <GraduationCap className="h-7 w-7" />
          </div>
          <span className={`bg-gradient-to-r bg-clip-text text-2xl font-black tracking-tight text-transparent sm:block ${
            isAuroraMode ? 'from-white to-slate-350' : 'from-foreground to-foreground/80'
          }`}>
            UniScope
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <span className={`inline-flex items-center space-x-2 rounded-lg px-4 py-2.5 text-base sm:text-lg font-semibold transition-all ${
                  active 
                    ? isAuroraMode
                      ? 'bg-primary/20 text-indigo-300 border border-primary/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                      : 'bg-primary/10 text-primary' 
                    : isAuroraMode
                      ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Actions (Auth / CTA) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Global Theme Switch */}
          <div className={`flex items-center gap-1 p-1 rounded-xl shadow-inner mr-2 border ${
            isAuroraMode ? 'bg-slate-900/60 border-white/5' : 'bg-muted/40 border-border/80'
          }`}>
            <button
              onClick={() => setIsAuroraMode(false)}
              className={`rounded-lg py-1.5 px-2.5 flex items-center gap-1 transition-all cursor-pointer text-xs font-bold ${
                !isAuroraMode 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setIsAuroraMode(true)}
              className={`rounded-lg py-1.5 px-2.5 flex items-center gap-1 transition-all cursor-pointer text-xs font-bold ${
                isAuroraMode 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              <span>Aurora</span>
            </button>
          </div>

          {status === 'authenticated' && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-full bg-muted shadow-inner hover:bg-accent border border-border/50 flex items-center justify-center font-bold text-primary text-base cursor-pointer">
                {session?.user?.name ? session.user.name[0]?.toUpperCase() : 'U'}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-3 py-2.5 flex flex-col space-y-1.5 border-b border-border/20">
                  <p className="text-base font-bold leading-none text-foreground">{session?.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                </div>
                <DropdownMenuItem 
                  onClick={() => router.push('/dashboard/saved')}
                  className="cursor-pointer flex items-center text-sm"
                >
                  <LayoutDashboard className="mr-2 h-4.5 w-4.5 text-muted-foreground" />
                  <span>Saved Colleges</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-sm font-semibold"
                >
                  <LogOut className="mr-2 h-4.5 w-4.5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-base text-muted-foreground hover:text-foreground px-4 py-2 hover:bg-transparent">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-5 py-2.5 rounded-xl shadow-md shadow-primary/10 text-base">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 py-4 animate-in slide-in-from-top-5 duration-200 ${
          isAuroraMode ? 'bg-[#0b0c16] border-white/5' : 'bg-background border-border'
        }`}>
          <div className="space-y-2">
            {/* Mobile Theme Toggle */}
            <div className={`flex items-center justify-between p-2 rounded-xl mb-4 border ${
              isAuroraMode ? 'bg-slate-900/40 border-white/5' : 'bg-muted/20 border-border/70'
            }`}>
              <span className="text-xs font-bold text-muted-foreground">Premium Theme</span>
              <div className="flex items-center gap-1 p-1 rounded-lg">
                <button
                  onClick={() => setIsAuroraMode(false)}
                  className={`rounded-md text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 flex items-center gap-1 transition-all ${
                    !isAuroraMode ? 'bg-primary text-white' : 'text-muted-foreground'
                  }`}
                >
                  <Sun className="h-3 w-3" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setIsAuroraMode(true)}
                  className={`rounded-md text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 flex items-center gap-1 transition-all ${
                    isAuroraMode ? 'bg-primary text-white' : 'text-muted-foreground'
                  }`}
                >
                  <Moon className="h-3 w-3" />
                  <span>Aurora</span>
                </button>
              </div>
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            <DropdownMenuSeparator className="my-2" />

            {status === 'authenticated' && session?.user ? (
              <>
                <div className="px-4 py-2 text-sm">
                  <p className="font-semibold text-foreground">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <Link
                  href="/dashboard/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Bookmark className="h-5 w-5" />
                  <span>Saved Items Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-medium">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
export default Header;
