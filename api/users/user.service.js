const pool= require("../../config/database");


module.exports={
 
    create:(data,callback)=>{


  

           const profile="0";
              const isactive=0;
     pool.query(
        'INSERT INTO registration(email,name,locationid,mobileno,profile) VALUES (?,?,?,?,?)',
        [
            data.email,
            data.name,
            data.locationid,
            data.mobileno,
            profile,
            isactive
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }




    

                // Inserting into the login table with static type value
                pool.query(
                    'INSERT INTO login(mobileno, type, isactive) VALUES (?,?,?)',
                    [
                        data.mobileno,
                          data.status, 
                        // Assuming status is provided in the data object
                        0,   
                              // Static integer value for type
                    ],
                    (error, results, loginFields) => {
                        if (error) {
                            return callback(error);
                        }

    console.log("insert ");

                         const status="done";
                         const isactive=1;
                         const bookingamount=10;

                              const amount=0;
                              
                              const transactionid="qqqq";
                            


               pool.query(
      'insert into wallet(mobileno,amount,status,isactive,bookingamount)values(?,?,?,?,?)',
        [
            data.mobileno,
            amount,
            status,
            isactive,
            bookingamount

        ],
        (error,results7,fields)=>{
            if(error){
              return callback(error)
            }
  return callback(null, results7);

                }
     ); 




                       // return callback(null, results);
                    }
                );
           // console.log("assee");
            
           // return callback(null,results)
        }
     ); 
    },

    // get location
  getlocation:callback =>{
     pool.query(
        'select * from nearestlocation where isactive=1',
        [],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        }
     ); 
    },

        // get homepage
  gethomepage:async (body,callback) =>{

   pool.query('SELECT registration.*,nearestlocation.locationname FROM `registration`,nearestlocation WHERE registration.locationid=nearestlocation.id and registration.mobileno=?', [body.mobileno], (error5, results5, fields5) => {
        if (error5) {
            return callback(error5);
        }


      pool.query('SELECT * FROM banner WHERE isactive = 1', [], (error1, results1, fields1) => {
        if (error1) {
            return callback(error1);
        }

        pool.query('SELECT hospital.*,nearestlocation.locationname FROM `hospital`,nearestlocation WHERE hospital.nearestlocationid=nearestlocation.id and hospital.isactive=1 and nearestlocation.isactive=1', [], (error2, results2, fields2) => {
            if (error2) {
                return callback(error2);
            }

           
  pool.query('SELECT doctor.*,nearestlocation.locationname,category.name as categoryname,category.icon as categoryicon,category.id as catid FROM `doctor`,nearestlocation,category WHERE doctor.nearestlocationid=nearestlocation.id and doctor.categoryid=category.id and doctor.isactive=1', [], (error3, results3, fields3) => {
            if (error3) {
                return callback(error3);
            }

           

            const data = {
                banner: results1,
                hospitals: results2,
                 doctors: results3
            };

            return callback(null,results5[0], results1,results2,results3);
        });






            // const data = {
            //     banner: results1,
            //     hospitals: results2
            // };

            // return callback(null, results1,results2);
        });
    });
        });
     


},

    // get specialist
  getspecialist:callback =>{
     pool.query(
        'select * from category where isactive=1',
        [],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        }
     ); 
    },



