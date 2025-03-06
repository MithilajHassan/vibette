import bcrypt from 'bcryptjs';
const saltRounds = 10; //setting salt rounds
import User from '../models/userModel.js';
import sendEmail from '../services/nodeMailer.js';
import generateToken from '../services/jwt.js';
import Verify from '../models/verifyModel.js';
import verifyOtp from '../services/emailVerification.js';
import Connection from '../models/connectionModel.js';
import Razorpay from "razorpay";
import Notification from '../models/notificationModel.js';
import { setNotification } from '../utils/noficationSetter.js';
import KYC from '../models/kycModel.js';



//flutter...............
const logginedUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId)

      if (user) {
        resolve(user)
      } else {
        reject({
          status: 404,
          error_code: "DB_FETCH_ERROR",
          message: "User not found.",
        })
      }
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong please try after sometime.",
      });
    }
  });
};


// @desc    Sent verification link
// @route   GET /auth/sent-verification
// @access  Public - users
const sendVerifyEmail = (data) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ email: data.email })
        .then(async (user) => {
          if (user) {
            reject({
              status: 401,
              message: "You already have an account.",
            });
          } else {
            const verify = await Verify.findOne({ email: data.email });
            if (verify && verify.updatedAt && (Date.now() - verify.updatedAt.getTime()) < 60000) {
              reject({
                status: 401,
                message: "OTP already sent within the last one minute",
              });
            } else {
              // If everything is fine, proceed with sending the email
              const response = await sendEmail(data);
              resolve(response);
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.log(error);
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};

const getAllUsers = async (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find().limit(limit);
      resolve(users);
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again later.",
      });
    }
  })
}


// @desc    Verify email
// @route   GET /auth/verify-otpToken
// @access  Public - Registerd users
const verifyEmailOtp = (email, token) => {
  return new Promise((resolve, reject) => {
    try {
      verifyOtp(email, token)
        .then((response) => {
          User.findOne({ email: email })
            .then((user) => {
              resolve(user);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong please try after sometime.',
      });
    }
  });
};

const loginWithGoogle = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the user exists with the provided email
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        reject({
          status: 404,
          error_code: 'USER_NOT_FOUND',
          message: 'User not found with the provided email',
        });
        return;
      }

      if (existingUser.blocked) {
        reject({
          status: 401,
          error_code: 'USER_IS_BLocked',
          message: 'Your Account is Blocked'
        })
      }


      const user = {
        _id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.email,
        token: generateToken(existingUser._id, existingUser.role),
        profilePic: existingUser.profilePic,
        online: existingUser.online,
        phone: existingUser.phone,
        bio: existingUser.bio,
        name: existingUser.name,
        blocked: existingUser.blocked,
        verified: existingUser.verified,
        role: existingUser.role
      }

      // If user and password match, resolve with the user data
      resolve({
        status: 200,
        message: 'Login successful',
        user: user

      });
    } catch (error) {
      reject({
        error_code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server',
        status: 500,
      });
    }
  });
}

