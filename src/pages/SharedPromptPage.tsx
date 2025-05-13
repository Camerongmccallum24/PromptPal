import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Copy, Download } from 'lucide-react';

export function SharedPromptPage() {
  const location = useLocation();
  const [promptTitle, setPromptTitle] = useState<string>('Shared Prompt');
  const [promptContent, setPromptContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse query parameters to get prompt data
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');
    const content = queryParams.get('content');
    
    if (title) {
      setPromptTitle(title);
      document.title = `PromptPal - ${title}`;
    }
    
    if (content) {
      setPromptContent(content);
      setIsLoading(false);
    } else {
      setError('No prompt content found in the shared link.');
      setIsLoading(false);
    }
  }, [location]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    // Create a downloadable text file
    const blob = new Blob([promptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${promptTitle.replace(/[^\w\s]/gi, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="mr-3 text-gray-500 hover:text-gray-700">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {promptTitle}
              </h1>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-1.5 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1.5" />
                    Copy
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              >
                <Download size={16} className="mr-1.5" />
                Download
              </button>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Link to="/" className="mt-4 text-blue-600 hover:text-blue-800 inline-block">
                  Return to Home
                </Link>
              </div>
            ) : (
              <div className="prose max-w-none">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 whitespace-pre-wrap">
                  {promptContent}
                </div>
              </div>
            )}
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Shared via PromptPal • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
