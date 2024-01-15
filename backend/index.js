const express = require("express");
const { connection } = require("./db");
const { UserRouter } = require("./routes/user.route");
const { PostRouter } = require("./routes/post.route");
const { BlackListModel } = require("./model/blacklist");
const cors = require("cors") ;

const app = express();

// middlewares
app.use(express.json());
app.use(cors() ) ;

//routes
app.use("/users" , UserRouter);
app.use("/posts" , PostRouter)

//logout route
app.get("/logout" ,  async (req , res) =>{
const token = req.headers.authorization?.split(" ")[1] ;
if(token) {
 const new_token = new BlackListModel({token}) ;
 await new_token.save() ;
 res.status(200).json({msg : "Logged out"})
}else{
  res.status.json({msg : "You are already logged out"} )
}
})

// starting the server and connect to db
app.listen(8080, async () => {
  try {
    await connection;
    console.log("Conntected to DB");
    console.log("Server Started");
  } catch (error) {
    console.log(error);
  }
});
