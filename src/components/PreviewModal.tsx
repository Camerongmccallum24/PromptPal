import { useEffect, useRef } from 'react';
import { ArrowRight, Check, Copy, Pencil, X } from 'lucide-react';

interface PreviewModalProps {
  original: string;
  optimized: string;
  onAccept: (value: string) => void;
  onEdit: (value: string) => void;
  onClose: () => void;
}

export function PreviewModal({ 
  original, 
  optimized, 
  onAccept, 
  onEdit,
  onClose 
}: PreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Prevent body scrolling when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);
  
  const handleAccept = (text: string) => {
    setApplied(true);
    setTimeout(() => {
      onAccept(text);
    }, 300);
  };
  
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Optimized Prompt</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Original</h3>
                <button
                  onClick={() => copyToClipboard(original)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Copy to clipboard"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-700 overflow-y-auto max-h-[30vh]">
                {original}
              </div>
            </div>
            
            <div className="border border-blue-100 bg-blue-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-blue-600">Optimized</h3>
                <button
                  onClick={() => copyToClipboard(optimized)}
                  className="p-1 text-blue-400 hover:text-blue-600 rounded"
                  title="Copy to clipboard"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-700 overflow-y-auto max-h-[30vh]">
                {optimized}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(optimized)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <Pencil size={16} className="mr-2" />
            Edit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleAccept(optimized)}
            disabled={applied}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors disabled:bg-green-500"
          >
            <Check size={16} className="mr-2" />
            {applied ? 'Applied!' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