// @desc    Authenticate user
// @route   POST /users/login
// @access  Public
const login = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the user exists with the provided email
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        reject({
          status: 404,
          error_code: 'USER_NOT_FOUND',
          message: 'User not found with the provided email',
        });
        return;
      }

      if (existingUser.blocked) {
        reject({
          status: 401,
          error_code: 'USER_IS_BLOCKED',
          message: 'Your Account is Blocked'
        })
      }

      // Check if the provided password matches the user's hashed password
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
        reject({
          status: 401,
          error_code: 'INVALID_PASSWORD',
          message: 'Invalid password',
        });
        return;
      }

      const user = {
        _id: existingUser._id,
        email: existingUser.email,
        token: generateToken(existingUser._id, existingUser.role),
        profilePic: existingUser.profilePic,
        online: existingUser.online,
        phone: existingUser.phone,
        bio: existingUser.bio,
        name: existingUser.name,
        blocked: existingUser.blocked,
        verified: existingUser.verified,
        role: existingUser.role,
        backGroundImage: existingUser.backGroundImage,
        isPrivate: existingUser.isPrivate
      }

      // If user and password match, resolve with the user data
      resolve({
        status: 200,
        message: 'Login successful',
        user: user

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


const
  editProfileDetails = async (data, userId) => {
    return new Promise(async (resolve, reject) => {

      try {

        const user = await User.findById(userId)

        if (!user) {
          reject({
            error_code: 'DB_FETCH_ERROR',
            message: 'User not found',
            status: 401,
          });
        }

        user.name = data.name;
        user.profilePic = data.image;
        user.bio = data.bio;
        user.backGroundImage = data.backGroundImage

        console.log(data.image);
        user.save()
          .then((updatedUser) => {

            const user = {
              _id: updatedUser._id,
              userName: updatedUser.userName,
              email: updatedUser.email,
              token: generateToken(updatedUser._id),
              profilePic: updatedUser.profilePic,
              online: updatedUser.online,
              phone: updatedUser.phone,
              bio: updatedUser.bio,
              name: updatedUser.name,
              blocked: updatedUser.blocked,
              verified: updatedUser.verified,
              backGroundImage: updatedUser.backGroundImage
            }

            resolve({
              status: 200,
              message: 'user updated successfully',
              updatedUser: user,
            });
          })
          .catch((error) => {
            console.log(error);
            reject({
              error_code: 'DB_UPDATE_ERROR',
              message: 'Something went wrong while updating the post',
              status: 500,
            });
          });



      } catch (error) {
        reject({
          error_code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong on the server',
          status: 500,
        });
      }
    })
  }


import { Types } from 'mongoose';
const fetchUsersHelp = async (userId, page, limit, searchQuery = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await findOne({ userId: userId });
      let followingIds = [];
      if (connection && connection.following) {
        followingIds = connection.following;
      }

      // Convert userId to ObjectId if it's a string
      if (typeof userId === 'string') {
        userId = new Types.ObjectId(userId);
      }

      let totalCount;
      let users;
      if (searchQuery) {
        totalCount = await User.countDocuments({ _id: { $nin: [...followingIds, userId] }, role: { $ne: 'Admin' }, userName: { $regex: searchQuery, $options: 'i' } });
        users = await User.find({ _id: { $nin: [...followingIds, userId] }, role: { $ne: 'Admin' }, userName: { $regex: searchQuery, $options: 'i' } })
          .skip((page - 1) * limit)
          .limit(limit);
      } else {
        totalCount = await User.countDocuments({ _id: { $nin: [...followingIds, userId] }, role: { $ne: 'Admin' } });
        users = await User.find({ _id: { $nin: [...followingIds, userId] }, role: { $ne: 'Admin' } })
          .skip((page - 1) * limit)
          .limit(limit);
      }



      resolve({
        data: users,
        page,
        total: totalCount
      });
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

const fetchUsersBySearchQuery = async (searchQuery = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      let users;
      if (searchQuery) {
        users = await User.find({
          role: { $ne: 'Admin' },
          userName: { $regex: searchQuery, $options: 'i' }
        });
      } else {
        users = await User.find({ role: { $ne: 'Admin' } });
      }

      resolve(users);
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






// @desc    To check valid user
// @access  Private
const isValidUserId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    return !!user;
  } catch (error) {
    console.error("Error in isValidUserId:", error);
    return false;
  }
}

const addRequest = async (userId, followeeId) => {
  try {
    const user = await User.findById(followeeId);
    if (user.isPrivate) {
      const userConnection = await Connection.findOneAndUpdate(
        { userId: followeeId },
        { $addToSet: { requested: userId } },
        { upsert: true, new: true }
      );
      return false; // Indicate that request is added
    }
    return true; // No request needed for public user
  } catch (error) {
    console.error("Error in addRequest:", error);
    return false;
  }
}

const followHelper = async (userId, followeeId) => {
  try {
    // Validate user IDs
    const userIdValid = await isValidUserId(userId);
    const followeeIdValid = await isValidUserId(followeeId);

    if (!userIdValid || !followeeIdValid) {
      throw new Error("Invalid user ID");
    }

    // Check if a follow request is required
    const requestAdded = await addRequest(userId, followeeId);
    if (!requestAdded) {
      return "Follow request sent to private user";
    }

    // Update following and followers lists
    const userConnection = await Connection.findOneAndUpdate(
      { userId: userId },
      { $addToSet: { following: followeeId } },
      { upsert: true, new: true }
    );

    const followeeConnection = await Connection.findOneAndUpdate(
      { userId: followeeId },
      { $addToSet: { followers: userId } },
      { upsert: true, new: true }
    );
    const user = await User.findById(userId)
    setNotification(followeeId, userId, user.userName, 'started following you.', type = 'follow')
    return { userConnection, followeeConnection };
  } catch (error) {
    console.error("Error in followHelper:", error.message);
    throw error; // Propagate the error
  }
}



// @desc    UnFollow user
// @route   POST /user/unfollow/:unfolloweeUserId
// @access  Registerd users
const unFollowHelper = (userId, followeeId) => {
  return new Promise((resolve, reject) => {
    try {
      //Checking userIDs
      if (!isValidUserId(userId) && !isValidUserId(followeeId)) {
        reject(new Error("Invalid user ID"));
        return;
      }

      Connection.findOneAndUpdate(
        { userId: userId },
        { $pull: { following: followeeId } },
        { new: true }
      ).exec()
        .then((userConnection) => {
          Connection.findOneAndUpdate(
            { userId: followeeId },
            { $pull: { followers: userId } },
            { new: true }
          ).exec()
            .then((followeeConnection) => {

              resolve({ userConnection, followeeConnection });

            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.log(error.message);
      reject(error)
    }
  })
}


const getFollowing = (userId, page, limit) => {
  return new Promise((resolve, reject) => {
    try {
      findOne({ userId: userId })
        .populate('following')
        .then(async (userConnection) => {
          if (!userConnection) {
            throw new Error('User connection not found');
          }
          const following = userConnection.following;
          const totalCount = following.length;

          // If pagination is applied, adjust totalCount
          if (page && limit) {
            const startIndex = (page - 1) * limit;
            const endIndex = Math.min(startIndex + limit, totalCount);
            resolve({ following: following.slice(startIndex, endIndex), totalCount });
          } else {
            resolve({ following, totalCount });
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowers = (userId, page, limit) => {
  return new Promise((resolve, reject) => {
    try {
      findOne({ userId: userId })
        .populate('followers')
        .then(async (userConnection) => {
          if (!userConnection) {
            throw new Error('User connection not found');
          }
          const followers = userConnection.followers;
          const totalCount = followers.length;

          // If pagination is applied, adjust totalCount
          if (page && limit) {
            const startIndex = (page - 1) * limit;
            const endIndex = Math.min(startIndex + limit, totalCount);
            resolve({ followers: followers.slice(startIndex, endIndex), totalCount });
          } else {
            resolve({ followers, totalCount });
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};


const getUserById = (userId, ownId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Fetching user...');

      // Fetch the user by userId
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }


      const userConnection = await findOne({ userId: ownId });



      let access = !user.isPrivate;
      let following = false;

      if (userConnection && userConnection.following.includes(userId)) {
        access = true;
        following = true;
      }

      const OtherUserConnection = await findOne({ userId: userId });
      if (OtherUserConnection && OtherUserConnection.requested.includes(ownId)) {
        following = 'requested'
      }



      const userData = {
        userName: user.userName,
        name: user.name,
        _id: user._id,
        email: user.email,
        bio: user.bio,
        isPrivate: user.isPrivate,
        profilePic: user.profilePic,
        phone: user.phone,
        online: user.online,
        access: access,
        following: following
      };

      resolve(userData);
    } catch (error) {
      console.error('Error in getUserById:', error);
      reject(error);
    }
  });
};




const togglePrivacy = async (userId) => {
  try {
    // Assuming you have a User model
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Toggle the value of isPrivate
    user.isPrivate = !user.isPrivate

    // Save the updated user object
    await user.save();

    const data = {
      userName: user.userName,
      name: user.name,
      _id: user._id,
      email: user.email,
      bio: user.bio,
      isPrivate: user.isPrivate,
      profilePic: user.profilePic,
      phone: user.phone,
      online: user.online
    };

    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const getRequested = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Find the user's connections
      const userConnection = await findOne({ userId: userId }).populate('requested')

      if (!userConnection) {
        resolve([]); // No connections found, return an empty array
        return;
      }

      if (userConnection.requested) {
        resolve(userConnection.requested);
      } else {
        reject({ message: "No Requests" })
      }

    } catch (error) {
      reject({
        error_code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server',
        status: 500,
      });
    }
  });
}

const acceptRequest = async (userId, requestId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(userId, requestId);
      console.log('insisnsinsinsin');
      // Step 1: Find the user's connections
      const userConnection = await findOne({ userId: userId })

      if (!userConnection) {
        reject({ message: "User connection not found" });
        return;
      }

      // Step 2: Check if there are any requests
      if (!userConnection.requested || userConnection.requested.length === 0) {
        reject({ message: "No pending requests found" });
        return;
      }

      // Step 3: Remove requestId from requested array and add it to followers and following arrays
      const user = await Connection.findOneAndUpdate(
        { userId: userId },
        {
          $pull: { requested: requestId },
          $addToSet: { followers: requestId }
        },
        { upsert: true, new: true }
      );

      await Connection.findOneAndUpdate(
        { userId: requestId },
        { $addToSet: { following: userId } },
        { upsert: true, new: true }
      );
      console.log(user);
      resolve("Request accepted successfully");

    } catch (error) {
      console.error("Error in acceptRequest:", error);
      reject({
        error_code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server',
        status: 500,
      });
    }
  });
}


const rejectRequest = async (userId, requestId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Find the user's connections
      const userConnection = await findOne({ userId: userId });

      if (!userConnection) {
        reject({ message: "User connection not found" });
        return;
      }

      // Step 2: Check if there are any requests
      if (!userConnection.requested || userConnection.requested.length === 0) {
        reject({ message: "No pending requests found" });
        return;
      }

      // Step 3: Remove requestId from requested array
      const updatedUser = await Connection.findOneAndUpdate(
        { userId: userId },
        { $pull: { requested: requestId } },
        { new: true }
      );



      resolve("Request rejected successfully");
    } catch (error) {
      console.error("Error in rejectRequest:", error);
      reject({
        error_code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server',
        status: 500,
      });
    }
  });
}


const createPayment = () => {
  return new Promise(async (resolve, reject) => {
    try {

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      const options = {
        amount: 1200 * 100, // amount in smallest currency unit
        currency: "INR",
        receipt: "receipt_order_74394",
      };

      const order = await instance.orders.create(options);

      if (!order) {
        reject("Some error occurred while creating the order");
        return;
      }

      resolve(order);
    } catch (error) {
      console.error("Error in createPayment:", error);
      reject(error);
    }
  });
};

const successPayment = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {

      const updatedUser = await User.findByIdAndUpdate(userId, { verified: true });
      await KYC.findOneAndUpdate({ userId: userId }, { paymentStatus: true })
      await Notification.findOneAndDelete({ userId: userId, type: 'accept' })
      if (!updatedUser) {
        throw new Error("Failed to update user's verified status");
      }

      console.log('successs');
      resolve(updatedUser);
    } catch (error) {
      console.error("Error in successPayment:", error);
      reject(error);
    }
  });
};

const removeVerify = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { verified: false });
      await KYC.findOneAndDelete({ userId: userId })

      if (!updatedUser) {
        throw new Error("Failed to update user's verified status");
      }

      console.log('Verification removed successfully', updatedUser);
      resolve(updatedUser);
    } catch (error) {
      console.error("Error in removeVerify:", error);
      reject(error);
    }
  });
};

