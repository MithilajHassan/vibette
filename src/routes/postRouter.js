const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const authMiddleware = require('../middleware/authMiddleware')




// @desc    Add a new post
// @route   POST /api/posts/addPost
// @access  Protected
router.post('/addPost', authMiddleware.protect, postController.addUserPost);

// @desc    Get all posts
// @route   GET /api/posts/getpost
// @access  Protected
router.get('/getpost', authMiddleware.protect, postController.getallpost);

// @desc    Delete a post
// @route   DELETE /api/posts/delete-post/:postId
// @access  Protected
router.delete('/delete-post/:postId', authMiddleware.protect, postController.deletePost);

// @desc    Update a post
// @route   PUT /api/posts/update-post/:postId
// @access  Protected
router.put('/update-post/:postId', authMiddleware.protect, postController.editPost);


// @desc    Get posts by user ID
// @route   GET /api/posts/getuserpost/:userId
// @access  Public
router.get('/getuserpost/:userId', postController.getPostByUserId);

// @desc    Get posts from all followings
// @route   GET /api/posts/allfollowingsPost
// @access  Protected
router.get('/allfollowingsPost', authMiddleware.protect, postController.getAllFolloweesPost);

// @desc    Like a post
// @route   PATCH /api/posts/like-post/:postId
// @access  Protected
router.patch('/like-post/:postId', authMiddleware.protect, postController.likePost);

// @desc    Unlike a post
// @route   PATCH /api/posts/unlike-post/:postId
// @access  Protected
router.patch('/unlike-post/:postId', authMiddleware.protect, postController.unLikePost);


// @desc    Report a post
// @route   POST /api/posts/report-post/:postId
// @access  Protected
router.post('/report-post/:postId', authMiddleware.protect, postController.reportPost);

// @desc    Add a comment to a post
// @route   POST /api/posts/add-comment/:postId
// @access  Protected
router.post('/add-comment/:postId', authMiddleware.protect, postController.addComment);

// @desc    Fetch all comments for a post
// @route   GET /api/posts/fetch-comments/:postId
// @access  Protected
router.get('/fetch-comments/:postId', authMiddleware.protect, postController.getAllComments);

// @desc    Delete a comment
// @route   DELETE /api/posts/delete-comment/:commentId
// @access  Protected
router.delete('/delete-comment/:commentId', authMiddleware.protect, postController.deleteComment);


// @desc    Reply to a comment
// @route   PUT /api/posts/comments/reply-to/:commentId
// @access  Protected
router.put('/comments/reply-to/:commentId', authMiddleware.protect, postController.replyComment);

// @desc    Fetch replies to a comment
// @route   GET /api/posts/fetch-replies/:commentId
// @access  Public
router.get('/fetch-replies/:commentId',authMiddleware.protect ,postController.fetchReplies);

// @desc    Search for posts
// @route   GET /api/posts/search-post
// @access  Public
router.get('/search-post',authMiddleware.protect , postController.searchPost);

// @desc    Explore posts
// @route   GET /api/posts/explore-posts
// @access  Public
router.get('/explore-posts',authMiddleware.protect , postController.explorePost);


// @desc    Explore posts
// @route   GET /api/posts/exploreposts
// @access  Protected
router.get('/exploreposts',authMiddleware.protect , authMiddleware.protect, postController.explore_Post);

// @desc    Get comment count for a post
// @route   GET /api/posts/commentCount/:postId
// @access  Public
router.get('/commentCount/:postId',authMiddleware.protect , postController.getCommentCount);

// @desc    Save a post
// @route   POST /api/posts/savePost/:postId
// @access  Protected
router.post('/savePost/:postId', authMiddleware.protect, postController.savePost);

// @desc    Fetch saved posts
// @route   GET /api/posts/savePost
// @access  Protected
router.get('/savePost', authMiddleware.protect, postController.fetchSavedPost);

// @desc    Remove a saved post
// @route   DELETE /api/posts/savePost/:savedId
// @access  Protected
router.delete('/savePost/:savedId', authMiddleware.protect, postController.removeSavedPost);

// @flutter This is only for flutter  
// @desc    Remove a saved post
// @route   DELETE /api/posts/savePost/:savedId
// @access  Protected
router.delete('/savePosts/:postId', authMiddleware.protect, postController.removeSavedPostByPostId);
// @flutter This is only for flutter 
// @desc    Fetch saved posts
// @route   GET /api/posts/savePost
// @access  Protected
router.get('/savePosts', authMiddleware.protect, postController.fetchSavedPostFlutter);

// @desc    Fetch tagged posts for a user
// @route   GET /api/posts/fetch-tagged/:userId
// @access  Protected
router.get('/fetch-tagged/:userId', authMiddleware.protect, postController.fetchTaggedPost);

// @desc    Fetch Liked users for a post
// @route   GET /api/posts/fetch-liked/:postId
// @access  Protected
router.get('/fetch-liked/:postId', authMiddleware.protect,postController.fetchLiked);


module.exports=router