const Post = require('../models/postModel');
const Connection = require('../models/connectionModel');
const User = require('../models/userModel')
const Report = require('../models/reportsModel')
const Comment = require('../models/commentModel');
const {setNotification} = require('../utils/noficationSetter')
const mongoose = require('mongoose'); 
const Saved = require('../models/savedPostModal')


// @desc    Add New Post
// @route   POST /posts/addpost
// @access  Private
const addPost = async ({ imageUrl, description,tags, userId,taggedUsers }) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            // Create a new post object
            const newPost = new Post({
                image: imageUrl,
                description: description,
                userId: userId,
                tags:tags,
                taggedUsers:taggedUsers,
               
            });

            

            // Save the new post to the database
            newPost.save()
                .then(async(response) => {
                    const user = await User.findById(userId)
                    if(taggedUsers){
                        taggedUsers.forEach(tagId=> {
                            setNotification(tagId,userId,user.userName,'tagged you in a post',type='tag',newPost._id)
                        });
                    }
                   
                    resolve({
                        status: 201,
                        message: 'Post created successfully',
                    });
                })
                .catch((error) => {
                    console.log(error);
                    reject({
                        error_code: 'DB_SAVE_ERROR',
                        message: 'Something went wrong while saving to the database',
                        status: 500,
                    });
                });
        } catch (error) {
            console.log(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};

// @desc    Search Posts by Tags
// @route   GET /posts/search
// @access  Private
const searchPostsByTags = async (searchQuery) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('searching...',searchQuery);
            // Use regex to search for posts with tags matching the search query
            const posts = await Post.find({ tags: { $in: [new RegExp(searchQuery, 'i')] },hidden:false,blocked:false })
  .populate('userId')
  .sort({ createdAt: -1 }); // Sort by createdAt timestamp in descending order

     
            resolve({
                status: 200,
                message: 'Posts fetched successfully',
                data: posts,
            });
        } catch (error) {
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};


const getAllPosts = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            // Fetch all posts from the database
            const posts = await Post.find({ userId: userId ,hidden:false }).populate('userId')
                          .sort({ createdAt: -1 });
            resolve(posts);

        } catch (error) {
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
                error: error.message
            });
        }
    });
};


// @desc    Delete post
//@route    DELETE /post/delete/post/:postId
// @access  Registerd users
const deletePost = (postId) => {
    return new Promise((resolve, reject) => {
        try {
            Post.updateOne({ _id: postId }, { hidden: true })
                .then((response) => {
                    resolve(response);
                    console.log(response);
                })
                .catch((err) => {
                    reject({
                        status: 500,
                        error_code: "DB_UPDATE_ERROR",
                        message: err.message,
                        err,
                    });
                });
        } catch (error) {
            reject({
                status: 500,
                error_code: "INTERNAL_SERVER_ERROR",
                message: error.message,
                error,
            });
        }
    });
};


// @desc    Update Post
// @route   PUT /posts/updatepost/:id
// @access  Private
// const updatePost = async (postId, data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // Find the post by ID
//             const post = await Post.findById(postId);

//             // Check if the post exists
//             if (!post) {
//                 return reject({
//                     error_code: 'POST_NOT_FOUND',
//                     message: 'Post not found',
//                     status: 404,
//                 });
//             }

//             // Update the post fields
//             post.image = data.imageUrl;
//             post.description = data.description;
//             post.tags = data.tags
//             post.edited=new Date()

//             // Save the updated post to the database
//             post.save()
//                 .then((updatedPost) => {
//                     resolve({
//                         status: 200,
//                         message: 'Post updated successfully',
//                         updatedPost: updatedPost,
//                     });
//                 })
//                 .catch((error) => {
//                     reject({
//                         error_code: 'DB_UPDATE_ERROR',
//                         message: 'Something went wrong while updating the post',
//                         status: 500,
//                     });
//                 });
//         } catch (error) {
//             reject({
//                 error_code: 'INTERNAL_SERVER_ERROR',
//                 message: 'Something went wrong on the server',
//                 status: 500,
//             });
//         }
//     });
// };


// updated
const updatePost = async (postId, data) => {
    try {
        // Find the post by ID
        const post = await Post.findById(postId);

        // Check if the post exists
        if (!post) {
            return Promise.reject({
                error_code: 'POST_NOT_FOUND',
                message: 'Post not found',
                status: 404,
            });
        }

        // Update the post fields
        // post.image = data.imageUrl;
        post.description = data.description;
        post.tags = data.tags;
        post.edited = new Date(); // Set the edited date to the current time

        // Save the updated post to the database
        const updatedPost = await post.save(); // Using async/await for consistency

        return Promise.resolve({
            status: 200,
            message: 'Post updated successfully',
            updatedPost: updatedPost,
        });

    } catch (error) {
        // Improved error logging for debugging
        console.error('Error updating post:', error);

        // Check if the error is related to saving in the database
        if (error.name === 'ValidationError') {
            return Promise.reject({
                error_code: 'VALIDATION_ERROR',
                message: 'Invalid data provided',
                status: 400,
            });
        }

        return Promise.reject({
            error_code: 'DB_UPDATE_ERROR',
            message: 'Something went wrong while updating the post',
            status: 500,
        });
    }
};



