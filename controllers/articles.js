const articles = require('../models/article');
const config = require('config');
const jwt = require('jsonwebtoken');

const jwtSecret = config.get('jwtAuth.jwtSecret');
const expireConfig = config.get('redis.expire');

const editArticle = async (req, res, next) => {
  res.data = { success: true };
  next();
};

const addArticle = async (req, res, next) => {
  await articles.addNewArticle(req.body, 1);
  res.data = { success: true };
  next();
};

const getPubicArticles = async (req, res, next) => {
  const { title, text } = await articles.getPubicArticles();
  res.data = { title, text };
  next();
};

const getMyArticles = async (req, res, next) => {
  res.data = { success: true };
  next();
};

const deleteArticles = async (req, res, next) => {
  res.data = { success: true };
  next();
};

const addComment = async (req, res, next) => {
  res.data = { success: true };
  next();
};

const getCommentList = async (req, res, next) => {
  res.data = { success: true };
  next();
};

const getComment = async (req, res, next) => {
  res.data = { success: true };
  next();
};

const deleteComment = async (req, res, next) => {
  res.data = { success: true };
  next();
};

module.exports = {
  editArticle,
  addArticle,
  getPubicArticles,
  getMyArticles,
  deleteArticles,
  addComment,
  getCommentList,
  getComment,
  deleteComment,
};