// get doctors


     getdoctors:(body,callback)=>{
        console.log("id in serv-----"+body.id);

        if(body.id==0){

          if(body.catid==0){
              pool.query(
        'SELECT doctor.*,nearestlocation.locationname,category.name as catname,category.icon,category.id as catid FROM `doctor`,nearestlocation,category WHERE doctor.nearestlocationid=nearestlocation.id and doctor.categoryid=category.id and doctor.isactive=1',
        [],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        }  );
          }else{


     pool.query(
        'SELECT doctor.*,nearestlocation.locationname,category.name as catname,category.icon,category.id as catid FROM `doctor`,nearestlocation,category WHERE doctor.nearestlocationid=nearestlocation.id and doctor.categoryid=category.id and category.id=? and doctor.isactive=1',
        [body.catid],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        }
     );
     
     }
     
      }else{


         if(body.catid==0){

    pool.query(
        'SELECT doctor.*,nearestlocation.locationname,category.name as catname,category.icon,category.id as catid FROM `doctor`,nearestlocation,category WHERE doctor.nearestlocationid=nearestlocation.id and doctor.categoryid=category.id and doctor.isactive=1 and doctor.hospitalid=?',
        [body.id],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        }
     );

         }else{
         pool.query(
        'SELECT doctor.*,nearestlocation.locationname,category.name as catname,category.icon,category.id as catid FROM `doctor`,nearestlocation,category WHERE doctor.nearestlocationid=nearestlocation.id and doctor.categoryid=category.id and category.id=? and doctor.isactive=1 and doctor.hospitalid=?',
        [body.catid,
          body.id],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        }
     );
     }
     }
    },


   //check user egister or not


     checkreg:(body,callback)=>{
        console.log("id in serv-----"+body.mobileno);
     pool.query(
        'SELECT login.*,registration.locationid from login,registration where login.mobileno=? and registration.mobileno=?',
        [body.mobileno,body.mobileno],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results[0])
        }
     ); 
    },




        // get tockennnn
  gettocken:async (body,callback) =>{
    console.log("id in serv-----"+body.date);
    const date=body.date;
    const doctord=body.doctorid;


      pool.query('SELECT * FROM offday WHERE doctorid=? and date =?', [doctord,date], (error1, results1, fields1) => {
        if (error1) {
            console.log("not found");
            return callback(error1);
            
        }
          ///console.log(" founded" +fields1["date"]);

        pool.query('SELECT * FROM datetime where isactive=1 and doctorid=?', [doctord], (error2, results2, fields2) => {
            if (error2) {
                return callback(error2);
            }

           
//   pool.query('SELECT doctor.*,nearestlocation.locationname,category.name as categoryname,category.icon as categoryicon,category.id as catid FROM `doctor`,nearestlocation,category WHERE doctor.nearestlocationid=nearestlocation.id and doctor.categoryid=category.id and doctor.isactive=1', [], (error3, results3, fields3) => {
//             if (error3) {
//                 return callback(error3);
//             }

           

            // const data = {
            //     dateresp: results1,
            //     hospitals: results2,
            //    //  doctors: results3
            // };

            return callback(null,results1, results2);
        });






            // const data = {
            //     banner: results1,
            //     hospitals: results2
            // };
 // return callback(null, results1);
            // return callback(null, results1,results2);
        });
    // });

},
//booking


 createbooking:(data,callback,name,email)=>{
    const staus=0;
    const amount=data.amount;
    const paymentmethod=data.paymentmethod;

     pool.query(
        'INSERT INTO booking(mobileno,date,datetimeid,tockenno,status,doctorid,hospitalid,time) VALUES (?,?,?,?,?,?,?,?)',
        [
            data.mobileno,
            data.date,
            data.datetimeid,
            data.tockenno,
            staus,
             data.doctorid,
            data.hospitalid,
            data.time,
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

/// sent email confirmation for booking here




pool.query(
        'select * from registration where mobileno=?',
        [
            data.mobileno,
        ],
        (error,results2,fields)=>{
            if(error){
              return callback(error)
            }


           // return callback(null,results1)
    

if(paymentmethod=="wallet"){



  pool.query(
        'update wallet set amount=? where mobileno=?',
        [
            data.balance,
            data.mobileno,
        ],
        (error,results1,fields)=>{
            if(error){
              return callback(error)
            }


            return callback(null,results1,results2[0]["name"],results2[0]["email"])
             }
     ); 
}else{



  return callback(null,results,results2[0]["name"],results2[0]["email"])
}
         }
     ); 



        
        }
     ); 
    },
  //liveview


     liveview:(body,callback)=>{
        console.log("id in serv-----"+body.mobileno);
     pool.query(
        'SELECT * from booking where date=? and doctorid=? ORDER BY tockenno ASC',
        [body.date,body.doctorid],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        }
     ); 
    },



