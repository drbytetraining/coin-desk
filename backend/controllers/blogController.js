const Joi = require("joi");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const fs = require("fs");
const Blog = require('../models/blog')
const {BACKEND_SERVER_PATH} = require('../config/index');
const BlogDTO = require('../dto/blog');
const BlogDetailsDTO = require("../dto/blog-details");

const blogController = {
  async create(req, res, next) {
    // validate reqs body
    // handle photo storage
    // save to database
    // response

    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    // user will send it in base64 encoded string, we will decode it and then save it in mongodb
    // base 64 => image file into text form
    // image => base64 hexadecimal data=> binary = >
    // =>GROUP BINARY data into 6 blocks => 6 block into 6 decimal numbers => then into character
    // prevent from making separate end point


    // base64 string examples 
    // gist.github.com/ondrek/7413434

    const { error } = createBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;

    // read as buffer
    // alot random name
    // save locally

    //   read as buffer
    // reg expression meta data , type , base 64
   const buffer =  Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),"base64");

    // alot random name
    const imagePath =  `${Date.now()}-${author}.png`;

    // save image locally
    try{
        fs.writeFileSync(`storage/${imagePath}`, buffer);
    }catch(error){
        return next(error)
    }

    // save blog in db
    let newBlog;
    try{
        newBlog = new Blog({
            title: title,
            author,
            content,
            photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`, // http://localhost:7000/storage/12-03-2023-12:30:03-123abc.png
          });

          await newBlog.save()
    }
    catch(error){
        return next(error)
    }
    

    const blogDto = new BlogDTO(newBlog)
    return res.status(201).json({blog:blogDto})



},

  async getAll(req, res, next) {
    try{
        const blogs = await Blog.find();
        console.log(blogs.length)
        const blogsDto = [];
                      // 0 < 1 ; 0++
                      //1<1  
        for(let i=0; i < blogs.length; i++){
            const dto = new BlogDTO(blogs[i]);

            blogsDto.push(dto)
        }

        return res.status(200).json({blogs: blogsDto})

        
    }
    catch(error){
        return next(error)
    }
  },








  async getById(req, res, next) {

  },

  
  async update(req, res, next) {},
  async delete(req, res, next) {},
};

module.exports = blogController;
 