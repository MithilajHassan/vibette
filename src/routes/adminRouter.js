import { Router } from 'express';
const router = Router()
import { adminLogin, getAllUsers, userStatusToggle, getAllReports, takeAction, fetchAllKYC, rejectKYC, acceptKYC, getCounts, getAverage, getChartData } from '../controllers/adminController.js';
import { protect } from '../middleware/adminAuthMiddleware.js';





// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
router.post('/login', adminLogin);

// @desc    Get all users
// @route   GET /api/admin/getallusers
// @access  Protected
router.get('/getallusers', protect, getAllUsers);

// @desc    Toggle user block status
// @route   PATCH /api/admin/toggle-userblock/:userId
// @access  Protected
router.patch('/toggle-userblock/:userId', protect, userStatusToggle);

// @desc    Get all reports
// @route   GET /api/admin/get-reports
// @access  Protected
router.get('/get-reports',protect, getAllReports);

// @desc    Take action on a report
// @route   PUT /api/admin/take-action
// @access  Protected
router.put('/take-action',protect, takeAction);

// @desc    Fetch all KYC requests
// @route   GET /api/admin/fetch-kyc
// @access  Protected
router.get('/fetch-kyc',protect, fetchAllKYC);

// @desc    Reject KYC request
// @route   DELETE /api/admin/reject-kyc/:kycId/:reason
// @access  Protected
router.delete('/reject-kyc/:kycId/:reason', protect, rejectKYC);

// @desc    Accept KYC request
// @route   PATCH /api/admin/accept-kyc/:kycId
// @access  Protected
router.patch('/accept-kyc/:kycId', protect, acceptKYC);


router.get('/getcounts',protect,getCounts)

router.get('/getaverage',protect,getAverage);

router.get('/chartData',protect,getChartData);



export default router

