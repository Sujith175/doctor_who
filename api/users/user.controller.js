const { create,getlocation,gethomepage,getspecialist,getdoctors,checkreg,gettocken,createbooking,liveview,getprofile,gethospital,login,addhospital,hospitalapprovel,addocotr,getapprovel,addtimeintervel,getslots,cancelbooking,addfund,getreghospital,getkeepedtime,getbookinghistory,getoffday,canceldate,deletetimeshedule,addleavedate,regdoctor,updatetstaus,updateprofile,updatembno }=require("./user.service");
const { genSaltSync, hashSync}=require("bcrypt");
const sendMail = require("./Utils/sendMail");
const jwt = require("jsonwebtoken");
const pool= require("../../config/database");
///
const nodemailer=require("nodemailer");
const cloudinary = require("./Utils/cloudinary");
const uploadd = require("./middleware/multer");

module.exports={

createUser:async (req,res)=>{
    const body=req.body;
    console.log("body---"+body.mobileno);

  //console.log("bodye mail---"+body.email);
      const activationToken = createActivationToken(body.mobileno);
       console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa---"+activationToken);
    //const activationUrl = `http://127.0.0.1:5173/activation/${activationToken}`;


     const activationUrl = `https://doctor-who-eight.vercel.app/${activationToken}`;




    
 
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    create(body,async(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }


 try {
      await sendMail({
        email: body.email,
        subject: "Activate your Account",
        message: `Hello ${body.name} Please Click on the link to activate your account: ${activationUrl}`,
      });

    return  res.status(200).json({
        // success: true,
        // message: `Please check your email :- ${body.email} to activate your Account`,
                 success:1,
            message:results,
            status:true
      });
    } catch (err) {
        console.log(err);
   // return  res.status(500);
    }
        // return res.status(200).json({
        //     success:1,
        //     message:results
        // });
    });
},


//activate user message
  catchAsyncErrors:async (req, res, next) => {
    console.log("calling.........");
    try {
      const { activation_token } = req.body;
      console.log("new activation_token........."+activation_token);
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
console.log("new user........."+newUser);

      if (!newUser) {
          return res.json({
                success:0,
                status:404,
                message:"Invalid token"
            });
      }

      const {mobileno } = newUser;
      console.log("in activation mbno---"+mobileno);
   console.log("i:");

      //let user = await User.findOne({ email });
      // sql

  pool.query(
        'update login set isactive=? where mobileno=?',
        [
          1 ,
            mobileno
        ],
        (error,results,fields)=>{
                 console.log("sssssi");
            if(error){
               return res.json({
                success:0,
                status:404,
                message:"Something went wrong!"
            });
            }

           // console.log(results[0]["type"]);

           


                // Inserting into the login table with static type value
      
           // console.log("assee");
            
           // return callback(null,results)
            return  res.json({
                success:0,
                status:200,
                message:"Success"
            });
        }
     ); 
    


    //   if (mobileno) {
    //     return next(new ErrorHandler("user already exists", 400));
    //   }

//     updatestaus(mobileno,(err,results)=>{

//         if(err){
//             console.log(err);
//             return res.status(500).json({
//                 success:0,
//                 message:"Databse connection error"           
//  });
//         }

//           if(!results){
//             return res.json({
//                 success:0,
//                 type:0,
//                 message:"Record not found"
//             });
//         }
        
//         console.log("updated");
//         return res.status(200).json({
//             success:1,
//             type:type,
//             message:results
//         });


   // });




    //   user = await User.create({ name, email, password, avatar });
    //   sendToken(user, 201, res);
      console.log("sucess");
      
    } catch (err) {
      return res.json({
                success:0,
                status:500,
                message:err.message
            });
    }
  },





// get neasrestlocation

getlocation:(req,res)=>{
  getlocation((err,results1)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results1){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        return res.status(200).json({
            success:1,
            message:results1,
        });
    });
    
},


// get neasrestlocation

gethomepage:(req,res)=>{
    const body=req.body;
  gethomepage(body,(err,userdetails,banner,hospitals,doctors)=>{
        if(err){
            console.log(err);
            return;
        }
         if(!userdetails){
            return res.json({
                success:0,
                message:"No users details found"
            });
        }
          if(!banner){
            return res.json({
                success:0,
                message:"No banner images found"
            });
        }
           if(!hospitals){
            return res.json({
                success:0,
                message:"No hospitals found"
            });
        }
               if(!doctors){
            return res.json({
                success:0,
                message:"No doctors found"
            });
        }
        return res.status(200).json({
            success:1,
            user:userdetails,
            banner:banner,
            hospitals:hospitals,
            doctors:doctors
        });
    });
    
},


// get specialist

getspecialist:(req,res)=>{
  getspecialist((err,results1)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results1){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        return res.status(200).json({
            success:1,
            message:results1,
        });
    });
    
},

