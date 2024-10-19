const adminHelper = require('../helpers/adminHelper')
const User = require('../models/userModel')



const adminLogin = async(req,res)=>{
    try {
      console.log('haaai');
    
    const {email,password} = req.body
    console.log(email,password);
      adminHelper.adminLogin(email,password)
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
   adminHelper.block_Unblock_User(userId)
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
    adminHelper.getAllReports(page,limit)
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
    adminHelper.takeAction(targetId)
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
    
    adminHelper.fetchAllKYC()
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
    adminHelper.rejectKYC(kycId,reason,adminId)
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
    adminHelper.acceptKYC(kycId,adminId)
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
    adminHelper.getCounts()
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
    adminHelper.getAverage()
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
    adminHelper.getChartData(year)
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

module.exports={
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