const getPostByUserId = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            // Find user by ID
            const user = await User.findById(userId);
            if (!user) {
                reject({
                    error_code: 'USER_NOT_FOUND',
                    message: 'User not found',
                    status: 404,
                });
                return;
            }


            // Find posts by user ID and populate user details
            const posts = await Post.find({ userId: userId ,blocked:false,hidden:false}).populate('userId') .sort({ createdAt: -1 });;
            console.log(posts);
            resolve(posts);
        } catch (error) {
            console.error(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};





const checkIfPostIsLiked = (post, userId) => {
    const { Types } = require('mongoose'); // Import Types from mongoose
    // Convert userId to ObjectId using Types.ObjectId
    const userIdObject = new Types.ObjectId(userId);
   
    // Assuming post.likes is an array of user IDs who liked the post 
    return post.likes.some(likeId => likeId.equals(userIdObject)); // Check if any likeId equals userIdObject
};

const checkIfPostisSaved = async (postId, userId) => {
    const { Types } = require('mongoose');

    const userIdObject = new Types.ObjectId(userId);

    const saved = await Saved.findOne({ userId: userIdObject, postId: postId });

    return !!saved; // Converts saved to a boolean value
}




const getAllFolloweesPost = async (userId, page = 1, pageSize = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Step 1: Find the user's connections
            const userConnection = await Connection.findOne({ userId: userId });

            if (!userConnection) {
                resolve([]); // No connections found, return an empty array
                return;
            }

            // Step 2: Retrieve posts of each followee
            const followees = userConnection.following;
            const followeesPosts = [];
            console.log(followees);
                for (const followeeId of followees) {
                const posts = await Post.find({ userId: followeeId,blocked:false,hidden:false})
                .populate('userId')
                .populate('likes')
                .populate({
                    path: 'taggedUsers',
                    select: '_id userName', // You can select specific fields from the postId object if needed
                    options: { // Conditionally populate postId only if it exists
                        skipInvalidIds: true // Skip populating if postId is not a valid ObjectId
                    }
                }).sort({ createdAt: -1 });
                
              
                for (const post of posts) {
                    const isLiked = checkIfPostIsLiked(post, userId); // Add the isLiked field based on some condition
                    const isSaved = await checkIfPostisSaved(post._id,userId)
                    const postObject = post.toObject(); // Convert Mongoose document to plain JavaScript object
                    postObject.isLiked = isLiked;
                    postObject.isSaved = isSaved;
                    
                    followeesPosts.push(postObject); 
                    
                }
            }       
            
        
            // Now followeesPosts contains all posts with the isLiked field added


            // Step 3: Sort posts by updatedAt time
            followeesPosts.sort((a, b) => b.updatedAt - a.updatedAt);

            // Step 4: Apply pagination
            const startIndex = (page - 1) * pageSize;
            const endIndex = page * pageSize;
            const paginatedPosts = followeesPosts.slice(startIndex, endIndex);

            resolve(paginatedPosts);
        } catch (error) {
            console.log(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};

const likePost = async (userId, postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const post = await Post.findById(postId);
            if (!post) {
                reject({
                    error_code: 'NOT_FOUND',
                    message: 'Post not found',
                    status: 404,
                });
                return;
            }
            // Check if the user has already liked the post
            if (post.likes.includes(userId)) {
                resolve({
                    message: 'User already liked the post',
                    status: 200,
                });
                return;
            }
            // Update the likes array
            post.likes.push(userId);
            await post.save();
            //notification
            const user = await User.findById(userId) 
            setNotification(post.userId,userId,user.userName,'liked your post',type='like',postId)
       
            resolve({
                message: 'Post liked successfully',
                status: 200,
            });
        } catch (error) {
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};


const unLikePost = async (userId, postId) => {
    return new Promise(async (resolve, reject) => {
        try {
           
            const post = await Post.findById(postId);
            if (!post) {
                reject({
                    error_code: 'NOT_FOUND',
                    message: 'Post not found',
                    status: 404,
                });
                return;
            }
            
            // Check if the user has already liked the post
            const likedIndex = post.likes.indexOf(userId);
            if (likedIndex === -1) {
                resolve({
                    message: 'User has not liked the post',
                    status: 200,
                });
                return;
            }
            
            // Remove the user's like from the likes array
            post.likes.splice(likedIndex, 1);
            await post.save();
            
            resolve({
                message: 'Post unliked successfully',
                status: 200,
            });
        } catch (error) {
            console.log(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};

const reportPost = async ({ reporterId, reporterUsername, reportType, targetId }) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(targetId);
            // Check if the post exists
            const post = await Post.findById(targetId);
            if (!post) {
                reject({
                    error_code: 'NOT_FOUND',
                    message: 'Post not found',
                    status: 404,
                });
                return;
            }

            // Count the number of reports for the given targetId
            const reportCount = await Report.countDocuments({ targetId: targetId });

            // Create a new report object
            const newReport = new Report({
                reporterId,
                reporterUsername,
                reportType,
                targetId,
            });

            // Save the report
            await newReport.save();

            // Check if the report count exceeds 4
            if (reportCount + 1 > 4) { 
                post.blocked = true;
                // Save the updated post
                 await post.save();
            
                resolve({
                    message: 'Post reported successfully and blocked due to excessive reports',
                    status: 200,
                });
            } else {
                resolve({
                    message: 'Post reported successfully',
                    status: 200,
                });
            }
        } catch (error) {
            console.log(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};




const addComment = async ({userId,userName,postId,content}) => {
    return new Promise(async (resolve, reject) => {
        try {
          
            // Check if the post exists
            const post = await Post.findById(postId);
            if (!post) {
                reject({
                    error_code: 'NOT_FOUND',
                    message: 'Post not found',
                    status: 404,
                });
                return;
            }

            // Create a new report object
            const newComment = new Comment({
                userId,
                userName,
                postId,
                content,
            });

            // Save the report
            await newComment.save();
            post.commentCount = post.commentCount + 1;
            await post.save()
            //notification
            setNotification(post.userId,userId,userName,'commented on your post',type='comment',postId)

            resolve({
                commentId:newComment._id,
                message: 'Comment added successfully',
                status: 200,
            });
        } catch (error) {
            console.log(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};

const replyComment = async ( parentId,{ userId, userName, postId, content }) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if the parent comment exists
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                reject({
                    error_code: 'NOT_FOUND',
                    message: 'Parent comment not found',
                    status: 404,
                });
                return;
            }

            // Check if the post exists
            const post = await Post.findById(postId);
            if (!post) {
                reject({
                    error_code: 'NOT_FOUND',
                    message: 'Post not found',
                    status: 404,
                });
                return;
            }

            // Create a new reply comment object
            const newReply = new Comment({
                userId,
                userName,
                postId,
                content,
                parentId,
            });

            // Save the reply comment
            await newReply.save();

            resolve({
                message: 'Reply added successfully',
                status: 200,
            });
        } catch (error) {
            console.log(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};

const fetchReplies = (parentId) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find all comments with the given parent ID
        const replies = await Comment.find({ parentId }).populate('userId')
  
        // Return the fetched replies
        resolve({
          replies,
          message: 'Replies fetched successfully',
          status: 200,
        });
      } catch (error) {
        console.error(error);
        reject({
          error_code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching replies',
          status: 500,
        });
      }
    });
  };
  
  const getAllComments = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Find all comments with the given postId and no parentId
            const comments = await Comment.find({ postId, parentId: { $exists: false } }).populate('userId');

            // Get the count of replies for each top-level comment
            const commentsWithRepliesCount = await Promise.all(comments.map(async (comment) => {
                const repliesCount = await Comment.countDocuments({ parentId: comment._id });
                return { ...comment.toObject(), repliesCount };
            }));

            // Resolve with top-level comments and their replies count
            resolve({
                comments: commentsWithRepliesCount,
                message: 'Top-level comments retrieved successfully',
                status: 200,
            });
        } catch (error) {
            console.log(error);
            // Reject with error
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};



const deleteComment = async (commentId) => {
    try {
        // Fetch the comment to get the postId and validate existence
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            throw {
                error_code: 'NOT_FOUND',
                message: 'Comment not found',
                status: 404,
            };
        }

        // Decrement the comment count of the associated post
        await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });

        // Delete the main comment
        await Comment.findByIdAndDelete(commentId);

        // Delete all replies to the comment
        await Comment.deleteMany({ parentId: commentId });

        // Return a success message
        return {
            message: 'Comment deleted successfully',
            status: 200,
        };

    } catch (error) {
        console.error(error);
        // Ensure the error object has the necessary properties
        if (!error.status) {
            error = {
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            };
        }
        throw error;
    }
};




const explore_Post = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Step 1: Find all unblocked posts
           const posts = await Post.find({userId:{$ne:userId}, blocked: false,hidden:false })
           .populate('userId')
           .populate({
            path: 'taggedUsers',
            select: '_id userName', // You can select specific fields from the postId object if needed
            options: { // Conditionally populate postId only if it exists
                skipInvalidIds: true // Skip populating if postId is not a valid ObjectId
            }
        }) 
           .sort({ createdAt: -1 });
         
               

                resolve(posts);
            
        } catch (error) {
            console.log(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};





const explorePost = (page = 1, pageSize = 10, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Step 1: Find all unblocked posts
            const posts = await Post.find({ blocked: false, hidden: false })
                .populate('userId')
                .populate({
                    path: 'taggedUsers',
                    select: '_id userName',
                    options: {
                        skipInvalidIds: true
                    }
                })
                .sort({ createdAt: -1 });

            const followeesPosts = [];

            for (const post of posts) {
                const isLiked = checkIfPostIsLiked(post, userId);
                const isSaved = await checkIfPostisSaved(post._id, userId);
                const postObject = post.toObject();
                postObject.isLiked = isLiked;
                postObject.isSaved = isSaved;
                followeesPosts.push(postObject);
            }

            // Step 2: Get total count of unblocked posts
            const totalCount = posts.length;

            // Step 3: Apply pagination
            const startIndex = (page - 1) * pageSize;
            const endIndex = page * pageSize;
            const paginatedPosts = followeesPosts.slice(startIndex, endIndex);

            resolve(paginatedPosts);

        } catch (error) {
            console.log(error);
            reject({
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            });
        }
    });
};


