import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { useToast } from '../context/ToastContext';
import Editor from '../components/features/Editor';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { CATEGORIES } from '../constants';
import { uploadService } from '../services/uploadService';

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setFormData({ ...formData, coverImage: res.data.url });
      addToast('Cover image uploaded', 'success');
    } catch (err) {
      addToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.excerpt || !formData.category) {
      return addToast('Please fill all required fields', 'error');
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        published: publish,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res = await postService.createPost(payload);
      addToast(publish ? 'Post published!' : 'Draft saved!', 'success');
      navigate(`/blog/${res.data.slug}`);
    } catch (err) {
      addToast(err.message || 'Failed to create post', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-10">Write a new story</h1>

        <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="An unforgettable title..."
            className="text-xl"
            required
          />

          <Input
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="A brief summary (shown in cards)"
            helperText="Max 300 characters"
            required
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-base"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Input
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="react, performance, tips"
            helperText="Comma-separated"
          />

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Cover Image</label>
            {formData.coverImage && (
              <img src={formData.coverImage} alt="Cover" className="w-full h-48 object-cover rounded-lg mb-3" />
            )}
            <label className="btn-secondary cursor-pointer inline-block">
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              {uploading ? 'Uploading...' : formData.coverImage ? 'Change Image' : 'Upload Cover'}
            </label>
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Content</label>
            <Editor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Start writing your story..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-border-subtle">
            <Button type="submit" isLoading={loading}>
              Publish
            </Button>
            <Button
              type="button"
              variant="secondary"
              isLoading={loading}
              onClick={(e) => handleSubmit(e, false)}
            >
              Save Draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
