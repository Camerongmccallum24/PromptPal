import { useState, useCallback } from 'react';
import { Book, Clock, Info, Search, Star, Tag } from 'lucide-react';
import { usePrompts, Tag as TagType } from '../context/PromptContext';
import { Tooltip } from './Tooltip';

interface PromptTemplateProps {
  title: string;
  content: string;
  category: string;
  onSelect: (content: string) => void;
}

function PromptTemplate({ title, content, category, onSelect }: PromptTemplateProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // First set as selected to provide visual feedback
    setIsHovered(true);
    // Add a small delay to provide visual feedback before closing the panel
    setTimeout(() => {
      onSelect(content);
    }, 100);
  };
  
  return (
    <div 
      className={`border ${isHovered ? 'border-blue-300 shadow-sm' : 'border-gray-200'} rounded-lg p-4 transition-all cursor-pointer`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{category}</span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{content}</p>
      <div className={`mt-2 text-xs flex items-center ${isHovered ? 'text-blue-700' : 'text-blue-600'}`}>
        <span className={`inline-block w-2 h-2 rounded-full ${isHovered ? 'bg-blue-600' : 'bg-blue-400'} mr-1.5`}></span>
        Click to use this template
      </div>
    </div>
  );
}

interface PromptLibraryProps {
  onSelectPrompt: (promptContent: string) => void;
}

export function PromptLibrary({ onSelectPrompt }: PromptLibraryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { tags } = usePrompts();
  
  // Sample prompt templates - in a real app, these would come from a backend
  const promptTemplates = [
    {
      id: 'template1',
      title: 'Professional Email',
      content: 'Write a professional email to [recipient] regarding [topic]. The tone should be [tone] and the email should include [specific points]. End with a clear call to action asking for [desired outcome].',
      category: 'Communication'
    },
    {
      id: 'template2',
      title: 'Product Description',
      content: 'Create a compelling product description for [product name], which is a [product type]. Highlight its key features including [feature 1], [feature 2], and [feature 3]. The target audience is [audience type] who value [key benefit]. Include a persuasive call to action.',
      category: 'Marketing'
    },
    {
      id: 'template3',
      title: 'Code Explanation',
      content: 'Explain the following code snippet in detail:\n\n```\n[code snippet]\n```\n\nBreak down what each part does, any potential issues or optimizations, and explain the underlying concepts for someone with [beginner/intermediate/advanced] programming knowledge.',
      category: 'Programming'
    },
    {
      id: 'template4',
      title: 'Creative Story',
      content: 'Write a [genre] short story about [character or situation]. The story should take place in [setting] and include themes of [theme 1] and [theme 2]. The story should have a [happy/sad/surprise] ending and be approximately [length] words.',
      category: 'Creative'
    },
    {
      id: 'template5',
      title: 'Technical Documentation',
      content: 'Create technical documentation for [feature/API/product] that explains its purpose, how to implement it, and common use cases. Include code examples where relevant and address potential troubleshooting issues. The documentation should be suitable for [beginner/intermediate/advanced] technical users.',
      category: 'Technical'
    }
  ];
  
  const categories = Array.from(new Set(promptTemplates.map(template => template.category)));
  
  const filteredTemplates = promptTemplates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Book size={18} className="mr-2" />
            Prompt Library
          </h2>
          <Tooltip content="Browse and select pre-made prompt templates to use as a starting point">
            <button className="ml-1 text-gray-400 hover:text-gray-600">
              <Info size={16} />
            </button>
          </Tooltip>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {filteredTemplates.map(template => (
            <PromptTemplate
              key={template.id}
              title={template.title}
              content={template.content}
              category={template.category}
              onSelect={onSelectPrompt}
            />
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>No matching templates found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
