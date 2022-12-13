const Blog = require('../models/Blogs');


exports.createBlog = (req, res) => {
  const url = req.protocol + '://' + req.get('host');

  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  blog.save().then(createdBlog => {
    res.status(201).json({
      message: 'Blog added successfully!',
      blog: {
        ...createdBlog,
        id: createdBlog._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a blog faild!'
    })
  })
};

exports.updateBlog = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + 'blogs' + '/images/' + req.file.filename
  }
  const blog = new Blog({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })

  Blog.updateOne({_id: req.params.id, creator: req.userData.userId}, blog)
  .then(result => {
    if(result.matchedCount > 0) {
      res.status(200).json({
        message: 'Update successful!'
      })
    }else{
      res.status(401).json({message: 'Not authorzied'})
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Couldn\'t update post!'
      })
    })
};

exports.getAllBlog = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const blogQuery = Blog.find();
  let fetchedBlogs;
  if(pageSize && currentPage) {
    blogQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  blogQuery.find()
  .then(documents => {
    fetchedBlogs = documents;
    return Blog.count();
  })
    .then(count => {
      res.status(200).json({
        message: 'Ads fetched successfully!',
        blogs: fetchedBlogs,
        maxBlogs: count
      })
    })
};

exports.deleteBlog = (req, res, next) => {
  Blog.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.deletedCount > 0) {
      res.status(200).json({message: 'Deletion successful!'})
    }else{
      res.status(401).json({message: 'Not authorzied'})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching ads failed!'
    })
  })
};

exports.getBlog = (req, res, next) => {
  console.log(`here`);
  Blog.findById(req.params.id).then(blog => {
    if(blog) {
      res.status(200).json(blog)
    }else{
      console.log(`here`);
      res.status(404).json({
        message: "Blog not found!"
      })
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching blogs failed!'
    });
  })
};
