const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const { errorHandler } = require("../helpers/dbErrorHandler");
const formidable = require("formidable");
const slugify = require("slugify");
const fs = require("fs");
const _ = require("lodash");
const stripHtml = require("string-strip-html");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload"
      });
    }
    const { title, body, categories, tags } = fields;
    if(!title||title.length===0){
      return res.status(400).json({
        error:"Title is Required."
      })
    }
    if(!body||body.length < 200){
      return res.status(400).json({
        error:"Blog is too short. Minimum 200 characters required."
      })
    }
    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    blog.mdesc = stripHtml(body.substring(0, 160));
    blog.postedBy = req.user._id;
    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image size should be less than 1MB"
        });
      }  
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }
    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};
