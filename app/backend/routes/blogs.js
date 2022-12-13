const express = require('express');

const blogController = require("../controllers/blogs");

const checkAuth = require('../middleware/chech-auth');
const extractFile = require('../middleware/file');


const router = express.Router();

router.post("", checkAuth, extractFile, blogController.createBlog);

router.put("/:id", checkAuth, extractFile, blogController.updateBlog);

router.get('', blogController.getAllBlog);

router.get("/:id", blogController.getBlog)

router.delete('/:id', checkAuth, blogController.deleteBlog);


module.exports = router;
