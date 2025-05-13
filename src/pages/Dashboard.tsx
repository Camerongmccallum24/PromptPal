import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Clock, FileText, Plus, Sparkles, Star, Tag, TrendingUp, Wand } from 'lucide-react';
import { usePrompts, Prompt } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';

interface PromptStats {
  total: number;
  favorited: number;
  tagsUsed: number;
  recentlyCreated: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const { prompts, tags } = usePrompts();
  const [stats, setStats] = useState<PromptStats>({
    total: 0,
    favorited: 0,
    tagsUsed: 0,
    recentlyCreated: 0,
  });
  const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([]);
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    if (prompts.length > 0) {
      // Calculate statistics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const newStats: PromptStats = {
        total: prompts.length,
        favorited: prompts.filter(p => p.favorite).length,
        tagsUsed: tags.length,
        recentlyCreated: prompts.filter(p => new Date(p.createdAt) > oneWeekAgo).length,
      };
      
      setStats(newStats);
      
      // Get recent prompts (last 5)
      const sortedByDate = [...prompts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentPrompts(sortedByDate.slice(0, 4));
      
      // Get favorite prompts (up to 4)
      const favorites = prompts.filter(p => p.favorite).slice(0, 4);
      setFavoritePrompts(favorites);
    }
  }, [prompts, tags]);

  const getExcerpt = (html: string, maxLength = 80) => {
    // Remove HTML tags
    const plainText = html.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-gray-600 mt-1">Manage and optimize your AI prompts</p>
        </div>
        <Link
          to="/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          New Prompt
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/prompts" className="bg-white rounded-lg border border-gray-200 p-4 flex items-center hover:bg-gray-50 transition-colors">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FileText size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Prompts</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </Link>
        
        <Link to="/favorites" className="bg-white rounded-lg border border-gray-200 p-4 flex items-center hover:bg-gray-50 transition-colors">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Star size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Favorites</p>
            <p className="text-2xl font-bold">{stats.favorited}</p>
          </div>
        </Link>
        
        <Link to="/tags" className="bg-white rounded-lg border border-gray-200 p-4 flex items-center hover:bg-gray-50 transition-colors">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Tag size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tags Used</p>
            <p className="text-2xl font-bold">{stats.tagsUsed}</p>
          </div>
        </Link>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Clock size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Created This Week</p>
            <p className="text-2xl font-bold">{stats.recentlyCreated}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <Link to="/create" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <Plus size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Create New Prompt</p>
              <p className="text-sm text-gray-500">Draft a new AI instruction</p>
            </div>
          </Link>
          
          <Link to="/prompts" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <Clipboard size={16} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium">Manage Prompts</p>
              <p className="text-sm text-gray-500">View and edit your collection</p>
            </div>
          </Link>
          
          <Link to="/tags" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="rounded-full bg-amber-100 p-2 mr-3">
              <Tag size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Organize Tags</p>
              <p className="text-sm text-gray-500">Categorize your prompts</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent and Favorite Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Prompts */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-medium text-lg flex items-center">
              <Clock size={18} className="mr-2 text-gray-400" />
              Recent Prompts
            </h2>
            <Link to="/prompts" className="text-blue-600 text-sm hover:text-blue-800">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentPrompts.length > 0 ? (
              recentPrompts.map(prompt => (
                <Link 
                  key={prompt.id} 
                  to={`/prompts/${prompt.id}/edit`}
                  className="block p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{prompt.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {getExcerpt(prompt.content)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(prompt.createdAt)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No prompts created yet</p>
                <Link to="/create" className="text-blue-600 block mt-2 hover:text-blue-800">
                  Create your first prompt
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Favorite Prompts */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-medium text-lg flex items-center">
              <Star size={18} className="mr-2 text-amber-500" />
              Favorite Prompts
            </h2>
            <Link to="/favorites" className="text-blue-600 text-sm hover:text-blue-800">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {favoritePrompts.length > 0 ? (
              favoritePrompts.map(prompt => (
                <Link 
                  key={prompt.id} 
                  to={`/prompts/${prompt.id}/edit`}
                  className="block p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{prompt.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {getExcerpt(prompt.content)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(prompt.updatedAt)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No favorite prompts yet</p>
                <Link to="/prompts" className="text-blue-600 block mt-2 hover:text-blue-800">
                  Browse your prompts
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