/// profileview
 //liveview


     getprofile:(body,callback)=>{
        console.log("id in serv-----"+body.mobileno);
     pool.query(
        'SELECT wallet.*,registration.profile,registration.name as regname ,registration.email,nearestlocation.locationname,nearestlocation.id as nertslocid FROM `registration`,wallet,nearestlocation WHERE registration.mobileno=wallet.mobileno and registration.locationid=nearestlocation.id and registration.mobileno=?',
        [body.mobileno],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }


        // pool.query('SELECT booking.*,doctor.name as doctorname,hospital.name as hospitalname,doctor.location,doctor.photo as doctorprofile FROM `booking`,doctor,hospital where booking.doctorid=doctor.id and booking.hospitalid=hospital.id AND booking.mobileno=?', 
          pool.query('SELECT booking.*,doctor.name as doctorname,doctor.location,doctor.photo as doctorprofile FROM `booking`,doctor where booking.doctorid=doctor.id AND booking.mobileno=? ORDER BY id DESC', 
        
        [body.mobileno], (error2, results2, fields2) => {
            if (error2) {
                return callback(error2);
            }

              return callback(null,results[0], results2);

     });

           // return callback(null,results)
        }
     ); 
    },


    //gethospital

      // get location
  gethospital:callback =>{
       pool.query('SELECT hospital.*,nearestlocation.locationname FROM `hospital`,nearestlocation WHERE hospital.nearestlocationid=nearestlocation.id and hospital.isactive=1 and nearestlocation.isactive=1',
        [],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        }
     ); 
    },


    /// login

     login:(data,callback)=>{
           const profile="0";
     pool.query(
        'select * from login where username=? and password=?',
        [
            data.username,
            data.password
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

           // console.log(results[0]["type"]);

           


                // Inserting into the login table with static type value
      
           // console.log("assee");
            
           // return callback(null,results)
            return callback(null, results[0]);
        }
     ); 
    },
// add hospital

 addhospital:(req,imageUrl,callback)=>{
  const body=req.body;
  const isactive=1
   //const pathload=`https://'+process.env.DB_HOST+':'+process.env.APP_PORT+`;
   //const imageUrl = `https://${process.env.DB_HOST}:${process.env.APP_PORT}/upload/hospitalimages/`;
  const locid=parseInt(body.nearestlocationid);
if (body.type=="0"){
     pool.query(
        'INSERT INTO hospital(name,mobileno,whatsappno,email,time,address,location,description,nearestlocationid,username,password,image,isactive) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
        body.name,body.mobileno,body.whatsappno,body.email,body.time,body.address,body.location,body.description,locid,body.username,body.password,imageUrl,isactive
        ],

        //og path of posting image
      //  ,'https://'+process.env.DB_HOST+':'+process.env.APP_PORT+'/upload/hospitalimages/'+req.file.filename,
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

  pool.query(
        'insert into login(username,password,type)values(?,?,?)',
        [
            body.username,
            body.password,
            2
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

            
return callback(null,results[0])

    }
     ); 
          //  return callback(null,results)
        }
     ); 
}else if(body.type=="1"){






       pool.query(
        'update hospital set name=?,mobileno=?,whatsappno=?,email=?,time=?,address=?,location=?,description=?,nearestlocationid=?,password=?,image=? where username=?',
        [
        body.name,body.mobileno,body.whatsappno,body.email,body.time,body.address,body.location,body.description,locid,body.password,imageUrl,body.username,
        ],

        //og path of posting image
      //  ,'http://'+process.env.DB_HOST+':'+process.env.APP_PORT+'/upload/hospitalimages/'+req.file.filename,
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

  pool.query(
        'update login set password=? where username=?',
        [
            body.password,
            body.username
          
            
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

            
return callback(null,results[0])

    }
     ); 
          //  return callback(null,results)
        }
     ); 
 }else{


       pool.query(
        'update hospital set name=?,mobileno=?,whatsappno=?,email=?,time=?,address=?,location=?,description=?,nearestlocationid=?,password=? where username=?',
        [
        body.name,body.mobileno,body.whatsappno,body.email,body.time,body.address,body.location,body.description,locid,body.password,body.username,
        ],

        //og path of posting image
      //  ,'http://'+process.env.DB_HOST+':'+process.env.APP_PORT+'/upload/hospitalimages/'+req.file.filename,
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

  pool.query(
        'update login set password=? where username=?',
        [
            body.password,
            body.username
          
            
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

            
return callback(null,results[0])

    }
     ); 
          //  return callback(null,results)
        }
     ); 


 }
    },