///get doctors
getdoctors:(req,res)=>{
const body=req.body;


    console.log("oouuutttt---"+body.id);

  getdoctors(body,(err,results)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results){
            return res.json({
                success:0,
                status:201,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
    
},


   //check user egister or not
checkreg:(req,res)=>{
const body=req.body;


    console.log("oouuutttt---"+body.mobileno);

  checkreg(body,(err,results)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results){
            return res.json({
                success:0,
                status:201,
                message:{
                    id:0,
                     mobileno: "0000000",
        isactive: 0,
        type: 0,
        locationid: 0
                }
            });
        }
      
   
        return res.status(200).json({
            success:1,
           message:results
        });
    });
    
},


// get tocken

gettocken:(req,res)=>{
    const body=req.body;
  gettocken(body,(err,result1,result2)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!result1){
            return res.json({
                success:0,
                message:"No slots founded"
            });
        }
           if(!result2){
            return res.json({
                success:0,
                message:"No Slots found"
            });
        }
        //        if(!doctors){
        //     return res.json({
        //         success:0,
        //         message:"No doctors found"
        //     });
        // }
        return res.status(200).json({
            success:1,
            dateresp:result1,
             slots:result2,
            // doctors:doctors
        });
    });
    
},

//createbooking



createbooking:async(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    createbooking(body,async(err,results,name,email)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }


        console.log("name---"+name);
        console.log("email---"+email);



        // return res.status(200).json({
        //     success:1,
        //     message:results
        // });





        try {



const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  to: email,
  port: 587,
  secure: false, // Upgrade to true for secure connections (recommended)
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  }




});

const messageText = `Dear ${name},

This confirms your upcoming appointment with Dr. body.dcotorname on body.formattedDate at body.time.

Your appointment details:
* Doctor: Dr. body.dcotorname
* Date: body.formattedDate
* Time: body.time

We look forward to seeing you then!

Sincerely,

The Team at champz`;

// Construct the message using template literals
const messageHtml = `<b>Dear ${name} </b><br />
This confirms your upcoming appointment with Dr. ${body.dcotorname} 
on ${body.formattedDate} at ${body.time}<br /><br />
Your appointment details:<br />
* Doctor: Dr. ${body.dcotorname}<br />
* Date: ${body.formattedDate}<br />
* Time: ${body.time}<br /><br />
We look forward to seeing you.<br /><br />
Sincerely,<br />
The Team at Champz`;


const message = {
  from: process.env.SMTP_MAIL,
  to: email,
  subject: `Appointment Confirmation -${name}`,
  text: messageText,
  html: messageHtml
};
            
transporter.sendMail(message, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});


    //   await sendMail({
    //     email: email,
    //     subject: `Appointment Confirmation - ${name}`,
    //         message: message,
    //   });

    return  res.status(200).json({
        // success: true,
        // message: `Please check your email :- ${body.email} to activate your Account`,
                 success:1,
            message:results,
            status:true
      });
    } catch (err) {
        console.log(err);
   // return  res.status(500);
    }
    });
},


  //Live view
liveview:(req,res)=>{
const body=req.body;


    ///console.log("oouuutttt---"+body.mobileno);

  liveview(body,(err,results)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results){
            return res.json({
                success:0,
                status:201,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
           message:results
        });
    });
    
},


  //get profile
getprofile:(req,res)=>{
const body=req.body;


    ///console.log("oouuutttt---"+body.mobileno);

  getprofile(body,(err,results,results2)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results){
            return res.json({
                success:0,
                status:201,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
           profile:results,
           bookinghistory:results2
        });
    });
    
},

//get hospital

gethospital:(req,res)=>{
  gethospital((err,results1)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results1){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        return res.status(200).json({
            success:1,
            message:results1,
        });
    });
    
},


/// login

login:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    login(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

          if(!results){
            return res.json({
                success:0,
                type:0,
                message:"Record not found"
            });
        }

        
 const type=results["type"];
        
        return res.status(200).json({
            success:1,
            type:type,
            message:results
        });
    });
},


///add hospital

addhospital:(req,res)=>{
    console.log("req.file");
console.log(req.file);
    
        cloudinary.uploader.upload(req.file.path, function (err, result){
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      })
    }

    const response =result;

    const imageUrl = response.url;
  
   // const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);

    addhospital(req,imageUrl,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }
        return res.status(200).json({
            success:1,
            message:results
        });
    });
     })
    
},


/// approvel hospital

hospitalapprovel:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    hospitalapprovel(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

          if(!results){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},


///add docotor

addocotr:(req,res)=>{
    console.log("req.file");
console.log(req.file);
    
      cloudinary.uploader.upload(req.file.path, function (err, result){
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      })
    }

    const response =result;

    const imageUrl = response.url;

  
   // const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);

    addocotr(req,imageUrl,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }
        return res.status(200).json({
            success:1,
            message:results
        });
    });
      })
    
},


//get approvel

getapprovel:(req,res)=>{
      const body=req.body;
  getapprovel(body,(err,results1)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results1){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }

        if(body.id==0){
        return res.status(200).json({
            success:1,
            message:results1,
            swit:"hospital"
            
        });
        }else{
              return res.status(200).json({
            success:1,
            message:results1,
            swit:"doctor"

            
        });
        }
    });
    
},


