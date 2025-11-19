import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { LearnerSettings } from '@shared/schema';

interface SettingsContextType {
  settings: LearnerSettings;
  updateSettings: (updates: Partial<LearnerSettings>) => void;
}

const defaultSettings: LearnerSettings = {
  fontSize: 'default',
  lineSpacing: 'normal',
  highContrast: false,
  animationsEnabled: true,
  audioEnabled: true,
  hapticEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LearnerSettings>(() => {
    const saved = localStorage.getItem('neurolearn-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('neurolearn-settings', JSON.stringify(settings));
    
    const root = document.documentElement;
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('no-animations', !settings.animationsEnabled);
    
    if (settings.fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (settings.fontSize === 'extraLarge') {
      root.style.fontSize = '22px';
    } else {
      root.style.fontSize = '16px';
    }
    
    const lineSpacingMap = {
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    };
    root.style.lineHeight = lineSpacingMap[settings.lineSpacing];
  }, [settings]);

  const updateSettings = (updates: Partial<LearnerSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
