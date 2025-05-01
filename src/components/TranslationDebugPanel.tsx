import React, { useState, useEffect, useMemo } from 'react';
import { useTranslationDebug } from '../hooks/useTranslationDebug';
import { languageService } from '../utils/i18n/languageService';
import { useTranslation } from 'react-i18next';

interface TranslationInfo {
  key: string;
  namespace?: string;
  language: string;
  source: 'translation' | 'fallback' | 'key';
  timestamp: number;
}

interface EditableTranslation {
  key: string;
  namespace?: string;
  value: string;
  isDirty: boolean;
}

/**
 * Debug panel for exploring and managing translations
 */
export function TranslationDebugPanel() {
  const { t, i18n } = useTranslation();
  const {
    isEnabled,
    config,
    setConfig,
    wrapContent,
    getAllTranslationInfo,
    clearTranslationInfo
  } = useTranslationDebug();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [translations, setTranslations] = useState<TranslationInfo[]>([]);
  const [editedTranslations, setEditedTranslations] = useState<Record<string, EditableTranslation>>({});
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Update translations list when debug info changes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setTranslations(getAllTranslationInfo());
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [getAllTranslationInfo]);

  // Filter translations based on search and namespace
  const filteredTranslations = useMemo(() => {
    let filtered = translations;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.key.toLowerCase().includes(query) ||
        t.namespace?.toLowerCase().includes(query)
      );
    }

    if (selectedNamespace !== 'all') {
      filtered = filtered.filter(t => t.namespace === selectedNamespace);
    }

    return filtered;
  }, [translations, searchQuery, selectedNamespace]);

  // Group translations by namespace
  const groupedTranslations = useMemo(() => {
    const groups: Record<string, TranslationInfo[]> = {};
    filteredTranslations.forEach(t => {
      const ns = t.namespace || 'default';
      if (!groups[ns]) groups[ns] = [];
      groups[ns].push(t);
    });
    return groups;
  }, [filteredTranslations]);

  // Get unique namespaces for filter dropdown
  const namespaces = useMemo(() => {
    const nsSet = new Set<string>();
    translations.forEach(t => nsSet.add(t.namespace || 'default'));
    return ['all', ...Array.from(nsSet)];
  }, [translations]);

  // Handle real-time translation editing
  const handleTranslationEdit = (key: string, namespace: string | undefined, value: string) => {
    const fullKey = namespace ? `${namespace}:${key}` : key;
    setEditedTranslations(prev => ({
      ...prev,
      [fullKey]: {
        key,
        namespace,
        value,
        isDirty: true
      }
    }));
  };

  // Save edited translations
  const saveTranslations = async () => {
    try {
      const updates: Record<string, Record<string, string>> = {};
      
      // Group updates by namespace
      Object.values(editedTranslations).forEach(({ key, namespace, value }) => {
        const ns = namespace || 'translation';
        if (!updates[ns]) updates[ns] = {};
        updates[ns][key] = value;
      });

      // Update each namespace's translation file
      for (const [ns, translations] of Object.entries(updates)) {
        await i18n.addResourceBundle(
          languageService.getCurrentLanguage(),
          ns,
          translations,
          true,
          true
        );
      }

      // Clear dirty state
      setEditedTranslations({});
    } catch (error) {
      console.error('Failed to save translations:', error);
    }
  };

  // Export translations to JSON
  const exportTranslations = () => {
    const exportData = {
      language: languageService.getCurrentLanguage(),
      timestamp: new Date().toISOString(),
      translations: editedTranslations
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translations_${languageService.getCurrentLanguage()}_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy translation key to clipboard
  const copyToClipboard = (key: string, namespace?: string) => {
    const textToCopy = namespace ? `t('${key}', { ns: '${namespace}' })` : `t('${key}')`;
    navigator.clipboard.writeText(textToCopy);
  };

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Translation Debug
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Translation Debug Panel</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {/* Debug Settings */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Debug Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.highlightMissing}
                      onChange={e => setConfig({ highlightMissing: e.target.checked })}
                      className="mr-2"
                    />
                    Highlight Missing Translations
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.showKeys}
                      onChange={e => setConfig({ showKeys: e.target.checked })}
                      className="mr-2"
                    />
                    Show Translation Keys
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.logMissing}
                      onChange={e => setConfig({ logMissing: e.target.checked })}
                      className="mr-2"
                    />
                    Log Missing Translations
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.trackUsage}
                      onChange={e => setConfig({ trackUsage: e.target.checked })}
                      className="mr-2"
                    />
                    Track Translation Usage
                  </label>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search translations..."
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <select
                  value={selectedNamespace}
                  onChange={e => setSelectedNamespace(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  {namespaces.map(ns => (
                    <option key={ns} value={ns}>
                      {ns === 'all' ? 'All Namespaces' : ns}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={saveTranslations}
                  disabled={Object.keys(editedTranslations).length === 0}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Save Changes
                </button>
                <button
                  onClick={exportTranslations}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Export Translations
                </button>
                <button
                  onClick={clearTranslationInfo}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Clear History
                </button>
              </div>

              {/* Translations Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Key</th>
                      <th className="px-4 py-2 text-left">Namespace</th>
                      <th className="px-4 py-2 text-left">Current Value</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTranslations.map((t, i) => {
                      const fullKey = t.namespace ? `${t.namespace}:${t.key}` : t.key;
                      const editedTranslation = editedTranslations[fullKey];
                      const currentValue = editedTranslation?.value || t.key;

                      return (
                        <tr key={`${fullKey}-${i}`} className="border-t">
                          <td className="px-4 py-2">{t.key}</td>
                          <td className="px-4 py-2">{t.namespace || 'default'}</td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={currentValue}
                              onChange={e => handleTranslationEdit(t.key, t.namespace, e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => copyToClipboard(t.key, t.namespace)}
                              className="text-blue-500 hover:text-blue-600 mr-2"
                              title="Copy translation key"
                            >
                              Copy Key
                            </button>
                            {editedTranslation?.isDirty && (
                              <span className="text-yellow-500">●</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 