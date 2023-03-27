import { Router, Request } from "express";
import mongoose from "mongoose";
import CustomerController from "./controllers";
import multer from 'multer';
import s3utils from '../utils/s3';

// Note: we should use a try/catch to choose successJson or errorJson for responses
// this has been left out of this snippet for brevity
import { successJson, errorJson } from "../utils/jsonResponses";

const customerRouter = Router();

const upload = multer({ dest: 'uploads/' });
const fs = require('fs').promises;

customerRouter.post('/uploadImage', upload.single('image'), async (req, res) => {
  // Note: the upload.single('image') is the Multer middleware, this will ensure that the file
  // has been downloaded into the /uploads folder
  try{
    const file = req.file;
    // We should check if the file exists, if it doesn't, return an error
    if(!file){
      res.send(errorJson("No file uploaded"));
      return;
    }
    
    // Now we send the file to S3 using our s3utils
    // 'name' is the text entered into the input field
    // and this is what the name of the file will be in s3
    const name = req.body.name;
    const result = await s3utils.uploadFile(file, name);
    // Now we delete the file from the /uploads folder since it has been uploaded
    await fs.unlink(file.path);
    // Here you can return anything, I'm choosing to return the path to the image
    res.send(successJson({imagePath: `images/${result.key}`}));
  }catch (error){
    res.send(errorJson(error));
  }
})

customerRouter.post("/", async (req, res) => {
  const { name, age, title, company } = req.body;
  res.send(
    successJson(
      await CustomerController.insertCustomer(name, age, title, company)
    )
  );
});

customerRouter.post("/updateName/:id", async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const name = req.body.name;
  res.send(successJson(await CustomerController.updateName(id, name)));
});

customerRouter.post("/resetAges", async (req, res) => {
  const numResets = await CustomerController.resetAges();
  res.send(successJson(numResets));
});

export default customerRouter;