const isFollowing = async (userId, followeeId) => {
  try {
    // Find the connection for the user
    const userConnection = await findOne({ userId: userId });
    if (!userConnection) {
      return false; // User's connection not found, meaning user is not following anyone
    }

    // Check if followeeId exists in the following list of userConnection
    return userConnection.following.includes(followeeId);
  } catch (error) {
    console.error("Error in isFollowing:", error.message);
    throw error; // Propagate the error
  }
};


const getAllNotifications = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate('from')
      .populate({
        path: 'postId',
        select: '_id image', // You can select specific fields from the postId object if needed
        options: { // Conditionally populate postId only if it exists
          skipInvalidIds: true // Skip populating if postId is not a valid ObjectId
        }
      });
    await Notification.updateMany({ userId: userId }, { $set: { isRead: true } })
    return notifications;
  } catch (error) {
    console.error("Error while getting notifications:", error);
    throw error;
  }
};

const getNotificationCount = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  try {

    const notificationCount = await Notification.find({ userId: userId, isRead: false }).countDocuments()
    return notificationCount;
  } catch (error) {
    console.error("Error while getting notifications:", error);
    throw error;
  }
}



const kycPost = async (userId, data) => {
  try {

    const kycData = new KYC({
      fullName: data.fullName,
      dateOfBirth: data.DOB,
      gender: data.gender,
      idProof: data.idProof,
      userId: userId
    });


    const savedKYC = await kycData.save();


    return savedKYC;
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error saving KYC data:', error);
    throw error; // Throw the error to be handled by the caller
  }
};