const getCommentCountForPost = async (postId) => {
    try {
        // Get the comment count
        const commentCount = await Comment.countDocuments({ postId });

        // Find the post by postId
        const post = await Post.findById(postId);

        // If the post doesn't exist, throw an error
        if (!post) {
            throw {
                error_code: 'NOT_FOUND',
                message: 'Post not found',
                status: 404,
            };
        }

        // Get the number of likes for the post
        const likeCount = post.likes.length;

        // Return an object containing postId, commentCount, and likeCount
        return {
            postId,
            commentCount,
            likeCount,
        };
    } catch (error) {
        // Log any errors and throw an internal server error
        console.error(error);
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
        };
    }
};


const savePost = async (postId, userId) => {
    try {
        // Create a new Saved document
        const savedPost = new Saved({
            userId,
            postId // Corrected to postId from PostId
        });

        
        const savedResult = await savedPost.save();

       
        return savedResult;
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
        };
    }
};


const fetchSavedPost = async(userId)=>{
    try {

        const savedPost = await Saved.find({userId})
                          .populate('userId')
                          .populate('postId')
                          .sort({createdAt:-1})
                          console.log(savedPost);
        return  savedPost;
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
        };
    }
}


const fetchSavedPostFlutter = async (userId) => {
    try {
        const savedPost = await Saved.find({ userId })
            .populate({
                path: 'postId',
                populate: {
                    path: 'userId',
                    model: 'user'
                }
            })
            .sort({ createdAt: -1 })
            .select('-_id'); // Exclude the _id field
 
       
        return savedPost;
    } catch (error) {
        console.log(error);
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
        };
    }
}


