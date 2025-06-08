const express = require("express");

const router = express.Router();

const { User, History } = require("../db/index");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const SECRET = "This is Secret";

const userValidation = require("../middlewares/userValidation");

const {codeCheck,model} = require("../model/model");



const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({
  dest: path.join(__dirname, "uploads"),
});



router.post("/signup", async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.json({
      msg: "username already exists",
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hassPass = await bcrypt.hash(password, salt);
    const newUser = User.create({
      username,
      password: hassPass,
      firstname,
      lastname,
    });
    const token = jwt.sign({ userId: newUser._id }, SECRET);
    res.json({
      msg: "user created successfully",
      token,
    });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (user) {
    if (bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, SECRET);
      res.json({
        msg: "signin scuccessful",
        token,
      });
    } else {
      res.json({
        msg: "invalid credentials",
      });
    }
  } else {
    res.json({
      msg: "invalid credentials",
    });
  }
});

router.post("/generateComment", userValidation, async (req, res) => {
  const { code } = req.body;

  try {
    
   
    
    const codeCheckResult= await codeCheck(code);

    

    if ( codeCheckResult.response.text() == "Yes\n" || codeCheckResult.response.text() == "Yes\n"  ) {
      
      
      const result= await model(code);
      
      const history = await History.create({
        userId: req.userId,
        codeComment: result.response.text(),
      });

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

router.get("/history", userValidation, async (req, res) => {
  
  const history = await History.find({ userId: req.userId });

  res.json({
    history,
  });
});

// Handle file upload and modification
router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  const filePath = file.path; // Multer's generated path
  const fileName = file.originalname;

  try {
    // Ensure the file exists before reading
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    // Read the uploaded file
    let fileContent = fs.readFileSync(filePath, "utf-8");

    
    // // Modify the file content
    const codeCheckResult= await codeCheck(fileContent);
    if ( codeCheckResult.response.text() != "No\n") {
      const result = await model(fileContent);
      const modifiedContent = result.response.text();

      // Respond with the modified file content
      res.setHeader("Content-Disposition", `attachment; filename=modified_${fileName}`);
      res.setHeader("Content-Type", "text/plain");

      res.send(modifiedContent);

      // Clean up the uploaded file
      fs.unlinkSync(filePath);
    }
    else{
      res.json({
          msg: "Error generating comment",
          comment: "Unknown programming language",
        });
    }
    
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send({ error: "Failed to process the file" });
  }
});



module.exports = router;
