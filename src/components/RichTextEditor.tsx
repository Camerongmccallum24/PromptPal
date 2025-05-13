import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, CircleHelp, Code, Heading1, Italic, List, ListOrdered, Sparkles } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onOptimize?: () => void;
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Write your prompt here...', 
  onOptimize 
}: RichTextEditorProps) {
  // Force content update when content prop changes externally
  const prevContentRef = useRef(content);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when content prop changes from external sources
  useEffect(() => {
    if (editor && content !== prevContentRef.current) {
      editor.commands.setContent(content);
      prevContentRef.current = content;
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-1 justify-between">
        <div className="flex items-center space-x-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <Code size={18} />
        </button>
        </div>
        
        {onOptimize && (
          <Tooltip content="AI-optimize your prompt to improve clarity and effectiveness">
            <button
              onClick={onOptimize}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-2"
              type="button"
            >
              <Sparkles size={16} className="mr-1.5" />
              <span className="text-sm">Optimize</span>
            </button>
          </Tooltip>
        )}
      </div>
      <EditorContent 
        editor={editor} 
        className="p-4 prose prose-blue max-w-none min-h-[200px]" 
      />
    </div>
  );
}
