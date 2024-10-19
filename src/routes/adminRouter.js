const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const {protect} = require('../middleware/adminAuthMiddleware')





// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
router.post('/login', adminController.adminLogin);

// @desc    Get all users
// @route   GET /api/admin/getallusers
// @access  Protected
router.get('/getallusers', protect, adminController.getAllUsers);

// @desc    Toggle user block status
// @route   PATCH /api/admin/toggle-userblock/:userId
// @access  Protected
router.patch('/toggle-userblock/:userId', protect, adminController.userStatusToggle);

// @desc    Get all reports
// @route   GET /api/admin/get-reports
// @access  Protected
router.get('/get-reports',protect, adminController.getAllReports);

// @desc    Take action on a report
// @route   PUT /api/admin/take-action
// @access  Protected
router.put('/take-action',protect, adminController.takeAction);

// @desc    Fetch all KYC requests
// @route   GET /api/admin/fetch-kyc
// @access  Protected
router.get('/fetch-kyc',protect, adminController.fetchAllKYC);

// @desc    Reject KYC request
// @route   DELETE /api/admin/reject-kyc/:kycId/:reason
// @access  Protected
router.delete('/reject-kyc/:kycId/:reason', protect, adminController.rejectKYC);

// @desc    Accept KYC request
// @route   PATCH /api/admin/accept-kyc/:kycId
// @access  Protected
router.patch('/accept-kyc/:kycId', protect, adminController.acceptKYC);


router.get('/getcounts',protect,adminController.getCounts)

router.get('/getaverage',protect,adminController.getAverage);

router.get('/chartData',protect,adminController.getChartData);



module.exports=router

