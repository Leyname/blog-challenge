const articles = require('../models/article');

const editArticle = async (req, res, next) => {
  const {
    params: {
      id: articleId,
    },
    user: {
      id: userId,
    },
  } = req;

  const article = await articles.findArticleById(articleId);

  if (!article) {
    throw {
      success: false,
      message: 'article is not found',
    };
  }

  if (article.author_id !== userId) {
    throw {
      success: false,
      message: 'no rights to edit this article',
    };
  }

  const affectedCount = await articles.editArticleById(req.body, articleId);

  if (affectedCount[0] > 0) {
    res.data = {
      success: true,
    };
    return next();
  }

  throw {
    success: false,
    message: 'Editing is not done',
  };
};

const addArticle = async (req, res, next) => {
  const {
    user: {
      id: userId,
    },
  } = req;
  await articles.addNewArticle(req.body, userId);

  res.data = {
    success: true,
  };
  next();
};

const getPubicArticles = async (req, res, next) => {
  const articlesList = await articles.getPublicArticles(req.query);
  res.data = articlesList;
  next();
};

const getMyArticles = async (req, res, next) => {
  const {
    user: {
      id: userId,
    },
  } = req;
  const articlesList = await articles.getArticlesByAuthor(req.query, userId);
  res.data = articlesList;
  next();
};

const deleteArticles = async (req, res, next) => {
  const {
    params: {
      id: articleId,
    },
    user: {
      id: userId,
    },
  } = req;
  const article = await articles.findArticleById(articleId);

  if (!article) {
    throw {
      success: false,
      message: 'article is not found',
    };
  }

  if (article.author_id === userId) {
    await articles.deleteArticleById(articleId);
    res.data = {
      success: true,
    };
    next();
  } else {
    throw {
      success: false,
      message: 'no rights to delete this article',
    };
  }
};

module.exports = {
  editArticle,
  addArticle,
  getPubicArticles,
  getMyArticles,
  deleteArticles,
};
