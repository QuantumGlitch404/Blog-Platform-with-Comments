import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/atom-one-dark.css'; // Good dark theme for code blocks
import { uploadService } from '../../services/uploadService';
import { useToast } from '../../context/ToastContext';

const lowlight = createLowlight(common);

const MenuBar = ({ editor }) => {
  const { addToast } = useToast();

  if (!editor) {
    return null;
  }

  const addImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return addToast('Image must be less than 5MB', 'error');
      }
      
      const toastId = Date.now();
      addToast('Uploading image...', 'info', 10000); // long duration until it finishes
      
      try {
        const res = await uploadService.uploadImage(file);
        editor.chain().focus().setImage({ src: res.data.url, alt: file.name }).run();
        addToast('Image uploaded successfully', 'success');
      } catch (err) {
        addToast(err.message || 'Failed to upload image', 'error');
      }
    }
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor]);

  return (
    <div className="tiptap-toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        title="Italic"
      >
        <span className="italic">I</span>
      </button>
      <div className="w-px h-6 bg-border-subtle mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        title="Heading 3"
      >
        H3
      </button>
      <div className="w-px h-6 bg-border-subtle mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        title="Numbered List"
      >
        1. List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        title="Quote"
      >
        " Quote
      </button>
      <div className="w-px h-6 bg-border-subtle mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
        title="Code Block"
      >
        {'</>'}
      </button>
      <button
        onClick={setLink}
        className={editor.isActive('link') ? 'is-active' : ''}
        title="Link"
      >
        Link
      </button>
      <label className="cursor-pointer p-2 rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors">
        <input type="file" accept="image/*" className="hidden" onChange={addImage} />
        Image
      </label>
    </div>
  );
};

const Editor = ({ content, onChange, placeholder = 'Write your story...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disabling default code block to use lowlight
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-custom max-w-none focus:outline-none min-h-[300px] p-6',
      },
    },
  });

  return (
    <div className="tiptap-editor border border-border-focus rounded-lg bg-bg-secondary">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

// Need useCallback for Menubar link action
import { useCallback } from 'react';

export default Editor;
