'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "./ui/button";
import { Globe } from 'lucide-react';
import { useCallback } from 'react';

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = {
    en: 'English',
    hi: 'हिंदी',
    te: 'తెలుగు'
  };

  const handleLanguageChange = useCallback((newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }, [pathname, router]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative group">
        <Button 
          variant="outline" 
          className="bg-black/50 backdrop-blur-sm border-gray-800 hover:border-gray-700"
        >
          <Globe className="w-4 h-4 mr-2" />
          {languages[locale as keyof typeof languages]}
        </Button>
        <div className="absolute right-0 mt-2 w-32 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-800/50 transition-colors
                  ${locale === code ? 'text-blue-400' : 'text-gray-300'}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}