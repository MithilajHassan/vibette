const { response } = require('express');
const userHelper = require('../helpers/userHelper')
const asyncHandler = require('express-async-handler')
const {setNotification} = require('../utils/noficationSetter')


//flutter...............
const loginnedUser= async(req,res)=>{
  try {
 
    const userId = req.user.id
  userHelper.logginedUser(userId)
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


  //////////////////////////////////////////

const userLogin = async(req,res)=>{
  try {
    console.log('haaai');
  
  const {email,password} = req.body
  console.log(email,password);
  userHelper.login(email,password)
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


// @desc    verify  user  using OTP
// @route   GET /user/otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    console.log('inside the sendOtp');
    console.log(req.body);

    userHelper.sendVerifyEmail(req.body)
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send(err); 
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    verify  user  using OTP
// @route   GET /user/otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const email = req.body.email
    const otp = req.body.otp
    console.log('OTP:',email,otp);
    userHelper.verifyEmailOtp(email,otp)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    
      res.status(401).send(err); 
    });
   
  } catch (error) {
    res.status(500).send(error);
  }
};


const getAllUsers = async(req,res)=>{
  try {
    const limit=5;
    const data =await userHelper.getAllUsers(limit);
    res.status(200).json({users:data});
  } catch (error) {
    res.status(500).send(error)
  }
}


const editProfile =async(req,res)=>{
  try {
    const data = req.body
    const userId = req.user.id
    userHelper.editProfileDetails(data,userId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    
      res.status(401).send(err); 
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

const googleLogin =async (req,res)=>{
  try {
  console.log('haiiii');
  const {email} = req.body
  console.log(email);
  userHelper.loginWithGoogle(email)
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

const fetchUsers = async(req,res)=>{
  try {
    const {page,limit,searchQuery} =req.query
    const userId = req.user.id
    userHelper.fetchUsersHelp(userId,page,limit,searchQuery)
    .then((response) => {
    
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    
      res.status(401).send(err); 
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

// @desc    Follow user
// @route   POST /user/:userId/follow/:followeeUserId
// @access  Registerd users
 const followUser = (req, res) => {
  try {
   
    const userId = req.user.id
    const {followeeId} = req.params;
  
    userHelper.followHelper(userId, followeeId)
    .then((response) => {
      res.status(200).send(response);
    }).catch((error) => {
      res.status(500).send(error);
    })
  } catch (error) {
    res.status(500).send(error);
  }
}

const unFollowUser = (req,res)=>{
  try {
    console.log('haai');
    const userId = req.user.id
    const {unfolloweeId} = req.params;
  userHelper.unFollowHelper(userId ,unfolloweeId)
   .then((response)=>{
    res.status(200).send(response);
   })
   .catch((error)=>{
    res.status(500).send(error)
   })

  } catch (error) {
    res.status(500).send(error);
  }
}

const getFollowing =(req,res)=>{
try {
  const userId = req.user.id
  const {page,limit} =req.query
  userHelper.getFollowing(userId,page,limit)
  .then((response)=>{
    res.status(200).send(response);
  })
  .catch((error)=>{
   res.status(500).send(error)
  })
} catch (error) {
  res.status(500).send(error);
}
}

const getFollowers =(req,res)=>{
  try {
    const userId = req.user.id
    const {page,limit} =req.query
    userHelper.getFollowers(userId,page,limit)
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error);
  }
  }


const getUser = (req,res)=>{
  try {
    const {userId} = req.params
    const ownId    = req.user.id
    userHelper.getUserById(userId,ownId)
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error); 
  }
}

const togglePrivacy = (req,res)=>{
  try {
    const userId = req.user.id
    userHelper.togglePrivacy(userId)
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error); 
  }
}


const getAllRequest =(req,res)=>{
  try {
    const userId = req.user.id
    userHelper.getRequested(userId)
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error); 
  }
}


const acceptRequest =(req,res)=>{
  try {
    const userId = req.user.id
    const {requestId} = req.params
    console.log(req.params,"params");
    userHelper.acceptRequest(userId,requestId)
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error); 
  }
}

const rejectRequest =(req,res)=>{
  try {
    const userId = req.user.id
    const { requestId } = req.params
    console.log(req.params,"params");
    userHelper.rejectRequest(userId,requestId)
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error); 
  }
}

const createPayment =(req,res)=>{
  try {
   
 
  
    userHelper.createPayment()
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error)
  }
}


const userVerification =(req,res)=>{
  try {
   
    const userId = req.user.id
  
    userHelper.successPayment(userId)
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

const removeVerify =(req,res)=>{
  try {
   
    const userId = req.user.id
  
    userHelper.removeVerify(userId)
    .then((response)=>{
      res.status(200).send(response);
    })
    .catch((error)=>{
     res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

const isFollowing =async (req,res)=>{
  try {
    
    const ownId = req.user.id;
    const {userId} = req.params
  
   const response = await userHelper.isFollowing(ownId,userId);

   res.status(200).send(response)
    
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }

}

const getAllNotification =async (req,res)=>{
  try {
    
    const userId = req.user.id;
    
  
   const response = await userHelper.getAllNotifications(userId);

   res.status(200).send(response)
    
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }

}

const searchAllUsers = async(req,res)=>{
  try {
    const userId = req.user.id;
    const {searchQuery} = req.query
    const response = await userHelper.fetchUsersBySearchQuery(searchQuery)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
 
}

const kycPost = async(req,res)=>{
  try {
    const userId = req.user.id;
    const data   =req.body
    console.log('data',data);
    const response = await userHelper.kycPost(userId,data)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
 
}

const isKycSubmitted = async(req,res)=>{
  try {
    const userId = req.user.id;
   

    const response = await userHelper.isKycSubmitted(userId)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
 
}

const getConnectionCount = async(req,res)=>{
  try {
    const { userId }= req.params
   

    const response = await userHelper.getCounts(userId)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
 
}

const getNotificationCount = async(req,res)=>{
  try {
    const  userId = req.user.id
   
   const count = await userHelper.getNotificationCount(userId)
    res.status(200).send({count:count})
  } catch (error) {
    res.status(500).send(error)
  }
 
}

const forgotPassWord = async(req,res)=>{
  try {
    const  {email} = req.query
   
   const response = await userHelper.forgotPassWord(email)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
 
}

const verifyForgotOTP = async(req,res)=>{
  try {
    const  {email,otp} = req.query
   
   const response = await userHelper.verifyOTP(email,otp)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
}

const changePassword = async(req,res)=>{
  try {
    const  {email,password} = req.body
    
   const response = await userHelper.changePassword(email,password)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
}





module.exports={
 
    sendOTP,
    userLogin,
    verifyOTP,
    editProfile,
    googleLogin,
    fetchUsers,
    followUser,
    unFollowUser,
    getFollowing,
    getUser,
    togglePrivacy,
    getFollowers,
    getAllRequest,
    acceptRequest,
    rejectRequest,
    createPayment,
    userVerification,
    loginnedUser,
    removeVerify,
    getAllNotification,
    isFollowing,
    searchAllUsers,
    kycPost,
    isKycSubmitted,
    getConnectionCount,
    getNotificationCount,
    verifyForgotOTP,
    forgotPassWord,
    changePassword,
    getAllUsers

}