// updatehospitalisactive



     hospitalapprovel:(data,callback)=>{

           const profile="0";

           if(data.section=="hs"){
            console.log("isnide hs");

      
     pool.query(
        'update hospital set isactive=? where id=?',
        [
            data.type,
            data.id
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }


                // Inserting into the login table with static type value
      
           // console.log("assee");
            
           // return callback(null,results)
            return callback(null, results);
        }
     ); 
    } else{
       pool.query(
        'update doctor set isactive=? where id=?',
        [
            data.type,
            data.id
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }


                // Inserting into the login table with static type value
      
           // console.log("assee");
            
           // return callback(null,results)
            return callback(null, results);
        }
     ); 
     }
    },



    // add docotr

 addocotr:(req,imageUrl,callback)=>{
  const body=req.body;
  const isactive=1;
   //const imageUrl = `https://${process.env.DB_HOST}:${process.env.APP_PORT}/upload/docotrimages/`;
  const locid=parseInt(body.nearestlocationid);
    const catid=parseInt(body.designationid);
      const hospitalid=parseInt(body.hospitalid);
       const isvisible=parseInt(body.visible);

       if (body.type=="0"){
     pool.query(
        'INSERT INTO `doctor`(`name`, `mobileno`, `whatsappno`, `categoryid`, `address`, `location`, `description`, `nearestlocationid`, `username`, `password`, `photo`, `isvisiblephone`, `isactive`, `hospitalid`,email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
        body.name,body.mobileno,body.whatsappno,catid, body.address,body.location,body.description,locid,body.username,body.password,imageUrl,isvisible,isactive,hospitalid,body.email
        ],

        //og path of posting image
      //  ,'http://'+process.env.DB_HOST+':'+process.env.APP_PORT+'/upload/hospitalimages/'+req.file.filename,
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

  pool.query(
        'insert into login(username,password,type)values(?,?,?)',
        [
            body.username,
            body.password,
            3
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

            
return callback(null,results[0])

    }
     ); 
          //  return callback(null,results)
        }
     ); 
    
   } else if (body.type=="1"){



 pool.query(
        'update `doctor` set `name`=?, `mobileno`=?, `whatsappno`=?, `categoryid`=?, `address`=?, `location`=?, `description`=?, `nearestlocationid`=?,`password`=?, `photo`=?, `isvisiblephone`=?, `isactive`=?, `hospitalid`=?,email=? where username=?',
        [
        body.name,body.mobileno,body.whatsappno,catid, body.address,body.location,body.description,locid,body.password,imageUrl,isvisible,isactive,hospitalid,body.email,body.username
        ],

        //og path of posting image
      //  ,'http://'+process.env.DB_HOST+':'+process.env.APP_PORT+'/upload/hospitalimages/'+req.file.filename,
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

  pool.query(
        'update login set password=? where username=?',
        [
           body.password,
            body.username,
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

            
return callback(null,results[0])

    }
     ); 
          //  return callback(null,results)
        }
     ); 
    }else{


      pool.query(
        'update `doctor` set `name`=?, `mobileno`=?, `whatsappno`=?, `categoryid`=?, `address`=?, `location`=?, `description`=?, `nearestlocationid`=?,`password`=?, `isvisiblephone`=?, `isactive`=?, `hospitalid`=?,email=? where username=?',
        [
        body.name,body.mobileno,body.whatsappno,catid, body.address,body.location,body.description,locid,body.password,isvisible,isactive,hospitalid,body.email,body.username
        ],

        //og path of posting image
      //  ,'http://'+process.env.DB_HOST+':'+process.env.APP_PORT+'/upload/hospitalimages/'+req.file.filename,
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

  pool.query(
        'update login set password=? where username=?',
        [
            body.password,
            body.username,
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

            
return callback(null,results[0])

    }
     ); 
          //  return callback(null,results)
        }
     ); 

    }
    },



    // get approvel
  getapprovel:(data,callback) =>{


    if(data.id==0){
       pool.query('SELECT * from hospital where isactive=0',
        [],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        } ); 
    }else{
   pool.query('SELECT * from doctor where isactive=0',
        [],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            return callback(null,results)
        } ); 
    }
    
    },




    /// add time intervel


        addtimeintervel:(data,callback)=>{





   const isactive=1;
insertIntervals(pool,data.datalist ,(error, results) => {
    if (error) {
       return callback(error)
    } else {
       return callback(null,results)
    }
});
   




        },


        // get slots


  getslots:(data,callback) =>{
    const selecteddate=data.date;
    const doctorid=data.doctorid;
    const day=data.day;


   
       pool.query('SELECT * from `offday` where date=? and doctorid=?',
        [selecteddate,doctorid],
        (error,results,fields)=>{
            if(error){
              console.log("inside ");
              return callback(error)
            }
             if (results.length === 0) {
               console.log("Dates are available");

  pool.query('SELECT * from `booking` where date=? and doctorid=?',
        [selecteddate,doctorid],
        (error,results1,fields)=>{
            if(error){
              console.log("inside ");
              return callback(error)
            }


               pool.query(
            'SELECT * FROM `datetime` where day=? and doctorid=? and isactive=1 ORDER BY tockencount',
            [day, doctorid],
            (error, availableSlots, fields) => {
                if (error) {
                    console.log("Error occurred in second query:", error);
                    return callback(error);
                }

                console.log("Available slots:", availableSlots);
                // Return the results of both queries
                return callback(null, results1,availableSlots);
            }
        );

               
 


      //  return callback(null, results1);
   } ); 
    } else {
             console.log("No dates available");
        return callback(null, "No slots available in this date");
    }
        } ); 
    
    
    },



    /// cancel booking

     cancelbooking:(data,callback)=>{
      
     pool.query(
        'DELETE FROM booking WHERE id=?',
        [
            data.id
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }


                // Inserting into the login table with static type value
      
           // console.log("assee");
            
           // return callback(null,results)
            return callback(null, results);
        }
     ); 

    },



    /// add fund

     addfund:(data,callback)=>{
      
     pool.query(
        'select * from wallet where mobileno=?',
        [
            data.mobileno
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
            if(results.length>0){

              console.log("Founded---"+results[0]['amount']);

             const am=results[0]['amount'];
             const tt=am+data.amount;



               pool.query(
        'update wallet set amount=?,transactionid=?,datetime=? where mobileno=?',
        [
          tt,
          
            data.transactionid,
            data.date,
              data.mobileno
        ],
        (error,result6,fields)=>{
            if(error){
              return callback(error)
            }
  return callback(null, result6);

                }
     ); 


            }else{
                         console.log("insert ");

                         const status="done";
                         const isactive=1;
                         const bookingamount=10;
                          const amount=0;


               pool.query(
      'insert into wallet(mobileno,amount,transactionid,datetime,status,isactive,bookingamount)values(?,?,?,?,?,?,?)',
        [
            data.mobileno,
          data. amount,
            data.transactionid,
            data.date,
            status,
            isactive,
            bookingamount

        ],
        (error,results7,fields)=>{
            if(error){
              return callback(error)
            }
  return callback(null, results7);

                }
     ); 
            }


                // Inserting into the login table with static type value
      
           // console.log("assee");
            
           // return callback(null,results)
         //   return callback(null, results);
        }
     ); 

    },




