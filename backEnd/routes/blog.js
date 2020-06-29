const express = require("express");
const router = express.Router();
const {create, list, read, listAllBlogsCategoriesTags, update, remove, photo, listRelated} = require('../controllers/blog')
const {requireSignIn,adminMiddleWare}= require('../controllers/auth')

router.post("/blog",requireSignIn, adminMiddleWare, create); // post a blog
router.get("/blogs", list); // list all blogs
router.get("/blog/:slug", read); // find given blog
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags); // find blog with categories and tags for SEO 
router.put("/blog/:slug",requireSignIn, adminMiddleWare, update); // update a blog
router.delete("/blog/:slug",requireSignIn, adminMiddleWare, remove); // delete a blog
router.get("/blog/photo/:slug", photo); // get photo of a blog
router.post("/blogs/related", listRelated); // find given blog

module.exports = router;
