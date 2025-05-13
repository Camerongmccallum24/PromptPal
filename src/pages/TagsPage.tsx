import { useState } from 'react';
import { Tag as TagIcon, Squircle, Plus, Trash2, X } from 'lucide-react';
import { usePrompts, Tag } from '../context/PromptContext';

export function TagsPage() {
  const { tags, prompts, addTag } = usePrompts();
  const [newTagName, setNewTagName] = useState('');
  const [editTagId, setEditTagId] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState('');
  
  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
    }
  };
  
  const startEditTag = (tag: Tag) => {
    setEditTagId(tag.id);
    setEditTagName(tag.name);
  };
  
  const cancelEditTag = () => {
    setEditTagId(null);
    setEditTagName('');
  };
  
  const getTagPromptCount = (tagId: string) => {
    return prompts.filter(prompt => 
      Array.isArray(prompt.tags) && prompt.tags.includes(tagId)
    ).length;
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tags</h1>
        <p className="text-gray-600">Organize your prompts with custom tags</p>
      </div>
      
      {/* Add new tag */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h2 className="text-lg font-medium mb-3">Create New Tag</h2>
        <div className="flex">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter tag name"
          />
          <button
            onClick={handleAddTag}
            disabled={!newTagName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Tag
          </button>
        </div>
      </div>
      
      {/* Tags list */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium">Your Tags</h2>
        </div>
        
        {tags.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {tags.map(tag => (
              <li key={tag.id} className="p-4 flex items-center justify-between">
                {editTagId === tag.id ? (
                  <div className="flex-1 flex items-center">
                    <TagIcon size={16} className="text-blue-500 mr-2" />
                    <input
                      type="text"
                      value={editTagName}
                      onChange={(e) => setEditTagName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    <div className="ml-2 space-x-1">
                      <button 
                        onClick={() => {
                          // In a real app, this would update the tag in the database
                          cancelEditTag();
                        }}
                        className="px-2 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEditTag}
                        className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <TagIcon size={16} className="text-blue-500 mr-2" />
                    <span className="font-medium">{tag.name}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {getTagPromptCount(tag.id)} {getTagPromptCount(tag.id) === 1 ? 'prompt' : 'prompts'}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => startEditTag(tag)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
                    title="Edit tag"
                  >
                    <Squircle size={16} />
                  </button>
                  
                  <button
                    onClick={() => {
                      // In a real app, this would delete the tag from the database
                      // For now, we'll just show an alert
                      alert(`In a real app, this would delete the "${tag.name}" tag.`);
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-600 rounded hover:bg-red-50"
                    title="Delete tag"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-2">You haven't created any tags yet.</p>
            <p className="text-gray-500">Tags help you organize your prompts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
