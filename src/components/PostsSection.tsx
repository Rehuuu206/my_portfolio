import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, X, Lock, Image, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  caption: string;
  image_url: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  visitor_name: string;
  content: string;
  created_at: string;
}

interface Like {
  id: string;
  post_id: string;
  visitor_id: string;
}

const PostsSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [likes, setLikes] = useState<Record<string, Like[]>>({});
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, { name: string; content: string }>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Generate a unique visitor ID
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  };

  // Fetch posts
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }
    setPosts(data || []);
  };

  // Fetch comments for all posts
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }
    
    const grouped: Record<string, Comment[]> = {};
    data?.forEach(comment => {
      if (!grouped[comment.post_id]) {
        grouped[comment.post_id] = [];
      }
      grouped[comment.post_id].push(comment);
    });
    setComments(grouped);
  };

  // Fetch likes for all posts
  const fetchLikes = async () => {
    const { data, error } = await supabase
      .from('post_likes')
      .select('*');
    
    if (error) {
      console.error('Error fetching likes:', error);
      return;
    }
    
    const grouped: Record<string, Like[]> = {};
    data?.forEach(like => {
      if (!grouped[like.post_id]) {
        grouped[like.post_id] = [];
      }
      grouped[like.post_id].push(like);
    });
    setLikes(grouped);
  };

  useEffect(() => {
    fetchPosts();
    fetchComments();
    fetchLikes();

    // Set up realtime subscriptions
    const postsChannel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    const commentsChannel = supabase
      .channel('comments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, () => {
        fetchComments();
      })
      .subscribe();

    const likesChannel = supabase
      .channel('likes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        fetchLikes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(likesChannel);
    };
  }, []);

  // Handle like
  const handleLike = async (postId: string) => {
    const visitorId = getVisitorId();
    const postLikes = likes[postId] || [];
    const existingLike = postLikes.find(l => l.visitor_id === visitorId);

    if (existingLike) {
      // Unlike
      await supabase.from('post_likes').delete().eq('id', existingLike.id);
    } else {
      // Like
      await supabase.from('post_likes').insert({ post_id: postId, visitor_id: visitorId });
    }
  };

  // Check if current visitor liked a post
  const hasLiked = (postId: string) => {
    const visitorId = getVisitorId();
    return (likes[postId] || []).some(l => l.visitor_id === visitorId);
  };

  // Handle comment
  const handleComment = async (postId: string) => {
    const input = commentInputs[postId];
    if (!input?.name?.trim() || !input?.content?.trim()) {
      toast({ title: 'Please enter your name and comment', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('post_comments').insert({
      post_id: postId,
      visitor_name: input.name.trim(),
      content: input.content.trim()
    });

    if (error) {
      toast({ title: 'Failed to add comment', variant: 'destructive' });
      return;
    }

    setCommentInputs(prev => ({ ...prev, [postId]: { name: input.name, content: '' } }));
    toast({ title: 'Comment added!' });
  };

  // Admin: Create post
  const handleCreatePost = async () => {
    if (!newCaption.trim()) {
      toast({ title: 'Please enter a caption', variant: 'destructive' });
      return;
    }

    setIsPosting(true);
    try {
      const response = await supabase.functions.invoke('create-post', {
        body: {
          caption: newCaption,
          image_url: newImageUrl || null,
          admin_password: adminPassword
        }
      });

      if (response.error || response.data?.error) {
        throw new Error(response.data?.error || 'Failed to create post');
      }

      toast({ title: 'Post created!' });
      setNewCaption('');
      setNewImageUrl('');
      setShowAdminModal(false);
    } catch (error: any) {
      toast({ title: error.message || 'Failed to create post', variant: 'destructive' });
    } finally {
      setIsPosting(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section id="posts" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Posts</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts, updates, and moments
          </p>
          
          {/* Admin toggle */}
          <button
            onClick={() => setShowAdminModal(true)}
            className="mt-4 p-2 glass rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Lock className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Posts grid */}
        <div className="max-w-2xl mx-auto space-y-8">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Post image */}
                {post.image_url && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Post content */}
                <div className="p-6">
                  <p className="text-foreground text-lg mb-4 whitespace-pre-wrap">{post.caption}</p>
                  <p className="text-muted-foreground text-sm mb-4">{formatDate(post.created_at)}</p>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        hasLiked(post.id) ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${hasLiked(post.id) ? 'fill-current' : ''}`} />
                      <span>{(likes[post.id] || []).length}</span>
                    </button>
                    <button
                      onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{(comments[post.id] || []).length}</span>
                    </button>
                  </div>

                  {/* Comments section */}
                  <AnimatePresence>
                    {expandedComments[post.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 border-t border-border/50 pt-4"
                      >
                        {/* Existing comments */}
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {(comments[post.id] || []).map(comment => (
                            <div key={comment.id} className="bg-background/50 rounded-lg p-3">
                              <p className="font-medium text-sm text-foreground">{comment.visitor_name}</p>
                              <p className="text-muted-foreground text-sm">{comment.content}</p>
                              <p className="text-muted-foreground text-xs mt-1">{formatDate(comment.created_at)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Add comment form */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Your name"
                            value={commentInputs[post.id]?.name || ''}
                            onChange={(e) => setCommentInputs(prev => ({
                              ...prev,
                              [post.id]: { ...prev[post.id], name: e.target.value, content: prev[post.id]?.content || '' }
                            }))}
                            className="w-full px-3 py-2 bg-background/50 rounded-lg border border-border/50 focus:outline-none focus:border-primary/50 text-sm"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={commentInputs[post.id]?.content || ''}
                              onChange={(e) => setCommentInputs(prev => ({
                                ...prev,
                                [post.id]: { ...prev[post.id], content: e.target.value, name: prev[post.id]?.name || '' }
                              }))}
                              onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                              className="flex-1 px-3 py-2 bg-background/50 rounded-lg border border-border/50 focus:outline-none focus:border-primary/50 text-sm"
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              className="p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {posts.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No posts yet. Be the first to see updates!
            </div>
          )}
        </div>
      </div>

      {/* Admin Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdminModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Create Post</h3>
                <button onClick={() => setShowAdminModal(false)} className="p-1 hover:bg-primary/10 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Admin Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 bg-background/50 rounded-lg border border-border/50 focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Caption</label>
                  <textarea
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={4}
                    className="w-full px-4 py-3 bg-background/50 rounded-lg border border-border/50 focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Image URL (optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-4 py-3 bg-background/50 rounded-lg border border-border/50 focus:outline-none focus:border-primary/50"
                    />
                    <div className="p-3 bg-background/50 rounded-lg border border-border/50">
                      <Image className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={isPosting || !newCaption.trim() || !adminPassword}
                  className="w-full py-3 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isPosting ? 'Posting...' : 'Create Post'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PostsSection;
