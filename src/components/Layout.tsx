import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookText, House, LogOut, Plus, Star, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">PromptPal</h1>
          <p className="text-sm text-gray-500">AI Prompt Manager</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            to="/" 
            className={`flex items-center px-4 py-2 rounded-lg ${
              isActive('/') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <House size={18} className="mr-3" />
            Dashboard
          </Link>
          
          <Link 
            to="/prompts" 
            className={`flex items-center px-4 py-2 rounded-lg ${
              isActive('/prompts') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookText size={18} className="mr-3" />
            My Prompts
          </Link>
          
          <Link 
            to="/favorites" 
            className={`flex items-center px-4 py-2 rounded-lg ${
              isActive('/favorites') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Star size={18} className="mr-3" />
            Favorites
          </Link>
          
          <Link 
            to="/tags" 
            className={`flex items-center px-4 py-2 rounded-lg ${
              isActive('/tags') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Tag size={18} className="mr-3" />
            Tags
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Link 
            to="/create" 
            className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            New Prompt
          </Link>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 w-full"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
