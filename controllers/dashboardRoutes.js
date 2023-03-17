const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, Comment, User } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      where: {
        
        user_id: req.session.user_id,
      },
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'blog_id',
            'user_id',
            'created_at'
          ],
          include: {
            model: User,
            attributes: ['username', 'twitter', 'github']
          }
        },
        {
          model: User,
          attributes: ['username', 'twitter', 'github']
        },
      ],
    });

   
    const blogs = blogData.map(blog => blog.get({ plain: true }));

    
    res.render('dashboard', {
      blogs,
      loggedIn: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'title', 'created_at', 'content'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'blog_id',
            'user_id',
            'created_at',
          ],
          include: {
            model: User,
            attributes: ['username', 'twitter', 'github'],
          },
        },
        {
          model: User,
          attributes: ['username', 'twitter', 'github'],
        },
      ],
    });
    if (!blogData) {
      res.status(404).json({ message: 'No Blog found with this id' });
      return;
    }
    const blog = blogData.get({ plain: true });
    res.render('edit-blog', {
      blog,
      loggedIn: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/create/', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ['id', 'title', 'created_at', 'content'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'blog_id',
            'user_id',
            'created_at',
          ],
          include: {
            model: User,
            attributes: ['username', 'twitter', 'github'],
          },
        },
        {
          model: User,
          attributes: ['username', 'twitter', 'github'],
        },
      ],
    });
    const blogs = blogData.map(blog => blog.get({ plain: true }));
    res.render('create-blog', {
      blogs,
      loggedIn: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;