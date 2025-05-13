import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function MobileSheet({ isOpen, onClose, title, children }: MobileSheetProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when sheet is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      <div className="mobile-bottom-sheet md:hidden p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="pb-4">
          {children}
        </div>
      </div>
    </>
  );
}
