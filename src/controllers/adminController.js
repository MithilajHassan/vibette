import { adminLogin as _adminLogin, block_Unblock_User, getAllReports as _getAllReports, takeAction as _takeAction, fetchAllKYC as _fetchAllKYC, rejectKYC as _rejectKYC, acceptKYC as _acceptKYC, getCounts as _getCounts, getAverage as _getAverage, getChartData as _getChartData } from '../helpers/adminHelper.js';
import User from '../models/userModel.js';



const adminLogin = async(req,res)=>{
    try {
      console.log('haaai');
    
    const {email,password} = req.body
    console.log(email,password);
      _adminLogin(email,password)
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



const getAllUsers = async (req, res) => {
    try {
      console.log('jsjsj');
        const { limit, page } = req.query;
        console.log(limit,page);
        const users = await User.find({role:'User'})
                                .limit(parseInt(limit))
                                .skip(parseInt(limit) * (parseInt(page) - 1));
        const totalCount = await User.countDocuments({ role: 'User' });
        if (users) {
            res.status(200).json({users,totalCount});
        } else {
            res.status(500).json({ message: 'DB_FETCH ERROR' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}



const userStatusToggle = async(req,res)=>{
  try {
     const userId = req.params.userId;
   block_Unblock_User(userId)
   .then((response)=>{
    res.status(200).json(response)
  })
  .catch((err)=>{
    res.status(500).send(err);
  })
  } catch (error) {
    res.status(500).send(error)
  }
}

const getAllReports =async(req,res)=>{
  try {
    const {page,limit} = req.query
    _getAllReports(page,limit)
    .then((response)=>{
     res.status(200).json(response)
   })
   .catch((err)=>{
     res.status(500).send(err);
   })
  } catch (error) {
    res.status(500).send(error)
  }
}

const takeAction = async(req,res)=>{
  try {
    const {targetId} = req.query
    _takeAction(targetId)
    .then((response)=>{
     res.status(200).json(response)
   })
   .catch((err)=>{
     res.status(500).send(err);
   })
  } catch (error) {
    res.status(500).send(error)
  }
}

const fetchAllKYC = async(req,res)=>{
  try {
    
    _fetchAllKYC()
    .then((response)=>{
     res.status(200).json(response)
   })
   .catch((err)=>{
     res.status(500).send(err);
   })
  } catch (error) {
    res.status(500).send(error)
  }
}

const rejectKYC = async(req,res)=>{
  try {
    
    const adminId = req.admin.id
     const {kycId,reason} = req.params
    _rejectKYC(kycId,reason,adminId)
    .then((response)=>{
     res.status(200).json(response)
   })
   .catch((err)=>{
     res.status(500).send(err);
   })
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
}

const acceptKYC = async(req,res)=>{
  try {
    
    const adminId = req.admin.id
     const {kycId} = req.params
    _acceptKYC(kycId,adminId)
    .then((response)=>{
     res.status(200).json(response)
   })
   .catch((err)=>{
     res.status(500).send(err);
   })
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
}

const getCounts = async(req,res)=>{
  try { 
    _getCounts()
    .then((response)=>{
     res.status(200).json(response)
   })
   .catch((err)=>{
     res.status(500).send(err);
   })
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
}


const getAverage = async(req,res)=>{
  try { 
    _getAverage()
    .then((response)=>{
     res.status(200).json(response)
   })
   .catch((err)=>{
     res.status(500).send(err);
   })
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
}

const getChartData = async(req,res)=>{
  try { 
     const {year} = req.query
    _getChartData(year)
    .then((response)=>{
     res.status(200).json(response)
   })
   .catch((err)=>{
     res.status(500).send(err);
   })
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
}

export {
    adminLogin,
    getAllUsers,
    userStatusToggle,
    getAllReports,
    takeAction,
    fetchAllKYC,
    rejectKYC,
    acceptKYC,
    getCounts,
    getAverage,
    getChartData
}