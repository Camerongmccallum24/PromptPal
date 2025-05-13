import { useState, useEffect } from 'react';
import { ArrowRight, Copy, Info, Key, RefreshCw, Settings, Squircle, Wand } from 'lucide-react';
import { optimizePrompt } from '../api/optimize';
import { PreviewModal } from './PreviewModal';
import { APIKeySettingsModal } from './APIKeySettingsModal';
import { Tooltip } from './Tooltip';

interface AIPromptOptimizerProps {
  originalPrompt: string;
  onApplyOptimized: (optimizedPrompt: string) => void;
}

export function AIPromptOptimizer({ originalPrompt, onApplyOptimized }: AIPromptOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Check if API key exists on mount and when settings modal closes
  useEffect(() => {
    const apiKey = localStorage.getItem('openai_api_key');
    setHasApiKey(!!apiKey);
  }, [showSettingsModal]);

  const optimizePromptHandler = async () => {
    if (!originalPrompt.trim()) return;
    
    // Check if API key is configured
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      setError('API key not configured. Please add your OpenAI API key to use this feature.');
      setShowSettingsModal(true);
      return;
    }
    
    setIsOptimizing(true);
    setError(null);
    
    try {
      const enhanced = await optimizePrompt({
        prompt: originalPrompt,
        temperature: 0.3
      });
      
      if (enhanced) {
        setOptimizedPrompt(enhanced);
        setShowModal(true);
      } else {
        throw new Error('Empty response received');
      }
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      
      // More specific error messages
      if (String(error).includes('401')) {
        setError('Invalid API key. Please check your OpenAI API key in settings.');
      } else if (String(error).includes('429')) {
        setError('API rate limit exceeded. Please try again later or check your OpenAI account.');
      } else if (String(error).includes('insufficient_quota')) {
        setError('Your OpenAI account has insufficient quota. Please check your billing status.');
      } else {
        setError('Failed to optimize the prompt. Please try again or check your API key.');
      }
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleApplyOptimized = (prompt: string) => {
    onApplyOptimized(prompt);
    setShowModal(false);
  };
  
  const handleEditOptimized = (optimized: string) => {
    // You could implement an editing interface here
    // For simplicity, we'll use a prompt
    const edited = window.prompt('Edit the optimized prompt:', optimized);
    if (edited) {
      setOptimizedPrompt(edited);
    }
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
      <div className="p-3 bg-blue-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="font-medium text-blue-700">AI Prompt Optimizer</h3>
          <Tooltip content="AI-powered tool to enhance your prompts by improving clarity, structure, and specificity">
            <button className="ml-1 text-blue-600 hover:text-blue-800">
              <Info size={16} />
            </button>
          </Tooltip>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tooltip content={hasApiKey ? "API key configured" : "API key required - Click to configure"}>
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`p-1.5 hover:bg-blue-50 rounded-md ${hasApiKey ? 'text-green-500' : 'text-amber-500'}`}
            >
              {hasApiKey ? <Key size={16} /> : <Squircle size={16} />}
            </button>
          </Tooltip>
          
          <button
            onClick={optimizePromptHandler}
            disabled={isOptimizing || !originalPrompt.trim()}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isOptimizing ? (
              <>
                <RefreshCw size={16} className="mr-1.5 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Wand size={16} className="mr-1.5" />
                Optimize
              </>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200 text-red-600 text-sm">
          {error.includes('API key') ? (
            <div className="flex items-center">
              <span>{error}</span>
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="ml-2 underline text-red-700"
              >
                Configure API Key
              </button>
            </div>
          ) : (
            error
          )}
        </div>
      )}
      
      {optimizedPrompt && !showModal && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Optimized Version</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(optimizedPrompt)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => handleApplyOptimized(optimizedPrompt)}
                className="p-1 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50"
                title="Apply optimized prompt"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-md p-3 text-sm whitespace-pre-wrap">
            {optimizedPrompt}
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            This AI-optimized prompt adds structure, clarity, and specificity to improve response quality.
          </p>
        </div>
      )}
      
      {showModal && optimizedPrompt && (
        <PreviewModal
          original={originalPrompt}
          optimized={optimizedPrompt}
          onAccept={handleApplyOptimized}
          onEdit={handleEditOptimized}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {showSettingsModal && (
        <APIKeySettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}
