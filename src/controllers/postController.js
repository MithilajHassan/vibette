import { addPost, getAllPosts, deletePost as _deletePost, updatePost, getPostByUserId as _getPostByUserId, getAllFolloweesPost as _getAllFolloweesPost, likePost as _likePost, unLikePost as _unLikePost, reportPost as _reportPost, addComment as _addComment, replyComment as _replyComment, fetchReplies as _fetchReplies, getAllComments as _getAllComments, deleteComment as _deleteComment, searchPostsByTags, explore_Post as _explore_Post, explorePost as _explorePost, getCommentCountForPost, savePost as _savePost, fetchSavedPost as _fetchSavedPost, removeSaved, removeSavedFlutter, fetchSavedPostFlutter as _fetchSavedPostFlutter, fetchTaggedPosts, fetchLiked as _fetchLiked } from '../helpers/postHelper.js';


// @desc    post user post
// @route   POST /user/post/addpost
// @access  Private
const addUserPost =async(req,res)=>{
    try {
        const postData= req.body;
     
   addPost(postData)
      .then((response)=>{
        res.status(200).json({...response})
      })
      .catch((err)=>{
        res.status(500).send(err);
      })
    } catch (error) {
        res.status(500).send(error);
    }
}

// @desc      Get all the post
// @desc      GET /user/post/getposts
// @access    Private
const getallpost = async(req,res)=>{
    try {
        const userId= req.user.id;
        
   getAllPosts(userId)
      .then((response)=>{
        res.status(200).json(response)
      })
      .catch((err)=>{
        res.status(500).send(err);
      })
    } catch (error) {
        res.status(500).send(error);
    }
}


// @desc    Delete post
//@route    DELETE /post/delete/post/:postId
// @access  Registerd users
 const deletePost = (req, res) => {
  try {
    const { postId } = req.params;
    _deletePost(postId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Delete post
//@route    DELETE /post/delete/post/:postId
// @access  Registerd users
const editPost = (req, res) => {
  try {
    const { postId } = req.params;
    const data = req.body;

    updatePost(postId,data)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  
  } catch (error) {
    res.status(500).send(error);
  }
};



const getPostByUserId =(req,res)=>{
  try {
    console.log('haai');
    const {userId} = req.params;
    console.log(userId);
    _getPostByUserId(userId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const getAllFolloweesPost =(req,res)=>{
  try {
    const {page,pageSize} =req.query
    const userId = req.user.id
    console.log('insideee');
    _getAllFolloweesPost(userId,page,pageSize)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}


const likePost =async(req,res)=>{
  try {
    const userId = req.user.id;
    const {postId} = req.params
    _likePost(userId,postId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const unLikePost =async(req,res)=>{
  try {
    const userId = req.user.id;
    const {postId} = req.params
    _unLikePost(userId,postId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const reportPost =async(req,res)=>{
  try {
    const data = req.body
    console.log(data);
    _reportPost(data)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const addComment = async(req,res)=>{
  try {
    const data = req.body
    _addComment(data)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const replyComment = async(req,res)=>{
  try {
    const data = req.body
    const {commentId} = req.params
    _replyComment(commentId,data)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const fetchReplies = async(req,res)=>{
  try {
    const {commentId} = req.params
    _fetchReplies(commentId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const getAllComments = async(req,res)=>{
  try {
    const {postId} =  req.params
    _getAllComments(postId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const deleteComment = async(req,res)=>{
  try{
    console.log('dele');
  const { commentId } =  req.params
  _deleteComment(commentId)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}


const searchPost = async(req,res)=>{
  try {
    const {searchQuery} = req.query
    searchPostsByTags(searchQuery)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  } catch (error) {
    res.status(500).send(error)
  }
}


//flutter........
const explore_Post = async(req,res)=>{
  try{
 
  _explore_Post()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}




const explorePost = async(req,res)=>{
  try{
    const {page,pageSize} = req.query
    const userId = req.user.id
  _explorePost(page,pageSize,userId)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}

const getCommentCount = async(req,res)=>{
  try{
  
    const {postId} = req.params
   
  getCommentCountForPost(postId)
  .then((response) => {
  
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}


const savePost= async(req,res)=>{
  try{
  
    const {postId} = req.params
    const userId = req.user.id
   
  _savePost(postId,userId)
  .then((response) => {
  
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}


const fetchSavedPost= async(req,res)=>{
  try{
  
    const userId = req.user.id
   
  _fetchSavedPost(userId)
  .then((response) => {
  
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}


const removeSavedPost= async(req,res)=>{
  try{
  
    const {savedId} = req.params
    
  removeSaved(savedId)
  .then((response) => {
  
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}

//for flutter..........................
const removeSavedPostByPostId= async(req,res)=>{
  try{
  
    const {postId} = req.params
    
  removeSavedFlutter(postId)
  .then((response) => {
  
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}

const fetchSavedPostFlutter= async(req,res)=>{
  try{
  
    const userId = req.user.id
   
  _fetchSavedPostFlutter(userId)
  .then((response) => {
  
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}

//flutter end............................................

const fetchTaggedPost= async(req,res)=>{
  try{
  
    const {userId} = req.params
    
  fetchTaggedPosts(userId)
  .then((response) => {
  
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}

const fetchLiked= async(req,res)=>{
  try{
  
    const {postId} = req.params
    
  _fetchLiked(postId)
  .then((response) => {
  
    res.status(200).send(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
} catch (error) {
  res.status(500).send(error)
}
}


export {
    addUserPost,
    getallpost,
    deletePost,
    getPostByUserId,
    editPost,
    getAllFolloweesPost,
    likePost,
    unLikePost,
    reportPost,
    addComment,
    getAllComments,
    deleteComment,
    replyComment,
    fetchReplies,
    searchPost,
    explorePost,
    getCommentCount,
    savePost,
    fetchSavedPost,
    removeSavedPost,
    explore_Post,
    fetchTaggedPost,
    fetchLiked,
    removeSavedPostByPostId,
    fetchSavedPostFlutter
}