// get reg hospital



     getreghospital:(data,callback)=>{
      
     pool.query(
        //'select * from hospital where username=?',
        'SELECT hospital.*,nearestlocation.locationname as nearloc FROM `hospital`,nearestlocation WHERE hospital.nearestlocationid=nearestlocation.id AND hospital.username=?',
        [
            data.username
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
           
  return callback(null, results[0]);

 


    
        }
     ); 

    },



// get getkeepedtime



     getkeepedtime:(data,callback)=>{
      
     pool.query(
        'select * from keeptimeshedule where doctorid	=?',
        [
            data.doctorid
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
           
  return callback(null, results);

 


    
        }
     ); 

    },


// get getbookinghistory



     getbookinghistory:(data,callback)=>{
      
     pool.query(
        'SELECT booking.*,registration.name FROM `booking`,registration WHERE booking.mobileno=registration.mobileno and booking.doctorid=? ORDER BY tockenno',
        [
            data.doctorid
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
           
  return callback(null, results);

 


    
        }
     ); 

    },



// get getoffday



     getoffday:(data,callback)=>{
      
     pool.query(
        'SELECT * from offday WHERE doctorid=?',
        [
            data.doctorid
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
           
  return callback(null, results);

 


    
        }
     ); 

    },


    // get canceldate



     canceldate:(data,callback)=>{
      
     pool.query(
        'delete from offday WHERE id=?',
        [
            data.id
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
           
  return callback(null, results[0]);

 


    
        }
     ); 

    },



    
    // get deletetimeshedule



     deletetimeshedule:(data,callback)=>{
      
     pool.query(
        'delete from `datetime` WHERE doctorid=?',
        [
            data.doctorid
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }


  pool.query(
        'delete from `keeptimeshedule` WHERE doctorid=?',
        [
            data.doctorid
        ],
        (error,results1,fields)=>{
            if(error){
              return callback(error)
            }


             return callback(null, results1[0]);

        }
     ); 

           
  ///return callback(null, results[0]);

 


    
        }
     ); 

    },



        //  addleavedate



     addleavedate:(data,callback)=>{
      const datetimeid=0;
      
     pool.query(
        'insert into `offday`(date,datetimeid,doctorid)values(?,?,?)',
        [
            data.date,
              datetimeid,
                data.doctorid
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }




           
  return callback(null, results[0]);

 


    
        }
     ); 

    },



           //  regdoctor



     regdoctor:(data,callback)=>{
      const datetimeid=0;
      
     pool.query(
        'SELECT doctor.*,category.name as catname,nearestlocation.locationname as nearloc FROM `doctor`,category,nearestlocation where doctor.categoryid=category.id and doctor.nearestlocationid=nearestlocation.id and doctor.username=?',
        [
            data.username,
            
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
console.log("hsid---"+results[0]["hospitalid"]);

            if(results[0]["hospitalid"]==0){
                return callback(null, results[0]);

            }else{


                 pool.query(
        'SELECT doctor.*,category.name as catname,nearestlocation.locationname as nearloc,hospital.name as hsname FROM `doctor`,category,nearestlocation,hospital where doctor.categoryid=category.id and doctor.nearestlocationid=nearestlocation.id and doctor.hospitalid=hospital.id and doctor.username=?',
        [
            data.username,
            
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }
 return callback(null, results[0]);
            
        }
     ); 

            }



 //return callback(null, results[0]);
           


 


    
        }
     ); 

    },



    
        //  updatetstaus



     updatetstaus:(data,callback,callback2,email,name)=>{
      const datetimeid=0;
      
     pool.query(
        'update booking set status=? where id=?',
        [
            data.status,
                data.id
        ],


        (error,results,fields)=>{
            if(error){
              return callback(error)
            }


     


pool.query(
        'select * from booking where id=?',
        [
            data.id,
        ],
        (error,results2,fields)=>{
            if(error){
              return callback(error)
            }


pool.query(
        'select * from registration where mobileno=?',
        [
            results2[0]["mobileno"],
        ],
        (error,results3,fields)=>{
            if(error){
              return callback(error)
            }


//    return callback(null,results1,results2[0]["name"],results2[0]["email"])
           
  return callback(null, results[0],results2[0],results3[0]["email"],results3[0]["name"]);

 
   }
     ); 
    }
     ); 
    
        }
     ); 

    },

    /// update status

    
     updatestaus:(data,callback)=>{

      console.log("sssssssssssserbee");
           const isactive=1;
     pool.query(
        'update login set isactive=? where mobileno=?',
        [
           isactive ,
            data
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

           // console.log(results[0]["type"]);

           


                // Inserting into the login table with static type value
      
           // console.log("assee");
            
           // return callback(null,results)
            return callback(null, results[0]);
        }
     ); 
    },



    /// update profile

    // add hospital

 updateprofile:(req,imageUrl,callback)=>{



  const body=req.body;
  // const isactive=1
  /// const imageUrl = `https://${process.env.DB_HOST}:${process.env.APP_PORT}/upload/images/`;
 const locid=parseInt(body.nearestlocationid);
     //console.log("uploaded output---"+imageUrl);
 if(body.type=="2"){


       pool.query(
        'update registration set email=?,name=?,locationid=?,profile=? where mobileno=?',
        [
        body.email,body.name,locid,imageUrl,body.mobileno,
        ],

        //og path of posting image
      //  ,'http://'+process.env.DB_HOST+':'+process.env.APP_PORT+'/upload/hospitalimages/'+req.file.filename,
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

   return callback(null,results[0])
        }
     ); 
 }else{


       pool.query(
        'update registration set email=?,name=?,locationid=? where mobileno=?',
        [
       body.email,body.name,locid,body.mobileno,
        ],

        //og path of posting image
      //  ,'http://'+process.env.DB_HOST+':'+process.env.APP_PORT+'/upload/hospitalimages/'+req.file.filename,
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

 
        return callback(null,results[0])
        }
     ); 


 }
    },


    
     updatembno:(data,callback)=>{
      const datetimeid=0;
      
     pool.query(
        'update doctor set isvisiblephone=? where username=?',
        [
          data.type,
            data.username,
            
        ],
        (error,results,fields)=>{
            if(error){
              return callback(error)
            }

           
                return callback(null, results[0]);

       


 //return callback(null, results[0]);
           


 


    
        }
     ); 

    },



    


}

