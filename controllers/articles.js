const articles = require('../models/article');
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
    console.log(affectedCount);
    if (affectedCount[0] > 0) {
      res.data = { success: true };
      return next();
    }

    throw { success: false, message: 'Editing in not done' };
  } else {
    throw { success: false, message: 'no rights to edit this article' };
  }
};

const addArticle = async (req, res, next) => {
  const token = req.headers.authorization.slice(4);
  const decodedId = await jwt.decode(token);
  await articles.addNewArticle(req.body, decodedId.id);
  res.data = { success: true };
  next();
};

const getPubicArticles = async (req, res, next) => {
  if ((Object.keys(req.query).length) === 0) {
    const publicArticles = await articles.getPubicArticles();
    res.data = publicArticles;
    next();
  }
  const filteringArticles = await articles.filterPublicArticles(req.query);
  res.data = filteringArticles;
  next();
};

const getMyArticles = async (req, res, next) => {
  const token = req.headers.authorization.slice(4);
  const decodedId = await jwt.decode(token);
  if ((Object.keys(req.query).length) === 0) {
    const myArticles = await articles.getArticlesByAuthor(decodedId.id);
    res.data = myArticles;
    next();
  }
  const filteringArticles = await articles.filterArticlesByAuthor(req.query, decodedId.id);
  res.data = filteringArticles;
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

module.exports = {
  editArticle,
  addArticle,
  getPubicArticles,
  getMyArticles,
  deleteArticles,
};
