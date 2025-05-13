import { useState, useRef } from 'react';
import { Check, Copy, Download, Share, X } from 'lucide-react';

interface ExportMenuProps {
  promptId: string;
  promptTitle: string;
  promptContent: string;
  onClose: () => void;
}

export function ExportMenu({ promptId, promptTitle, promptContent, onClose }: ExportMenuProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const urlInputRef = useRef<HTMLInputElement>(null);
  
  // Strip HTML tags from content for clean text
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
  const plainTextContent = stripHtml(promptContent);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainTextContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const handleShare = () => {
    // Create a shareable URL with prompt content encoded in the query params
    const baseUrl = window.location.origin;
    const encodedTitle = encodeURIComponent(promptTitle);
    const encodedContent = encodeURIComponent(plainTextContent.substring(0, 1500)); // Limit length for URL safety
    
    const url = `${baseUrl}/shared?title=${encodedTitle}&content=${encodedContent}`;
    setShareUrl(url);
    setShared(true);
    
    // Auto-select the URL for easy copying
    setTimeout(() => {
      if (urlInputRef.current) {
        urlInputRef.current.select();
      }
    }, 100);
  };
  
  const handleDownload = (format: 'txt' | 'json') => {
    let content: string;
    let mimeType: string;
    let filename: string;
    
    if (format === 'txt') {
      content = plainTextContent;
      mimeType = 'text/plain';
      filename = `${promptTitle.replace(/[^\w\s]/gi, '')}.txt`;
    } else {
      const jsonContent = {
        id: promptId,
        title: promptTitle,
        content: plainTextContent,
        exportedAt: new Date().toISOString()
      };
      content = JSON.stringify(jsonContent, null, 2);
      mimeType = 'application/json';
      filename = `${promptTitle.replace(/[^\w\s]/gi, '')}.json`;
    }
    
    // Create a downloadable blob
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Export Prompt</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Copy option */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Copy to Clipboard</h3>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  Copy Prompt Text
                </>
              )}
            </button>
          </div>
          
          {/* Share option */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Share Link</h3>
            {!shared ? (
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Share size={16} className="mr-2" />
                Generate Share Link
              </button>
            ) : (
              <div className="mt-2">
                <div className="flex">
                  <input
                    ref={urlInputRef}
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      if (urlInputRef.current) {
                        urlInputRef.current.select();
                      }
                    }}
                    className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md text-gray-600 hover:bg-gray-200 text-sm"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This link contains your prompt text. Anyone with this link can view your prompt.
                </p>
              </div>
            )}
          </div>
          
          {/* Download options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Download</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDownload('txt')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download size={16} className="mr-2" />
                Text (.txt)
              </button>
              
              <button
                onClick={() => handleDownload('json')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download size={16} className="mr-2" />
                JSON (.json)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