const removeSaved = async(savedId)=>{
    try {
        const response = await Saved.findByIdAndDelete(savedId)
        return response
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
        };
    }
}

const removeSavedFlutter = async(postId)=>{
    try {
        const response = await Saved.findOneAndDelete({postId:postId})
        return response
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
        };
    }
}

const fetchTaggedPosts = async (userId) => {
    try {
        
        const taggedPosts = await Post.find({ taggedUsers: userId })
        .populate({
            path: 'taggedUsers',
            match: { _id: { $ne: userId } } // Exclude the current user's ID
        })
        .populate('userId');

return taggedPosts;
        
      
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
        };
    }
};

const fetchLiked =async (postId)=>{
  try {
    console.log(postId);
    const post = await Post.findById(postId).populate('likes')

    return (post.likes)
  } catch (error) {
    console.log(error);
    throw {
        error_code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server',
        status: 500,
    };
  }
}





module.exports = {
    addPost,
    getAllPosts,
    deletePost,
    updatePost,
    getPostByUserId,
    getAllFolloweesPost,
    likePost,
    unLikePost,
    reportPost,
    addComment,
    getAllComments,
    deleteComment,
    replyComment,
    fetchReplies,
    searchPostsByTags,
    explorePost,
    getCommentCountForPost,
    savePost,
    fetchSavedPost,
    removeSaved,
    explore_Post,
    fetchTaggedPosts,
    fetchLiked,
    removeSavedFlutter,
    fetchSavedPostFlutter
}