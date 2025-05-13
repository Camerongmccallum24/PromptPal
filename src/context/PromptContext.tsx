import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PromptVariable {
  name: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  variables: PromptVariable[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  userId: string;
}

interface PromptContextType {
  prompts: Prompt[];
  tags: Tag[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrompt: (id: string, promptData: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addTag: (name: string) => void;
  getPromptById: (id: string) => Prompt | undefined;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Load prompts and tags from localStorage when auth state changes
  useEffect(() => {
    if (user) {
      const storedPrompts = localStorage.getItem(`promptme_prompts_${user.id}`);
      const storedTags = localStorage.getItem(`promptme_tags_${user.id}`);
      
      if (storedPrompts) {
        setPrompts(JSON.parse(storedPrompts));
      } else {
        setPrompts([]);
      }
      
      if (storedTags) {
        setTags(JSON.parse(storedTags));
      } else {
        setTags([]);
      }
    } else {
      setPrompts([]);
      setTags([]);
    }
  }, [user]);

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    if (user && prompts.length > 0) {
      localStorage.setItem(`promptme_prompts_${user.id}`, JSON.stringify(prompts));
    }
  }, [prompts, user]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    if (user && tags.length > 0) {
      localStorage.setItem(`promptme_tags_${user.id}`, JSON.stringify(tags));
    }
  }, [tags, user]);

  const addPrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    const newPrompt: Prompt = {
      ...promptData,
      id: `prompt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setPrompts(prev => [...prev, newPrompt]);
  };

  const updatePrompt = (id: string, promptData: Partial<Prompt>) => {
    setPrompts(prev => 
      prev.map(prompt => 
        prompt.id === id 
          ? { 
              ...prompt, 
              ...promptData, 
              updatedAt: new Date().toISOString() 
            } 
          : prompt
      )
    );
    
    // Show status update notification when prompt is optimized
    if (promptData.content && id) {
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center';
      notification.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Prompt updated successfully';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }
  };

  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(prompt => prompt.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setPrompts(prev => 
      prev.map(prompt => 
        prompt.id === id 
          ? { ...prompt, favorite: !prompt.favorite } 
          : prompt
      )
    );
  };

  const addTag = (name: string) => {
    if (!user || tags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) return;
    
    const newTag: Tag = {
      id: `tag_${Date.now()}`,
      name
    };
    
    setTags(prev => [...prev, newTag]);
  };

  const getPromptById = (id: string) => {
    return prompts.find(prompt => prompt.id === id);
  };

  return (
    <PromptContext.Provider 
      value={{ 
        prompts, 
        tags, 
        addPrompt, 
        updatePrompt, 
        deletePrompt, 
        toggleFavorite, 
        addTag,
        getPromptById 
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
}
