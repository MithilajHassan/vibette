const bcrypt = require('bcryptjs')
const saltRounds = 10; //setting salt rounds
const generateJwt = require('../services/jwt')
const User = require('../models/userModel')
const Reports = require('../models/reportsModel');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const KYC  = require('../models/kycModel')
const {setNotification} = require('../utils/noficationSetter')
const Connection = require('../models/connectionModel');
const { post } = require('../routes/userRouter');
// @desc    Login admin
// @route   POST /admin/login
// @access  Public
const adminLogin = async (email, password) => {
    try {
        // Find admin by email
        const admin = await User.findOne({ email:email });
        // Check if admin exists and verify password
        const passwordMatch=await bcrypt.compare(password, admin.password)
        if (admin && passwordMatch && admin.role ==='Admin') {
            const token = await generateJwt(admin._id,admin.role);
            const data = {
                _id:admin._id,
                email:admin.email,
                name:admin.userName,
                token:token,
                role:admin.role
            }
            return {
                status: 200,
                message: "Admin login successful",
                token,
                admin:data,
                valid: true
            };
        } else {
            throw { status: 401, message: "Invalid credentials" };
        }
    } catch (error) {
        console.error("Error during admin login: ", error);
        throw { status: 500, message: error.message };
    }
};


const block_Unblock_User = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw { status: 404, message: "User not found." };
        }
        
        user.blocked = !user.blocked;
        
        const newUser=await user.save();

        return {
            status: 200,
            message: "User Status Updated Successfull",
            newStatus:newUser.blocked
        };
    } catch (error) {
        let status = error.status || 500;
        let message = error.message || "Internal Server Error.";
        throw { status, message };
    }
}

