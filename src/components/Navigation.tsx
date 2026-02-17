import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Home, LogIn, Scan, ShoppingBasket, Wallet } from 'lucide-react';
import { Button } from '../ui/button';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/scan', label: 'Scanner', icon: Scan },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/basket', label: 'Basket', icon: ShoppingBasket },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-800 bg-emerald-700 text-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <ul className="mx-auto flex h-14 max-w-3xl items-stretch justify-between gap-1 px-1 sm:h-16 sm:px-3">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <Button
              asChild
              variant="ghost"
              className="h-full w-full flex-col gap-1 rounded-none px-0 py-1 text-[11px] font-medium text-white/90 hover:bg-white/10 hover:text-white sm:text-xs"
            >
              <Link to={item.to}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                <span className="leading-none">{item.label}</span>
              </Link>
            </Button>
          </li>
        ))}
        <li className="flex-1">
          <SignedOut>
            <Button
              asChild
              variant="ghost"
              className="h-full w-full flex-col gap-1 rounded-none px-0 py-1 text-[11px] font-medium text-white/90 hover:bg-white/10 hover:text-white sm:text-xs"
            >
              <Link to="/login">
                <LogIn className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                <span className="leading-none">Login</span>
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-white/90 sm:text-xs">
              <UserButton afterSignOutUrl="/login" />
              <span className="leading-none">Account</span>
            </div>
          </SignedIn>
        </li>
      </ul>
    </nav>
  );
}
