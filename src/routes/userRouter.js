const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const cors = require('cors')
const { protect } = require('../middleware/authMiddleware')



// @desc    Send OTP
// @route   POST /api/users/send-otp
// @access  Public
router.post('/send-otp', userController.sendOTP);

// @desc    User login
// @route   POST /api/users/login
// @access  Public
router.post('/login', userController.userLogin);

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
router.post('/verify-otp', userController.verifyOTP);

// @desc    Google login
// @route   POST /api/users/google-login
// @access  Public
router.post('/google-login', userController.googleLogin);


// @desc    Follow user
// @route   POST /api/users/follow/:followeeId
// @access  Registered users
router.post("/follow/:followeeId", protect, userController.followUser);

// @desc    Get logged-in user
// @route   GET /api/users/getuser
// @access  Protected
router.get('/getuser', protect, userController.loginnedUser);


// @desc    Edit profile
// @route   PUT /api/users/edit-profile
// @access  Protected
router.put('/edit-profile', protect, userController.editProfile);

// @desc    Fetch users
// @route   GET /api/users/fetch-users
// @access  Protected
router.get('/fetch-users', protect, userController.fetchUsers);

router.get('/getAllUsers',userController.getAllUsers)

// @desc    Unfollow user
// @route   PUT /api/users/unfollow/:unfolloweeId
// @access  Protected
router.put("/unfollow/:unfolloweeId", protect,userController.unFollowUser);

// @desc    Check if user is following another user
// @route   GET /api/users/isFollowing/:userId
// @access  Protected
router.get('/isFollowing/:userId', protect, userController.isFollowing);

// @desc    Fetch following users
// @route   GET /api/users/fetch-following
// @access  Protected
router.get('/fetch-following', protect, userController.getFollowing);

// @desc    Fetch followers
// @route   GET /api/users/fetch-followers
// @access  Protected
router.get('/fetch-followers', protect, userController.getFollowers);

// @desc    Get single user by ID
// @route   GET /api/users/get-single-user/:userId
// @access  Protected
router.get('/get-single-user/:userId', protect, userController.getUser);

// @desc    Toggle user privacy settings
// @route   PATCH /api/users/toggleprivacy
// @access  Protected
router.patch('/toggleprivacy', protect, userController.togglePrivacy);

// @desc    Get all friend requests
// @route   GET /api/users/get-request
// @access  Protected
router.get('/get-request', protect, userController.getAllRequest);

// @desc    Accept friend request
// @route   PUT /api/users/accept-request/:requestId
// @access  Protected
router.put('/accept-request/:requestId', protect, userController.acceptRequest);

// @desc    Reject friend request
// @route   PUT /api/users/reject-request/:requestId
// @access  Protected
router.put('/reject-request/:requestId', protect, userController.rejectRequest);

// @desc    Create payment
// @route   POST /api/users/payment/create
// @access  Protected
router.post('/payment/create', protect, userController.createPayment);

// @desc    Handle payment success
// @route   POST /api/users/payment/success
// @access  Protected
router.post('/payment/success', protect, userController.userVerification);

// @desc    Remove user verification
// @route   PATCH /api/users/remove-verify
// @access  Protected
router.patch('/remove-verify', protect, userController.removeVerify);

// @desc    Get all notifications
// @route   GET /api/users/notifications
// @access  Protected
router.get('/notifications', protect, userController.getAllNotification);

// @desc    Search all users
// @route   GET /api/users/searchallusers
// @access  Protected
router.get('/searchallusers', protect, userController.searchAllUsers);

// @desc    Submit KYC
// @route   POST /api/users/kyc
// @access  Protected
router.post('/kyc', protect, userController.kycPost);

// @desc    Check if KYC is submitted
// @route   GET /api/users/isKyc
// @access  Protected
router.get('/isKyc', protect, userController.isKycSubmitted);

// @desc    Check if KYC is submitted
// @route   GET /api/users/isKyc
// @access  Protected
router.get('/get-count/:userId', protect, userController.getConnectionCount)

router.get('/notification-count',protect,userController.getNotificationCount)

router.get('/forgotPassword',userController.forgotPassWord)

router.get('/verifyOtp',userController.verifyForgotOTP)

router.patch('/changepassword',userController.changePassword)






module.exports=router
// >>>>>>> 9b9590f75b470d47ac41c6301e4d608776ebab8e