const isKycSubmitted = async (userId) => {
  try {
    const kyc = await KYC.findOne({ userId: userId })
    return !!kyc
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error saving KYC data:', error);
    throw error; // Throw the error to be handled by the caller
  }
}


const getCounts = async (userId) => {
  try {
    const connection = await findOne({ userId }).exec();
    if (!connection) {
      return null
    }

    const followersCount = connection.followers.length;
    const followingCount = connection.following.length;

    return { followersCount, followingCount };
  } catch (error) {
    // Handle error
    console.error('Error while getting counts:', error);
    throw error;
  }
}

const forgotPassWord = async (email) => {
  try {
    const data = {
      email: email
    }
    const user = await User.findOne({ email: email })
    console.log(user);
    if (user) {
      const response = await sendEmail(data);
      return { status: 200, response };
    } else {
      return {
        status: 404,
        error_code: "ACCOUNT_NOT_FOUND",
        message: "You have no account.",
      };
    }


  } catch (error) {
    console.error('Error while getting counts:', error);
    throw error;
  }
}

const verifyOTP = async (email, otp) => {
  try {
    const verify = await Verify.findOne({ email: email });

    if (!verify) {
      return {
        status: 404,
        error_code: "ACCOUNT_NOT_FOUND",
        message: "You have no account.",
      };
    }



    if (verify.token === otp) {
      return { email: email, status: true };
    } else {
      return { email: email, status: false };
    }
  } catch (error) {
    console.error('Error while verifying OTP:', error);
    throw {
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong while verifying OTP.",
    };
  }
};

const changePassword = async (email, password) => {
  try {

    const user = await User.findOne({ email: email });

    if (!user) {
      throw {
        status: 404,
        error_code: "USER_NOT_FOUND",
        message: "User not found.",
      };
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();

    // Removing password field before returning user
    user.password = undefined;

    return user;
  } catch (error) {
    console.error('Error while changing password:', error);
    throw {
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong while changing password.",
    };
  }
};

export {
  sendVerifyEmail,
  login,
  verifyEmailOtp,
  editProfileDetails,
  loginWithGoogle,
  fetchUsersHelp,
  followHelper,
  unFollowHelper,
  getFollowing,
  getUserById,
  togglePrivacy,
  getFollowers,
  getRequested,
  acceptRequest,
  rejectRequest,
  createPayment,
  successPayment,
  logginedUser,
  removeVerify,
  getAllNotifications,
  isFollowing,
  fetchUsersBySearchQuery,
  kycPost,
  isKycSubmitted,
  getCounts,
  getNotificationCount,
  changePassword,
  verifyOTP,
  forgotPassWord,
  getAllUsers
}



