import { Router } from 'express'
import { sendOTP, userLogin, verifyOTP, googleLogin, followUser, loginnedUser, editProfile, fetchUsers, getAllUsers, unFollowUser, isFollowing, getFollowing, getFollowers, getUser, togglePrivacy, getAllRequest, acceptRequest, rejectRequest, createPayment, userVerification, removeVerify, getAllNotification, searchAllUsers, kycPost, isKycSubmitted, getConnectionCount, getNotificationCount, forgotPassWord, verifyForgotOTP, changePassword } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
const router = Router()


// @desc    Send OTP
// @route   POST /api/users/send-otp
// @access  Public
router.post('/send-otp', sendOTP);

// @desc    User login
// @route   POST /api/users/login
// @access  Public
router.post('/login', userLogin);

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
router.post('/verify-otp', verifyOTP);

// @desc    Google login
// @route   POST /api/users/google-login
// @access  Public
router.post('/google-login', googleLogin);


// @desc    Follow user
// @route   POST /api/users/follow/:followeeId
// @access  Registered users
router.post("/follow/:followeeId", protect, followUser);

// @desc    Get logged-in user
// @route   GET /api/users/getuser
// @access  Protected
router.get('/getuser', protect, loginnedUser);


// @desc    Edit profile
// @route   PUT /api/users/edit-profile
// @access  Protected
router.put('/edit-profile', protect, editProfile);

// @desc    Fetch users
// @route   GET /api/users/fetch-users
// @access  Protected
router.get('/fetch-users', protect, fetchUsers);

router.get('/getAllUsers',getAllUsers)

// @desc    Unfollow user
// @route   PUT /api/users/unfollow/:unfolloweeId
// @access  Protected
router.put("/unfollow/:unfolloweeId", protect,unFollowUser);

// @desc    Check if user is following another user
// @route   GET /api/users/isFollowing/:userId
// @access  Protected
router.get('/isFollowing/:userId', protect, isFollowing);

// @desc    Fetch following users
// @route   GET /api/users/fetch-following
// @access  Protected
router.get('/fetch-following', protect, getFollowing);

// @desc    Fetch followers
// @route   GET /api/users/fetch-followers
// @access  Protected
router.get('/fetch-followers', protect, getFollowers);

// @desc    Get single user by ID
// @route   GET /api/users/get-single-user/:userId
// @access  Protected
router.get('/get-single-user/:userId', protect, getUser);

// @desc    Toggle user privacy settings
// @route   PATCH /api/users/toggleprivacy
// @access  Protected
router.patch('/toggleprivacy', protect, togglePrivacy);

// @desc    Get all friend requests
// @route   GET /api/users/get-request
// @access  Protected
router.get('/get-request', protect, getAllRequest);

// @desc    Accept friend request
// @route   PUT /api/users/accept-request/:requestId
// @access  Protected
router.put('/accept-request/:requestId', protect, acceptRequest);

// @desc    Reject friend request
// @route   PUT /api/users/reject-request/:requestId
// @access  Protected
router.put('/reject-request/:requestId', protect, rejectRequest);

// @desc    Create payment
// @route   POST /api/users/payment/create
// @access  Protected
router.post('/payment/create', protect, createPayment);

// @desc    Handle payment success
// @route   POST /api/users/payment/success
// @access  Protected
router.post('/payment/success', protect, userVerification);

// @desc    Remove user verification
// @route   PATCH /api/users/remove-verify
// @access  Protected
router.patch('/remove-verify', protect, removeVerify);

// @desc    Get all notifications
// @route   GET /api/users/notifications
// @access  Protected
router.get('/notifications', protect, getAllNotification);

// @desc    Search all users
// @route   GET /api/users/searchallusers
// @access  Protected
router.get('/searchallusers', protect, searchAllUsers);

// @desc    Submit KYC
// @route   POST /api/users/kyc
// @access  Protected
router.post('/kyc', protect, kycPost);

// @desc    Check if KYC is submitted
// @route   GET /api/users/isKyc
// @access  Protected
router.get('/isKyc', protect, isKycSubmitted);

// @desc    Check if KYC is submitted
// @route   GET /api/users/isKyc
// @access  Protected
router.get('/get-count/:userId', protect, getConnectionCount)

router.get('/notification-count',protect,getNotificationCount)

router.get('/forgotPassword',forgotPassWord)

router.get('/verifyOtp',verifyForgotOTP)

router.patch('/changepassword',changePassword)






export default router
// >>>>>>> 9b9590f75b470d47ac41c6301e4d608776ebab8e
