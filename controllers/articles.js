const articles = require('../models/article');
const tagsModel = require('../models/tag');
const jwt = require('jsonwebtoken');

const editArticle = async (req, res, next) => {
  const { params: { id: articleId } } = req;
  const token = req.headers.authorization.slice(4);
  const decodedId = await jwt.decode(token);
  const article = await articles.findArticleById(articleId);

  if (!article) {
    throw { success: false, message: 'article is not found' };
  }

  if (article.author_id === decodedId.id) {
    const affectedCount = await articles.editArticleById(req.body, articleId);

    if (affectedCount[0] > 0) {
      res.data = { success: true };
      return next();
    }

    throw { success: false, message: 'Editing is not done' };
  } else {
    throw { success: false, message: 'no rights to edit this article' };
  }
};

const addArticle = async (req, res, next) => {
  const token = req.headers.authorization.slice(4);
  const decodedId = await jwt.decode(token);
  const { body: { tags } } = req;
  const { id: articleId } = await articles.addNewArticle(req.body, decodedId.id);
  if (tags !== undefined) {
    tags.forEach(async (name) => {
      const tag = await tagsModel.findTagByName(name);
      if (tag === null) {
        const { id: tagId } = await tagsModel.addNewTag(name);
        await tagsModel.addBindArticleTag(articleId, tagId);
      } else {
        await tagsModel.addBindArticleTag(articleId, tag.id);
      }
    });
  }

  res.data = { success: true };
  next();
};

const getPubicArticles = async (req, res, next) => {
  const articlesList = await articles.getPublicArticles(req.query);
  res.data = articlesList;
  next();
};

const getMyArticles = async (req, res, next) => {
  const token = req.headers.authorization.slice(4);
  const decodedId = await jwt.decode(token);
  const articlesList = await articles.getArticlesByAuthor(req.query, decodedId.id);
  res.data = articlesList;
  next();
};

const deleteArticles = async (req, res, next) => {
  const { params: { id: articleId } } = req;
  const token = req.headers.authorization.slice(4);
  const decodedId = await jwt.decode(token);
  const article = await articles.findArticleById(articleId);

  if (!article) {
    throw { success: false, message: 'article is not found' };
  }

  if (article.author_id === decodedId.id) {
    await articles.deleteArticleById(articleId);
    res.data = { success: true };
    next();
  } else {
    throw { success: false, message: 'no rights to delete this article' };
  }
};

const findArticleByTags = async (req, res, next) => {
  const {
    query: {
      tags,
    },
  } = req;
  res.data = { success: true };
  next();
};

const getTagsCloud = async (req, res, next) => {
  const tagsCloud = tagsModel.getTagsCloud();
  res.data = tagsCloud;
  next();
};

module.exports = {
  editArticle,
  addArticle,
  getPubicArticles,
  getMyArticles,
  deleteArticles,
  findArticleByTags,
  getTagsCloud,
};
