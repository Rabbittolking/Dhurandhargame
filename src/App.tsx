import { useEffect, useState } from 'react';
import { Gamepad2, Home, Trophy, User as UserIcon, LogIn, Search, Flame, Sword, Star } from 'lucide-react';
import { signInWithGoogle, signOut, onAuthStateChanged, User, auth } from './firebase';
import { AdManager, BannerAd } from './components/AdManager';

// --- Types ---
type Tab = 'home' | 'games' | 'leaderboard' | 'profile';

// --- Mock Data ---
const FEATURED_GAMES = [
  { id: 1, title: 'Neon Riders', category: 'Racing', image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80', players: '2.4k' },
  { id: 2, title: 'Cyber Clash', category: 'Action', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', players: '5.1k' },
  { id: 3, title: 'Realm Defense', category: 'Strategy', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', players: '1.2k' },
];

const CATEGORIES = [
  { name: 'Action', icon: Sword, color: 'bg-red-500/20 text-red-500' },
  { name: 'Trending', icon: Flame, color: 'bg-orange-500/20 text-orange-500' },
  { name: 'Strategy', icon: Star, color: 'bg-purple-500/20 text-purple-500' },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden ring-1 ring-white/10 sm:h-screen sm:rounded-[2rem] sm:my-8 text-slate-50">
      <AdManager />
      
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20">
        <div>
          <p className="text-slate-400 text-sm font-medium">Welcome back,</p>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {user.displayName?.split(' ')[0] || 'Gamer'}
          </h1>
        </div>
        <button 
          onClick={signOut}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500/30 hover:border-indigo-500 transition-colors"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
              <UserIcon size={20} className="text-white" />
            </div>
          )}
        </button>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-6 no-scrollbar">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'games' && <div className="py-8 text-center text-slate-400">Games library coming soon...</div>}
        {activeTab === 'leaderboard' && <div className="py-8 text-center text-slate-400">Leaderboard coming soon...</div>}
        {activeTab === 'profile' && (
          <div className="py-8 flex flex-col items-center">
             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 mb-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                 <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <UserIcon size={40} className="text-slate-400" />
                 </div>
              )}
             </div>
             <h2 className="text-xl font-bold font-display">{user.displayName}</h2>
             <p className="text-slate-400 mb-8">{user.email}</p>
             <button 
               onClick={signOut}
               className="px-6 py-3 bg-red-500/10 text-red-500 font-medium rounded-2xl w-full"
             >
               Sign Out
             </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/5 z-20 flex flex-col">
        <BannerAd />
        <div className="flex justify-between items-center max-w-sm mx-auto w-full px-6 py-3 pb-safe">
          <NavItem icon={Home} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={Gamepad2} label="Games" isActive={activeTab === 'games'} onClick={() => setActiveTab('games')} />
          <NavItem icon={Trophy} label="Rank" isActive={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} />
          <NavItem icon={UserIcon} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>
    </div>
  );
}

function HomeTab() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search games..." 
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
        />
      </div>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">Categories</h2>
          <button className="text-sm text-indigo-400 font-medium">See all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          {CATEGORIES.map((cat, i) => (
            <button key={i} className="flex flex-col items-center gap-3 shrink-0 group">
              <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${cat.color} transition-transform group-hover:scale-95`}>
                <cat.icon className="w-7 h-7" />
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className={`relative h-48 rounded-[2rem] overflow-hidden ${isLoading ? 'bg-slate-900/80 animate-pulse' : 'group cursor-pointer'}`}>
        {!isLoading ? (
          <>
            <img 
              src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80" 
              alt="Featured Tournament" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md w-fit mb-2">Live Tournament</div>
              <h3 className="text-2xl font-display font-bold text-white mb-1">Galactic Championship</h3>
              <p className="text-sm text-slate-300 font-medium">Prize Pool: $50,000</p>
            </div>
          </>
        ) : (
          <div className="absolute bottom-5 left-5 right-5 space-y-3">
            <div className="h-5 w-28 bg-slate-800 rounded-md"></div>
            <div className="h-7 w-56 bg-slate-800 rounded-md"></div>
            <div className="h-4 w-32 bg-slate-800 rounded-md"></div>
          </div>
        )}
      </section>

      {/* Popular Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">Popular Now</h2>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center bg-slate-900/50 p-3 rounded-2xl">
                <div className="w-20 h-20 rounded-xl bg-slate-800 shrink-0 animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-3 w-1/4 bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse"></div>
              </div>
            ))
          ) : (
            FEATURED_GAMES.map((game) => (
              <div key={game.id} className="flex gap-4 items-center bg-slate-900/50 p-3 rounded-2xl hover:bg-slate-800/80 transition-colors cursor-pointer group">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 mb-1 leading-tight">{game.title}</h3>
                  <p className="text-xs text-indigo-400 font-medium mb-2">{game.category}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <UserIcon size={12} className="text-slate-400" />
                    <span>{game.players} playing</span>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Gamepad2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function LoginScreen() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans sm:h-screen sm:rounded-[2rem] sm:my-8 max-w-md mx-auto shadow-2xl ring-1 ring-white/10">
      {/* Background flair */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-8 rotate-3">
        <Gamepad2 className="w-12 h-12 text-white -rotate-3" />
      </div>

      <div className="text-center z-10 space-y-4 mb-16">
        <h1 className="text-5xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Dhurandhar
        </h1>
        <p className="text-slate-400 text-lg max-w-[280px]">
          The ultimate native gaming experience awaits.
        </p>
      </div>

      <div className="w-full w-full space-y-4 z-10 mt-auto mb-12">
        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors active:scale-[0.98] disabled:opacity-70"
        >
          {isLoggingIn ? (
            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>
        
        <p className="text-center text-sm text-slate-500">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${
        isActive ? 'text-indigo-400 font-semibold' : 'text-slate-500 hover:text-slate-300 font-medium'
      }`}
    >
      <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
        <Icon className="w-[1.4rem] h-[1.4rem]" strokeWidth={isActive ? 2.5 : 2} />
        {isActive && (
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
        )}
      </div>
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
}

