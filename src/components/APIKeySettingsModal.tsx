import { useState } from 'react';
import { Check, Copy, Info, Key, X } from 'lucide-react';

interface APIKeySettingsModalProps {
  onClose: () => void;
}

export function APIKeySettingsModal({ onClose }: APIKeySettingsModalProps) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveAPIKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose(); // Close modal after saving
      }, 2000);
    } else {
      // Clear API key if empty
      localStorage.removeItem('openai_api_key');
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 2000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Key size={20} className="mr-2 text-blue-600" />
            API Key Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="mb-4 text-gray-600">
            To use the AI Prompt Optimizer, you need to provide an OpenAI API key. Your key is stored locally in your browser and never sent to our servers.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex">
            <Info size={20} className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              You can get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="font-medium underline">OpenAI's dashboard</a>. Keep your API key secure and never share it publicly.
            </p>
          </div>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <div className="flex">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="sk-..."
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 text-gray-600 hover:bg-gray-200"
              title="Copy API key"
            >
              {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your key should start with "sk-" and is around 40-50 characters long.
          </p>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveAPIKey}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            {saved ? <Check size={16} className="mr-2" /> : null}
            {saved ? 'Saved!' : 'Save API Key'}
          </button>
        </div>
      </div>
    </div>
  );
}
