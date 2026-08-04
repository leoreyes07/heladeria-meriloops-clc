import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { X, Globe, DollarSign } from 'lucide-react';
import { Language, Currency } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, language, setLanguage, currency, setCurrency, exchangeRate, setExchangeRate, t } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{t('modals.settingsTitle')}</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group mb-6">
            <label className="form-label mb-2 flex-row items-center gap-2">
              {t('modals.theme')}
            </label>
            <div className="flex-row gap-4">
              <label className="flex-row items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="theme" 
                  value="dark" 
                  checked={theme === 'dark'} 
                  onChange={() => setTheme('dark')} 
                />
                <span className="text-white text-sm">{t('modals.darkTheme')}</span>
              </label>
              <label className="flex-row items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="theme" 
                  value="light" 
                  checked={theme === 'light'} 
                  onChange={() => setTheme('light')} 
                />
                <span className="text-white text-sm">{t('modals.lightTheme')}</span>
              </label>
            </div>
          </div>
          <div className="form-group mb-6">
            <label className="form-label mb-2 flex-row items-center gap-2">
              <Globe size={14} /> {t('modals.language')}
            </label>
            <div className="flex-row gap-4">
              <label className="flex-row items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="language" 
                  value="en" 
                  checked={language === 'en'} 
                  onChange={() => setLanguage('en')} 
                />
                <span className="text-white text-sm">{t('modals.english')}</span>
              </label>
              <label className="flex-row items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="language" 
                  value="es" 
                  checked={language === 'es'} 
                  onChange={() => setLanguage('es')} 
                />
                <span className="text-white text-sm">{t('modals.spanish')}</span>
              </label>
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label mb-2 flex-row items-center gap-2">
              <DollarSign size={14} /> {t('modals.currency')}
            </label>
            <div className="flex-row gap-4 mb-4">
              <label className="flex-row items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="currency" 
                  value="USD" 
                  checked={currency === 'USD'} 
                  onChange={() => setCurrency('USD')} 
                />
                <span className="text-white text-sm">{t('modals.dollars')}</span>
              </label>
              <label className="flex-row items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="currency" 
                  value="NIO" 
                  checked={currency === 'NIO'} 
                  onChange={() => setCurrency('NIO')} 
                />
                <span className="text-white text-sm">{t('modals.cordobas')}</span>
              </label>
            </div>

            {currency === 'NIO' && (
              <div className="form-group">
                <label className="form-label">{t('modals.exchangeRate')}</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
                  className="form-input"
                />
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="action-btn-primary w-full">
            {t('modals.saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
};
