const express=require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');


const employeeRoutes=require('./api/routes/employees');
// const productOrders=require('./api/routes/orders');
// const userRoutes=require('./api/routes/user');
// const museumRoutes=require('./api/routes/museums');

mongoose.connect('mongodb://localhost/Employee', {useNewUrlParser:true});
const db=mongoose.Collection;
mongoose.Promise=global.Promise;

app.use(morgan('dev'));
// app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({});
    }
    next();
});

app.use('/emp',employeeRoutes);
// app.use('/orders',productOrders);
// app.use('/user',userRoutes);
// app.use('/museums',museumRoutes);

app.use((req,res,next) => {
    const error=new Error('Not Found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports=app;