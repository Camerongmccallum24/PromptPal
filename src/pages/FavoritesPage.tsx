import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Download, Pencil, Plus, Search, Share, Star, StarOff, Tag, Trash2 } from 'lucide-react';
import { ExportMenu } from '../components/ExportMenu';
import { usePrompts, Prompt } from '../context/PromptContext';

export function FavoritesPage() {
  const { prompts, tags, toggleFavorite, deletePrompt } = usePrompts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Only show favorites
  const favoritePrompts = prompts.filter(prompt => prompt.favorite);
  
  const filteredPrompts = favoritePrompts.filter(prompt => {
    const matchesSearch = searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prompt.description && prompt.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesTag = selectedTag === null || 
      (Array.isArray(prompt.tags) && prompt.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });
  
  const copyToClipboard = async (text: string) => {
    try {
      // Remove HTML tags for plain text content
      const plainText = text.replace(/<[^>]*>/g, '');
      await navigator.clipboard.writeText(plainText);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center';
      notification.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Copied to clipboard';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Favorite Prompts</h1>
        <Link
          to="/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          New Prompt
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search favorites..."
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Tag Filter */}
          <div className="relative">
            <select
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
              className="pl-9 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            <Tag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {filteredPrompts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredPrompts.map(prompt => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onToggleFavorite={toggleFavorite}
                onDelete={deletePrompt}
                onCopy={copyToClipboard}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            {favoritePrompts.length === 0 ? (
              <>
                <p className="text-gray-500 mb-4">You have no favorite prompts yet.</p>
                <Link to="/prompts" className="text-blue-600 hover:text-blue-800">
                  Browse your prompts
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-4">No favorite prompts match your filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag(null);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
}

function PromptCard({ prompt, onToggleFavorite, onDelete, onCopy }: PromptCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const navigate = useNavigate();
  
  const getExcerpt = (html: string, maxLength = 150) => {
    // Remove HTML tags
    const plainText = html.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div 
      className="p-4 hover:bg-gray-50 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h3 className="font-medium text-lg text-gray-900">
              {prompt.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(prompt.id);
              }}
              className={`ml-2 p-1 rounded-full ${
                prompt.favorite ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <Star size={16} fill={prompt.favorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          {prompt.description && (
            <p className="text-sm text-gray-600 mb-2">{prompt.description}</p>
          )}
          
          <p className="text-sm text-gray-700 mb-3">{getExcerpt(prompt.content)}</p>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              Updated {formatDate(prompt.updatedAt)}
            </span>
            
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag size={12} className="text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map(tagId => (
                    <span key={tagId} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {tagId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 ${showActions ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(prompt.content);
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
            title="Copy prompt"
          >
            <Copy size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowExportMenu(true);
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
            title="Export prompt"
          >
            <Share size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Show loading indicator
              const loadingIndicator = document.createElement('div');
              loadingIndicator.className = 'fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50';
              loadingIndicator.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>';
              document.body.appendChild(loadingIndicator);
              
              // Navigate with slight delay to show loading
              setTimeout(() => {
                navigate(`/prompts/${prompt.id}/edit`);
                document.body.removeChild(loadingIndicator);
              }, 300);
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
            title="Edit prompt"
            aria-label="Edit prompt"
          >
            <Pencil size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this prompt?')) {
                onDelete(prompt.id);
              }
            }}
            className="p-1.5 text-gray-500 hover:text-red-600 rounded hover:bg-red-50"
            title="Delete prompt"
          >
            <Trash2 size={16} />
          </button>
          
          {showExportMenu && (
            <ExportMenu
              promptId={prompt.id}
              promptTitle={prompt.title}
              promptContent={prompt.content}
              onClose={() => setShowExportMenu(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