// functions for timeintervelll

function splitTimeWithTokenCount(startTime, endTime, tokenCount) {

  console.log("sttime----"+startTime);
    console.log("sttime----"+endTime);
    // const start = new Date(`01/01/1970 ${startTime}`);
    // const end = new Date(`01/01/1970 ${endTime}`);
    
    // const start = new Date(`1970/01/01 ${startTime}`);
    // const end = new Date(`1970/01/01 ${endTime}`);

    // const start = new Date(`01/01/1970 ${startTime}`);
    // const end = new Date(`01/01/1970 ${endTime}`);
    //   const start = new Date(`1970-01-01T${startTime}:00`);
    // const end = new Date(`1970-01-01T${endTime}:00`);

      // Parse start and end time manually
    // const startParts = startTime.split(':').map(Number);
    // const endParts = endTime.split(':').map(Number);

    // const start = new Date(1970, 0, 1, startParts[0], startParts[1], 0);
    // const end = new Date(1970, 0, 1, endParts[0], endParts[1], 0);

    //   console.log("Parsed start time:", start);
    // console.log("Parsed end time:", end);

    
    // Ensure consistent formatting and remove any unwanted characters
    startTime = startTime.trim(); // Trim any leading/trailing whitespace
    endTime = endTime.trim();

    // Assuming time strings are in the format "HH:mm AM/PM"
    // Manually parse the time strings
    const startParts = startTime.split(':');
    let startHours = parseInt(startParts[0]); //removed const
    const startMinutes = parseInt(startParts[1]);
    const isStartPM = startTime.includes("PM");
    
    const endParts = endTime.split(':');
    let endHours = parseInt(endParts[0]);
    const endMinutes = parseInt(endParts[1]);
    const isEndPM = endTime.includes("PM");

    // Adjust hours for PM times
    if (isStartPM && startHours !== 12) {
        startHours += 12;
    }
    if (isEndPM && endHours !== 12) {
        endHours += 12;
    }

    const start = new Date(1970, 0, 1, startHours, startMinutes, 0);
    const end = new Date(1970, 0, 1, endHours, endMinutes, 0);

    console.log("Parsed start time:", start);
    console.log("Parsed end time:", end);

    const timeDiff = (end.getTime() - start.getTime()) / 1000; // Time difference in seconds
    const intervalSeconds = timeDiff / tokenCount; // Interval in seconds

    const intervals = [];
      let tokeunt = 1;
    for (let i = 0; i < tokenCount; i++) {
        const intervalStart = new Date(start.getTime() + (intervalSeconds * i) * 1000);
        const intervalEnd = new Date(start.getTime() + (intervalSeconds * (i + 1)) * 1000);
         const intervalTokenCount = Math.ceil(tokenCount / intervalSeconds);
        intervals.push({
            startTime: intervalStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: intervalEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            //tokenCount: Math.ceil(tokenCount / (end.getTime() - start.getTime()) * intervalSeconds)
              tokenCount: tokeunt++
        });
    }

    return intervals;
}
async function insertIntervals(pool,intervalList,callback) {
 const  resulttt=[];

  let completedOperations = 0;
  const success=0;
for (const intervalData of intervalList) {



 pool.query(
        'INSERT INTO `keeptimeshedule`(`day`, `time`, `tockencount`, `doctorid`) VALUES (?,?,?,?)',
        [
           intervalData.dayOfWeek,intervalData.startTime+" - "+intervalData.endTime,intervalData.tokenCount,intervalData.doctorId,
        ],

   ); 

    


   const intervals = splitTimeWithTokenCount(intervalData.startTime, intervalData.endTime, intervalData.tokenCount);
  const isactive=1;
    

        for (const interval of intervals) {

  console.log("iflooppp----:"+interval.startTime);
          
            await pool.query(
                'INSERT INTO `datetime`(`doctorid`, `day`, `timefrom`, `timeto`, `tockencount`, `isactive`) VALUES (?, ?, ?, ?, ?,?)',
                [intervalData.doctorId, intervalData.dayOfWeek, interval.startTime, interval.endTime, interval.tokenCount,isactive],
                (error, results, fields) => {
                    if (error) {
                         callback(error, null);
                         return;
                    }

                     resulttt.push(results);                  
                }
            );
        }

        //await pool.end();
        console.log('Data inserted successfully.');
 
}
callback(null,resulttt)
}



