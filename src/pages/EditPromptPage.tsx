import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Info, Lightbulb, Plus, Save, Wand, X } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import { RichTextEditor } from '../components/RichTextEditor';
import { usePrompts } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';
import { AIPromptOptimizer } from '../components/AIPromptOptimizer';

interface FormValues {
  title: string;
  description: string;
  content: string;
  variables: {
    name: string;
    description: string;
  }[];
  tags: string[];
}

export function EditPromptPage() {
  const { promptId } = useParams<{ promptId: string }>();
  const { prompts, updatePrompt, tags: existingTags } = usePrompts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const { 
    register, 
    control, 
    handleSubmit, 
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty } 
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      variables: [],
      tags: []
    }
  });
  
  const promptContent = watch('content');
  
  // Load prompt data when component mounts
  useEffect(() => {
    if (promptId) {
      const targetPrompt = prompts.find(p => p.id === promptId);
      
      if (targetPrompt) {
        reset({
          title: targetPrompt.title,
          description: targetPrompt.description || '',
          content: targetPrompt.content,
          variables: targetPrompt.variables || [],
          tags: []
        });
        
        setSelectedTags(targetPrompt.tags || []);
        setIsLoading(false);
      } else {
        setNotFound(true);
        setIsLoading(false);
      }
    }
  }, [promptId, prompts, reset]);
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variables',
  });
  
  const onSubmit = handleSubmit((data) => {
    if (!user || !promptId) return;
    
    // Update the prompt
    updatePrompt(promptId, {
      title: data.title,
      description: data.description,
      content: data.content,
      variables: data.variables,
      tags: selectedTags,
      updatedAt: new Date().toISOString()
    });
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center animate-fadeIn';
    notification.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Prompt updated successfully';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
      navigate('/prompts');
    }, 1500);
  });
  
  const handleAddVariable = () => {
    append({ name: '', description: '' });
  };
  
  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !existingTags.some(tag => tag.name.toLowerCase() === newTag.toLowerCase())) {
      // In a real app, we would add the tag to the database
      // For now, we'll just add it to the selected tags
      setSelectedTags([...selectedTags, newTag]);
      setNewTag('');
    }
  };
  
  const handleApplyOptimizedPrompt = (optimizedPrompt: string) => {
    setValue('content', optimizedPrompt, { shouldValidate: true });
    setShowOptimizer(false);
    
    // Update the prompt to mark it as optimized
    if (promptId) {
      updatePrompt(promptId, {
        content: optimizedPrompt,
        updatedAt: new Date().toISOString()
      });
    }
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center animate-fadeIn';
    notification.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Optimized prompt applied';
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2000);
  };
  
  const handleOptimizeClick = () => {
    // Scroll to the editor if needed to make the optimizer visible
    if (editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setShowOptimizer(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Prompt Not Found</h2>
        <p className="text-gray-600 mb-6">The prompt you're looking for doesn't exist or may have been deleted.</p>
        <button
          onClick={() => navigate('/prompts')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to My Prompts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/prompts')}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Edit Prompt</h1>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Prompt Title *
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a descriptive title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what this prompt does and when to use it"
          />
        </div>
        
        {/* Prompt Content */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Prompt Content *
            </label>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 italic mr-2">AI-powered optimization available</span>
              <Wand size={16} className="text-blue-500" />
            </div>
          </div>
          
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Prompt content is required' }}
            render={({ field }) => (
              <div ref={editorRef}>
                <RichTextEditor 
                  content={field.value} 
                  onChange={field.onChange}
                  placeholder="Write your prompt here..."
                  onOptimize={handleOptimizeClick}
                />
              </div>
            )}
          />
          
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
          
          {promptContent && showOptimizer && 
            <div className="mt-4 lg:w-3/4 mx-auto transform transition-all duration-300 ease-in-out">
              <AIPromptOptimizer originalPrompt={promptContent} onApplyOptimized={handleApplyOptimizedPrompt} />
            </div>
          }
          
          <div className="mt-2 flex items-start">
            <Lightbulb size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Pro tip: For better AI responses, include specific details, define the desired tone, format, and length. Use variables in square brackets [like_this] that you can define below.
            </p>
          </div>
        </div>
        
        {/* Variables */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Variables
            </label>
            <button
              type="button"
              onClick={handleAddVariable}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <Plus size={16} className="mr-1" />
              Add Variable
            </button>
          </div>
          
          {fields.length === 0 && (
            <p className="text-sm text-gray-500 mb-2">
              No variables yet. Add variables to make your prompt more flexible.
            </p>
          )}
          
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Variable Name
                  </label>
                  <input
                    {...register(`variables.${index}.name` as const, { required: "Name is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., topic, tone, length"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    {...register(`variables.${index}.description` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What this variable is for"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-6 p-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {existingTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagSelect(tag.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a new tag"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            <Save size={18} className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