// add time intervel

addtimeintervel:(req,res)=>{
    const body=req.body;
    // for encript password
    // const salt=genSaltSync(10);
    // body.password=hashSync(body.password,salt);
    addtimeintervel(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }
        return res.status(200).json({
            success:1,
            data:results,
            msg:"success"
        });
    });
},


//getslots

getslots:(req,res)=>{
      const body=req.body;
  getslots(body,(err,results1,result2)=>{
        if(err){
            console.log(err);
            return;
        }
          if(!results1){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        return res.status(200).json({
            success:1,
            booking:results1,
            slots:result2,
        });
    });
    
},



/// cancel booking

cancelbooking:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    cancelbooking(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

          if(!results){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},


/// add fund

addfund:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    addfund(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

          if(!results){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},

/// getreghospital

getreghospital:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    getreghospital(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

          if(!results){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},


/// getkeepedtime

getkeepedtime:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    getkeepedtime(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

          if(!results){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},
/// getbookinghistory

getbookinghistory:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    getbookinghistory(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

          if(!results){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},



/// off day

getoffday:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    getoffday(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

          if(!results){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},


// canceldate

canceldate:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    canceldate(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

        //   if(!results){
        //     return res.json({
        //         success:0,
        //         message:"Record not found"
        //     });
        // }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},


// deletetimeshedule

deletetimeshedule:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    deletetimeshedule(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

        //   if(!results){
        //     return res.json({
        //         success:0,
        //         message:"Record not found"
        //     });
        // }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},


// add leavedate

addleavedate:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    addleavedate(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

        //   if(!results){
        //     return res.json({
        //         success:0,
        //         message:"Record not found"
        //     });
        // }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},

/// 
// add leavedate

regdoctor:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    regdoctor(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

        //   if(!results){
        //     return res.json({
        //         success:0,
        //         message:"Record not found"
        //     });
        // }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},


//  updatetstaus

updatetstaus:async(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    updatetstaus(body,async(err,results,result2,email,name)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

                //console.log("date---"+date);

        try {





const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  to: email,
  port: 587,
  secure: false, // Upgrade to true for secure connections (recommended)
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  }




});

const messageText = `Dear ${name} ,

This informs your upcoming appointment on ${result2["date"]} at ${result2["time"]} is canceled.

// Your appointment details:
// * Doctor: Dr. body.dcotorname
* Date: ${result2["date"]}
* Time: ${result2["time"]}

// We look forward to seeing you then!

Sincerely,

The Team at champz`;

// Construct the message using template literals
const messageHtml = `<b>Dear ${name} </b><br />
This informs your upcoming appointment
on ${result2["date"]} at ${result2["time"]} is canceled<br /><br />
Your appointment details:<br />

* Date: ${result2["date"]}<br />
* Time: ${result2["time"]}<br /><br />
We look forward to seeing you again.<br /><br />
Sincerely,<br />
The Team at Champz`;


const message = {
  from: process.env.SMTP_MAIL,
  to: email,
  subject: `Appointment canceled -${name}`,
  text: messageText,
  html: messageHtml
};
            
transporter.sendMail(message, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});


    //   await sendMail({
    //     email: email,
    //     subject: `Appointment Confirmation - ${name}`,
    //         message: message,
    //   });

    return  res.status(200).json({
        // success: true,
        // message: `Please check your email :- ${body.email} to activate your Account`,
                 success:1,
            message:results,
            status:true
      });
    } catch (err) {
        console.log(err);
   // return  res.status(500);
    }
        
        // return res.status(200).json({
        //     success:1,
        //     message:results
        // });
    });
},


//update profile

updateprofile:(req,res)=>{
    console.log("req.file");
console.log(req.file);
    
     

       cloudinary.uploader.upload(req.file.path, function (err, result){
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      })
    }

    const response =result;

    const imageUrl = response.url;



    updateprofile(req,imageUrl,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }
        return res.status(200).json({
            success:1,
            message:results
        });
    });


    // res.status(200).json({
    //   success: true,
    //   message:"Uploaded!",
    //   data: result
    // })
  })
  
   // const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);


    
},

//iupdatembno
updatembno:(req,res)=>{
    const body=req.body;
    // for encript password
   // const salt=genSaltSync(10);
   // body.password=hashSync(body.password,salt);
    updatembno(body,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Databse connection error"           
 });
        }

        //   if(!results){
        //     return res.json({
        //         success:0,
        //         message:"Record not found"
        //     });
        // }
        
        return res.status(200).json({
            success:1,
            message:results
        });
    });
},

}

const createActivationToken = (user) => {
    console.log("inside--"+user);
    console.log("inside 02--"+process.env.ACTIVATION_SECRET);
//   return jwt.sign(user, process.env.ACTIVATION_SECRET, {
//     expiresIn: "1d",
//   });

  const accessToken = jwt.sign( {mobileno: user}, process.env.ACTIVATION_SECRET, { expiresIn: 60 * 60});
  return accessToken;
};