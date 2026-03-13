import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface InstitutionSettings {
    id?: number;
    institutionType: 'pesantren' | 'umum' | 'madrasah' | '';
    educationLevel: string;
    institutionName: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
    website?: string;
    npsn?: string;
    nss?: string;
    vision?: string;
    mission?: string;
}

interface SettingsContextType {
    settings: InstitutionSettings;
    updateSettings: (newSettings: Partial<InstitutionSettings>) => Promise<void>;
    isConfigured: boolean;
    isLoading: boolean;
    refreshSettings: () => Promise<void>;
}

const defaultSettings: InstitutionSettings = {
    institutionType: '',
    educationLevel: '',
    institutionName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    npsn: '',
    nss: '',
    vision: '',
    mission: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<InstitutionSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings from API on mount
    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/institution/settings');
            
            if (response.data.isConfigured && response.data.institution) {
                setSettings(response.data.institution);
            } else {
                setSettings(defaultSettings);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            setSettings(defaultSettings);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const updateSettings = async (newSettings: Partial<InstitutionSettings>) => {
        try {
            const response = await axios.post('/api/institution/settings', newSettings);
            
            if (response.data.institution) {
                setSettings(response.data.institution);
            }
        } catch (error) {
            console.error('Failed to update settings:', error);
            throw error;
        }
    };

    const refreshSettings = async () => {
        await loadSettings();
    };

    const isConfigured = !!(
        settings.institutionType &&
        settings.educationLevel &&
        settings.institutionName
    );

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isConfigured, isLoading, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
