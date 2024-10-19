const Verify = require('../models/verifyModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const saltRounds = 10; //setting salt rounds



const verifyOtp = (email, token) => {
  return new Promise((resolve, reject) => {
      try {
          console.log(email, token);
     
          Verify.findOne({ email: email, token: token })
              .then(async (data) => {
                 
                  if ( data && data.updatedAt && (Date.now() - data.updatedAt.getTime()) < 60000) {
                      await Verify.findOneAndUpdate({ email: email, used: false }, { used: true });
                     
                      registration(data)
                          .then((response) => {
                             
                              resolve(response); // Resolve response if registration is successful
                          })
                          .catch((error) => {
                              reject({
                                  status: 500,
                                  message: error.message,
                                  error_code: 'INTERNAL_ERROR',
                              }); // Catch any errors from registration
                          });
                  } else {
                      console.log('invalid code');
                      reject({
                          status: 400,
                          message: 'Invalid verification code or OTP expired',
                      });
                  }
              })
              .catch((err) => {
                  reject({
                      status: 500,
                      message: 'Invalid verification code',
                      error_code: 'DB_FETCH_ERROR',
                  }); // Catch any errors from finding the verification data
              });
      } catch (error) {
          reject({
              status: 500,
              message: error.message,
              error_code: 'INTERNAL_ERROR',
          });
      }
  });
};


  module.exports=verifyOtp
  

  const registration = async (data) => {
    try {
        console.log('Inside registration function');
        
        // Check if the user already exists with the provided email
        const existingEmailUser = await User.findOne({ email: data.email });
        if (existingEmailUser) {
            throw {
                status: 409,
                error_code: 'USER_ALREADY_REGISTERED',
                message: 'Email has already been registered',
            };
        }

        // Check if the user already exists with the provided username
        const existingUsernameUser = await User.findOne({ userName: data.userName });
        if (existingUsernameUser) {
            throw {
                status: 409,
                error_code: 'USERNAME_TAKEN',
                message: 'Username already in use',
            };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // Create a new user object
        const newUser = new User({
            userName: data.userName,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        
        console.log('User saved successfully:', savedUser);
        
        return {
            status: 201,
            message: 'Account created successfully',
        };
    } catch (error) {
        console.error('Error during registration:', error);
        throw {
            status: error.status || 500,
            error_code: error.error_code || 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Something went wrong on the server',
        };
    }
};