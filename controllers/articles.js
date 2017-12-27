const articles = require('../models/article');
const commentaries = require('../models/comment');

const editArticle = async (req, res, next) => {
  const {
    params: {
      id: articleId,
    },
  } = req;
  const {
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
    const affectedCount = await articles.editArticleById(req.body, articleId);

    if (affectedCount[0] > 0) {
      res.data = {
        success: true,
      };
      return next();
    }

    throw {
      success: false,
      message: 'Editing in not done',
    };
  } else {
    throw {
      success: false,
      message: 'no rights to edit this article',
    };
  }
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
  const {
    user: {
      id: userId,
    },
  } = req;
  if ((Object.keys(req.query).length) === 0) {
    const myArticles = await articles.getArticlesByAuthor(userId);
    res.data = myArticles;
    next();
  }
  const filteringArticles = await articles.filterArticlesByAuthor(req.query, userId);
  res.data = filteringArticles;
  next();
};

const deleteArticles = async (req, res, next) => {
  const {
    params: {
      id: articleId,
    },
  } = req;
  const {
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

const addComment = async (req, res, next) => {
  const {
    params: {
      id: articleId,
    },
  } = req;
  const {
    user: {
      id: userId,
    },
  } = req;
  await commentaries.addNewCommentary(req.body.message, articleId, userId);
  res.data = {
    success: true,
  };
  next();
};

const getCommentList = async (req, res, next) => {
  const {
    params: {
      id: articleId,
    },
  } = req;
  const сomments = await commentaries.getCommentaryList(req.query, articleId);
  res.data = сomments;
  next();
};

const getComment = async (req, res, next) => {
  const {
    params: {
      id: commentId,
    },
  } = req;
  const comment = await commentaries.getCommentaryById(commentId);
  res.data = comment;
  next();
};

const deleteComment = async (req, res, next) => {
  const {
    params: {
      id: articleId,
      commentId,
    },
  } = req;
  const {
    user: {
      id: userId,
    },
  } = req;
  const article = await articles.findArticleById(articleId);
  const comment = await commentaries.findCommentaryById(commentId);

  if (!article) {
    throw {
      success: false,
      message: 'article is not found',
    };
  }

  if (!comment) {
    throw {
      success: false,
      message: 'comment is not found',
    };
  }

  if ((comment.author_id === userId) || (article.author_id === userId)) {
    await commentaries.deleteCommentaryById(commentId);
    res.data = {
      success: true,
    };
    next();
  } else {
    throw {
      success: false,
      message: 'no rights to delete this commentary',
    };
  }
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
