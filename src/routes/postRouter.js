import { Router } from 'express';
const router = Router()
import { addUserPost, getallpost, deletePost, editPost, getPostByUserId, getAllFolloweesPost, likePost, unLikePost, reportPost, addComment, getAllComments, deleteComment, replyComment, fetchReplies, searchPost, explorePost, explore_Post, getCommentCount, savePost, fetchSavedPost, removeSavedPost, removeSavedPostByPostId, fetchSavedPostFlutter, fetchTaggedPost, fetchLiked } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';


// @desc    Add a new post
// @route   POST /api/posts/addPost
// @access  Protected
router.post('/addPost', protect, addUserPost);

// @desc    Get all posts
// @route   GET /api/posts/getpost
// @access  Protected
router.get('/getpost', protect, getallpost);

// @desc    Delete a post
// @route   DELETE /api/posts/delete-post/:postId
// @access  Protected
router.delete('/delete-post/:postId', protect, deletePost);

// @desc    Update a post
// @route   PUT /api/posts/update-post/:postId
// @access  Protected
router.put('/update-post/:postId', protect, editPost);


// @desc    Get posts by user ID
// @route   GET /api/posts/getuserpost/:userId
// @access  Public
router.get('/getuserpost/:userId', getPostByUserId);

// @desc    Get posts from all followings
// @route   GET /api/posts/allfollowingsPost
// @access  Protected
router.get('/allfollowingsPost', protect, getAllFolloweesPost);

// @desc    Like a post
// @route   PATCH /api/posts/like-post/:postId
// @access  Protected
router.patch('/like-post/:postId', protect, likePost);

// @desc    Unlike a post
// @route   PATCH /api/posts/unlike-post/:postId
// @access  Protected
router.patch('/unlike-post/:postId', protect, unLikePost);


// @desc    Report a post
// @route   POST /api/posts/report-post/:postId
// @access  Protected
router.post('/report-post/:postId', protect, reportPost);

// @desc    Add a comment to a post
// @route   POST /api/posts/add-comment/:postId
// @access  Protected
router.post('/add-comment/:postId', protect, addComment);

// @desc    Fetch all comments for a post
// @route   GET /api/posts/fetch-comments/:postId
// @access  Protected
router.get('/fetch-comments/:postId', protect, getAllComments);

// @desc    Delete a comment
// @route   DELETE /api/posts/delete-comment/:commentId
// @access  Protected
router.delete('/delete-comment/:commentId', protect, deleteComment);


// @desc    Reply to a comment
// @route   PUT /api/posts/comments/reply-to/:commentId
// @access  Protected
router.put('/comments/reply-to/:commentId', protect, replyComment);

// @desc    Fetch replies to a comment
// @route   GET /api/posts/fetch-replies/:commentId
// @access  Public
router.get('/fetch-replies/:commentId',protect ,fetchReplies);

// @desc    Search for posts
// @route   GET /api/posts/search-post
// @access  Public
router.get('/search-post',protect , searchPost);

// @desc    Explore posts
// @route   GET /api/posts/explore-posts
// @access  Public
router.get('/explore-posts',protect , explorePost);


// @desc    Explore posts
// @route   GET /api/posts/exploreposts
// @access  Protected
router.get('/exploreposts',protect , protect, explore_Post);

// @desc    Get comment count for a post
// @route   GET /api/posts/commentCount/:postId
// @access  Public
router.get('/commentCount/:postId',protect , getCommentCount);

// @desc    Save a post
// @route   POST /api/posts/savePost/:postId
// @access  Protected
router.post('/savePost/:postId', protect, savePost);

// @desc    Fetch saved posts
// @route   GET /api/posts/savePost
// @access  Protected
router.get('/savePost', protect, fetchSavedPost);

// @desc    Remove a saved post
// @route   DELETE /api/posts/savePost/:savedId
// @access  Protected
router.delete('/savePost/:savedId', protect, removeSavedPost);

// @flutter This is only for flutter  
// @desc    Remove a saved post
// @route   DELETE /api/posts/savePost/:savedId
// @access  Protected
router.delete('/savePosts/:postId', protect, removeSavedPostByPostId);
// @flutter This is only for flutter 
// @desc    Fetch saved posts
// @route   GET /api/posts/savePost
// @access  Protected
router.get('/savePosts', protect, fetchSavedPostFlutter);

// @desc    Fetch tagged posts for a user
// @route   GET /api/posts/fetch-tagged/:userId
// @access  Protected
router.get('/fetch-tagged/:userId', protect, fetchTaggedPost);

// @desc    Fetch Liked users for a post
// @route   GET /api/posts/fetch-liked/:postId
// @access  Protected
router.get('/fetch-liked/:postId', protect,fetchLiked);


export default router