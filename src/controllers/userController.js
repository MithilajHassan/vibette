import { response } from 'express';
import { logginedUser, login, sendVerifyEmail, verifyEmailOtp, getAllUsers as _getAllUsers, editProfileDetails, loginWithGoogle, fetchUsersHelp, followHelper, unFollowHelper, getFollowing as _getFollowing, getFollowers as _getFollowers, getUserById, togglePrivacy as _togglePrivacy, getRequested, acceptRequest as _acceptRequest, rejectRequest as _rejectRequest, createPayment as _createPayment, successPayment, removeVerify as _removeVerify, isFollowing as _isFollowing, getAllNotifications, fetchUsersBySearchQuery, kycPost as _kycPost, isKycSubmitted as _isKycSubmitted, getCounts, getNotificationCount as _getNotificationCount, forgotPassWord as _forgotPassWord, verifyOTP as _verifyOTP, changePassword as _changePassword } from '../helpers/userHelper.js';
import { setNotification } from '../utils/noficationSetter.js';


//flutter...............
const loginnedUser = async (req, res) => {
  try {

    const userId = req.user.id
    logginedUser(userId)
      .then((response) => {
        res.status(200).json(response)
      })
      .catch((err) => {
        res.status(500).send(err);
      })
  } catch (error) {

    res.status(500).send(error);
  }

}


//////////////////////////////////////////

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(email, password);
    login(email, password)
      .then((response) => {
        res.status(200).json({ ...response })
      })
      .catch((err) => {
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

    sendVerifyEmail(req.body)
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
    console.log('OTP:', email, otp);
    verifyEmailOtp(email, otp)
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


const getAllUsers = async (req, res) => {
  try {
    const limit = 10;
    const data = await _getAllUsers(limit);
    res.status(200).json({ users: data });
  } catch (error) {
    res.status(500).send(error)
  }
}


const editProfile = async (req, res) => {
  try {
    const data = req.body
    const userId = req.user.id
    editProfileDetails(data, userId)
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

const googleLogin = async (req, res) => {
  try {
    const { email } = req.body
    loginWithGoogle(email)
      .then((response) => {
        res.status(200).json({ ...response })
      })
      .catch((err) => {
        res.status(500).send(err);
      })
  } catch (error) {
    res.status(500).send(error);
  }
}

const fetchUsers = async (req, res) => {
  try {
    const { page, limit, searchQuery } = req.query
    const userId = req.user.id
    fetchUsersHelp(userId, page, limit, searchQuery)
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
    const { followeeId } = req.params;

    followHelper(userId, followeeId)
      .then((response) => {
        res.status(200).send(response);
      }).catch((error) => {
        res.status(500).send(error);
      })
  } catch (error) {
    res.status(500).send(error);
  }
}

const unFollowUser = (req, res) => {
  try {
    console.log('haai');
    const userId = req.user.id
    const { unfolloweeId } = req.params;
    unFollowHelper(userId, unfolloweeId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })

  } catch (error) {
    res.status(500).send(error);
  }
}

const getFollowing = (req, res) => {
  try {
    const userId = req.user.id
    const { page, limit } = req.query
    _getFollowing(userId, page, limit)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error);
  }
}

const getFollowers = (req, res) => {
  try {
    const userId = req.user.id
    const { page, limit } = req.query
    _getFollowers(userId, page, limit)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error);
  }
}


const getUser = (req, res) => {
  try {
    const { userId } = req.params
    const ownId = req.user.id
    getUserById(userId, ownId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error);
  }
}

const togglePrivacy = (req, res) => {
  try {
    const userId = req.user.id
    _togglePrivacy(userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error);
  }
}


const getAllRequest = (req, res) => {
  try {
    const userId = req.user.id
    getRequested(userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error);
  }
}


const acceptRequest = (req, res) => {
  try {
    const userId = req.user.id
    const { requestId } = req.params
    console.log(req.params, "params");
    _acceptRequest(userId, requestId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error);
  }
}

const rejectRequest = (req, res) => {
  try {
    const userId = req.user.id
    const { requestId } = req.params
    console.log(req.params, "params");
    _rejectRequest(userId, requestId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error);
  }
}

const createPayment = (req, res) => {
  try {



    _createPayment()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error)
  }
}


const userVerification = (req, res) => {
  try {

    const userId = req.user.id

    successPayment(userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error)
  }
}

const removeVerify = (req, res) => {
  try {

    const userId = req.user.id

    _removeVerify(userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error)
  }
}

const isFollowing = async (req, res) => {
  try {

    const ownId = req.user.id;
    const { userId } = req.params

    const response = await _isFollowing(ownId, userId);

    res.status(200).send(response)

  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }

}

const getAllNotification = async (req, res) => {
  try {

    const userId = req.user.id;


    const response = await getAllNotifications(userId);

    res.status(200).send(response)

  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }

}

const searchAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchQuery } = req.query
    const response = await fetchUsersBySearchQuery(searchQuery)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }

}

const kycPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body
    console.log('data', data);
    const response = await _kycPost(userId, data)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }

}

const isKycSubmitted = async (req, res) => {
  try {
    const userId = req.user.id;


    const response = await _isKycSubmitted(userId)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }

}

const getConnectionCount = async (req, res) => {
  try {
    const { userId } = req.params


    const response = await getCounts(userId)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }

}

const getNotificationCount = async (req, res) => {
  try {
    const userId = req.user.id

    const count = await _getNotificationCount(userId)
    res.status(200).send({ count: count })
  } catch (error) {
    res.status(500).send(error)
  }

}

const forgotPassWord = async (req, res) => {
  try {
    const { email } = req.query

    const response = await _forgotPassWord(email)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }

}

const verifyForgotOTP = async (req, res) => {
  try {
    const { email, otp } = req.query

    const response = await _verifyOTP(email, otp)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
}

const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body

    const response = await _changePassword(email, password)
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
}





export {

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