const getAllReports = (page, limit) => {
    return new Promise((resolve, reject) => {
        try {
            let totalCount;
            Reports.countDocuments({})
                .then(count => {
                    totalCount = count;
                    return Reports.find({})
                        .sort({ createdAt: -1 })
                        .populate('targetId')
                        .populate('reporterId')
                        .skip((page - 1) * limit) // Skip documents based on page number and limit
                        .limit(limit); // Limit the number of documents returned per page
                })
                .then(reports => {
                    resolve({ reports, totalCount });
                })
                .catch(err => {
                    reject({
                        error_code: 'INTERNAL_SERVER_ERROR',
                        message: 'Something went wrong on the server',
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
    });
};


const takeAction = (targetId) => {
    return new Promise((resolve, reject) => {
        console.log(targetId);
        Reports.updateMany({ targetId }, { actionTaken: true })
            .then(() => {
                return Post.findByIdAndUpdate(targetId, { blocked: true });
            })
            .then(() => {
                resolve({ success: true, message: 'Action taken successfully.' });
            })
            .catch((error) => {
                reject({
                    error_code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong on the server',
                    status: 500,
                });
            });
    });
};

const fetchAllKYC =async()=>{
    try {
     
        const kycs = await KYC.find({}).populate('userId').sort({createdAt:-1})
        return kycs
    } catch (error) {
        console.log(error);
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
        };
    }
}


const rejectKYC = async (kycId, reason, adminId) => {
    try {
        console.log('jsadfsdfadsjjjdoadfsad',kycId,reason,adminId);
        // Find the KYC record by ID
        const kyc = await KYC.findById(kycId);
        if (!kyc) {
            throw {
                error_code: 'NOT_FOUND',
                message: 'KYC record not found',
                status: 404,
            };
        }
        // Find the user associated with the KYC record
        const user = await User.findById(kyc.userId);
        if (!user) {
            throw {
                error_code: 'NOT_FOUND',
                message: 'User not found',
                status: 404,
            };
        }
        // Set notification for the user
        await setNotification(user._id, adminId, 'Admin', `Rejected your Verification due to ${reason}`,type='reject');
        // Delete the KYC record
        await KYC.findByIdAndDelete(kycId);

        return { success: true, message: 'KYC record rejected successfully' };

    } catch (error) {
        console.log(error);
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

const acceptKYC = async (kycId,adminId) => {
    try {
       
        // Find the KYC record by ID
        const kyc = await KYC.findById(kycId);
        if (!kyc) {
            throw {
                error_code: 'NOT_FOUND',
                message: 'KYC record not found',
                status: 404,
            };
        }

        kyc.actionTaken = true;
        kyc.save()
        // Find the user associated with the KYC record
        const user = await User.findById(kyc.userId);
        if (!user) {
            throw {
                error_code: 'NOT_FOUND',
                message: 'User not found',
                status: 404,
            };
        }
        // Set notification for the user
        await setNotification(user._id,adminId, 'Admin', 'Your verification has been accepted please pay the amount to complete.',type='accept');

        return { success: true, message: 'KYC record accepted successfully' };
    } catch (error) {
        console.log(error);
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

const getCounts = async()=>{
    try {
    const userCount = await User.find({}).countDocuments();
    const postCount = await Post.find({}).countDocuments();
    const connectionCount = await Connection.find({}).countDocuments();
    
    const data ={
        userCount:userCount,
        postCount:postCount,
        connectionCount:connectionCount
    }
    
    return data



    } catch (error) {
        console.log(error);
        if (!error.status) {
            error = {
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            };
        }
        throw error;
    }
    
}


const getAverage =async()=>{
    try {
    
    const postCount = await Post.find({}).countDocuments();
    const commentCount=await Comment.find({}).countDocuments();
    const userCount   = await User.find({}).countDocuments();
    const verifiedCount= await User.find({verified:true}).countDocuments();
    
    // Calculate averages
    const averageCommentsByPost = commentCount / postCount;
    const averageConnectionsByUser = userCount > 0 ? userCount / commentCount : 0;
    const averagePostsByUser = userCount > 0 ? postCount / userCount : 0;
    const averageVerifiedUsersByUsers = verifiedCount / userCount;

    // Return the averages
    return {
        averageCommentsByPost,
        averageConnectionsByUser,
        averagePostsByUser,
        averageVerifiedUsersByUsers
    };
        
    } catch (error) {
        console.log(error);
        if (!error.status) {
            error = {
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            };
        }
        throw error;
    }
}

const getChartData = async (year) => {
    try {
        const matchCondition = year ? { $expr: { $eq: [{ $year: "$createdAt" }, parseInt(year)] } } : {};

        const userCounts = await User.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    count: 1
                }
            }
        ]);

        const usersMonthlyCounts = userCounts.map(({ month, count }) => ({ label: month, count }));

        const reportCounts = await Reports.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    count: 1
                }
            }
        ]);

        const ReportsMonthlyCounts = reportCounts.map(({ month, count }) => ({ label: month, count }));

        const postCounts = await Post.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    count: 1
                }
            }
        ]);

        const PostMonthlyCounts = postCounts.map(({ month, count }) => ({ label: month, count }));

        // Function to convert numeric month to string month
function getMonthString(monthNumeric) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthNumeric - 1];
}

// Iterate through the arrays and update the labels
usersMonthlyCounts.forEach(item => {
    const [year, month] = item.label.split('-');
    item.label = `${getMonthString(parseInt(month))}`;
});

PostMonthlyCounts.forEach(item => {
    const [year, month] = item.label.split('-');
    item.label = `${getMonthString(parseInt(month))}`;
});

ReportsMonthlyCounts.forEach(item => {
    const [year, month] = item.label.split('-');
    item.label = `${getMonthString(parseInt(month))}`;
});


        return {
            usersMonthlyCounts,
            PostMonthlyCounts,
            ReportsMonthlyCounts
        };

    } catch (error) {
        console.log(error);
        if (!error.status) {
            error = {
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong on the server',
                status: 500,
            };
        }
        throw error;
    }
}

  
  module.exports = {
    adminLogin,
    block_Unblock_User,
    getAllReports,
    takeAction,
    fetchAllKYC,
    rejectKYC,
    acceptKYC,
    getCounts,
    getAverage,
    getChartData
  };
  