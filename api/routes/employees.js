const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const multer=require('multer');
const jwt=require('jsonwebtoken');

const Employee=require('../models/employee');
mongoose.set('useCreateIndex', true);

const storage=multer.diskStorage({ 
    destination: function(req, file, cb){
        cb(null, './images');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter=(req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload=multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/create', (req,res,next) => {
    Employee.find({email: req.body.email, Phone:req.body.phone})
    .exec()
    .then(employee => {
        // console.log("1");
        if(employee.length >= 1){
            // console.log("2");
            return res.status(409).json({
                message: 'Email OR Phone Already exists'
            });
        }else{
            // console.log("3");
            // console.log("5");
            const employee=new Employee({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                employeeCode:req.body.employeeCode,
                phone:req.body.phone,
                email:req.body.email
                // imagePath: req.file.path
            });
            employee
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Employee Created',
                });
            })
            .catch(err => {
                console.log("Hello");
                res.status(500).json({
                    error: err
                });
                console.log(err);
            });
        }
    })
});


router.delete('/:email',(req,res,next) => {
    // res.status(200).json({
    //     message: 'deleted Product!'
    // });
    const emailID=req.params.email;
    Employee.remove({email: emailID}).exec().then(result => {
        res.status(200).json({
            message: 'Employee Deleted',
            request: {
                type: 'DELETE'
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
    

router.get('/',(req,res,next) => {
    Employee.find().select('firstName lastName employeeCode phone email imagePath').exec().then(docs => {
        const response={
            count: docs.length,
            employee: docs.map(doc => {
                return{
                    firstName: doc.firstName,
                    lastName: doc.lastName,
                    employeeCode: doc.employeeCode,
                    phone: doc.phone,
                    email: doc.email,
                    imagePath: doc.imagePath
                }
            })
        };
        console.log(docs);
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.patch('/:email', (req,res,next) => {
    const emails=req.params.email;
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    const ecode=req.body.employeeCode;
    const ph=req.body.phone;
    // if(req.body.imagePath){
    //     const imgpath=req.file.path;
    // }else{
    //     const imgpath="";
    // }
    // for(const ops of req.body){
    //     updateOps[ops.propName]=ops.value;
    // }
    Employee.update({email: emails}, {$set: {firstName:fname,lastName:lname,employeeCode:ecode,phone:ph}}).exec().then(result => {
        res.status(200).json({
            message: 'Employee Updated'
        });
    }).catch(err => {
        error: err
    });
});

module.exports=router;