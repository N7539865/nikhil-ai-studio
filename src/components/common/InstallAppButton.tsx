// src/components/common/InstallAppButton.tsx
import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, Check, Laptop, Sparkles } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallAppButtonProps {
  variant?: 'header' | 'sidebar' | 'banner';
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({ variant = 'header' }) => {
  const { showToast } = useStudio();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      showToast('Nikhil AI Studio successfully installed as an app!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showToast]);

  const handleInstallClick = async () => {
    if (isInstalled) {
      showToast('App is already installed!', 'info');
      return;
    }

    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          showToast('Installing Nikhil AI Studio app...', 'success');
          setDeferredPrompt(null);
        } else {
          showToast('App installation cancelled', 'info');
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else {
      // Prompt not captured yet or desktop browser instruction
      setShowIOSModal(true);
    }
  };

  if (isInstalled) {
    return (
      variant === 'sidebar' ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>App Installed</span>
        </div>
      ) : null
    );
  }

  return (
    <>
      {variant === 'header' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 animate-pulse hover:animate-none"
          title="Install Nikhil AI Studio as Native App"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-900/40 via-studio-900 to-emerald-950/40 border border-purple-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-3 -translate-y-3 w-16 h-16 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Smartphone className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-slate-100">Install Mobile App</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold ml-auto">
              FREE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
            Add Nikhil AI to your phone or desktop home screen for full-screen offline access.
          </p>
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App Now</span>
          </button>
        </div>
      )}

      {/* iOS & Manual Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-studio-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-studio-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Install Nikhil AI Studio</h3>
                <p className="text-xs text-purple-400">100% Free - Fast - No App Store Required</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  To install on your <strong>iPhone or iPad</strong>:
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-studio-950 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    <p className="text-xs text-slate-300">
                      Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-1 text-purple-400" /> at the bottom of Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-studio-950 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    <p className="text-xs text-slate-300">
                      Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-purple-400" />.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-studio-950 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    <p className="text-xs text-slate-300">
                      Tap <strong>Add</strong> in the top right corner. The app icon will appear instantly on your phone!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Install on your Android device or PC in seconds:
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-studio-950 border border-slate-800">
                    <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300">
                      <strong className="text-slate-100 block mb-0.5">On Android (Chrome):</strong>
                      Tap the 3 dots (⋮) in the top right corner and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-studio-950 border border-slate-800">
                    <Laptop className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300">
                      <strong className="text-slate-100 block mb-0.5">On Windows PC / Mac (Chrome / Edge):</strong>
                      Click the <strong>Install</strong> icon in the address bar (right side of URL) or select <strong>Install Nikhil AI Studio</strong> from browser settings.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
