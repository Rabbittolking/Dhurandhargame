import { useEffect, useState } from 'react';
import { X, PlayCircle } from 'lucide-react';

export function AdManager() {
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Har 5 minute me ad show karega (5 * 60 * 1000 = 300,000 ms)
    // Testing ke liye aap ise 10,000 (10 sec) kar sakte hai
    const interval = setInterval(() => {
      setShowInterstitial(true);
      setCanClose(false);
      setCountdown(5);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showInterstitial && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (showInterstitial && countdown === 0) {
      setCanClose(true);
    }
    return () => clearTimeout(timer);
  }, [showInterstitial, countdown]);

  if (!showInterstitial) return null;

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-6 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8">
         {canClose ? (
           <button 
             onClick={() => setShowInterstitial(false)}
             className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-full text-slate-400 hover:text-white z-10 transition-colors"
           >
             <X size={16} />
           </button>
         ) : (
           <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-full text-slate-400 z-10 text-xs font-bold">
             {countdown}
           </div>
         )}
         
         <div className="p-8 text-center space-y-4">
            <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              <PlayCircle size={12} />
              Advertisement
            </div>
            <h3 className="text-xl font-display font-bold text-white">Google AdMob</h3>
            
            <div className="text-left bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 mt-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Interstitial Ad Unit ID</p>
              <p className="text-xs text-indigo-400 font-mono break-all selection:bg-indigo-500/30">
                ca-app-pub-3113275088766608/2247393575
              </p>
            </div>

            <div className="h-48 bg-slate-800 mt-4 rounded-xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:scale-110 transition-transform duration-1000" />
              <span className="text-slate-500 font-medium relative z-10 text-sm">Real Ad Will Render Here</span>
            </div>
         </div>
      </div>
    </div>
  );
}

export function BannerAd() {
  return (
    <div className="w-full bg-slate-950 border-t border-slate-800 py-2 flex flex-col items-center justify-center">
      <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-0.5">AdMob Banner</span>
      <span className="text-[10px] text-slate-500 font-mono">ca-app-pub-3113275088766608/8812801925</span>
    </div>
  );
}
