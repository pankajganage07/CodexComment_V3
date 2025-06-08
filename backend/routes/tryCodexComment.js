const express = require("express");

const router = express.Router();

const {model,codeCheck} = require("../model/model")


router.post("/generateComment",  async (req, res) => {
    const { code } = req.body;
  
    try {
      
     
      
      const codeCheckResult= await codeCheck(code);

      console.log(codeCheckResult.response.text());


  
      
  
      if ( codeCheckResult.response.text() == "Yes\n" ||codeCheckResult.response.text() == "yes\n") {
        
        
        const result= await model(code);
        
  
        res.json({
          msg: "Comment generated successfully",
          comment: result.response.text(),
        });
      }
      else{
          res.json({
              msg: "Unknown programming language",
              
            });
      }
    } catch (error) {
      console.log("Error generating comment:", error.message || error);
      res.json({
        msg: "Error generating comment",
        error: error.message,
      });
    }
  });



module.exports = router