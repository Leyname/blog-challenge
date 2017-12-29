const Articles = require('../models/article');
const Commentaries = require('../models/comment');

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
  const article = await Articles.findArticleById(articleId);

  if (!article) {
    throw {
      success: false,
      message: 'article is not found',
    };
  }

  if (article.author_id === userId) {
    const affectedCount = await Articles.editArticleById(req.body, articleId);

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
  await Articles.addNewArticle(req.body, userId);
  res.data = {
    success: true,
  };
  next();
};

const getPubicArticles = async (req, res, next) => {
  if ((Object.keys(req.query).length) === 0) {
    const publicArticles = await Articles.getPubicArticles();
    res.data = publicArticles;
    next();
  }
  const filteringArticles = await Articles.filterPublicArticles(req.query);
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
    const myArticles = await Articles.getArticlesByAuthor(userId);
    res.data = myArticles;
    next();
  }
  const filteringArticles = await Articles.filterArticlesByAuthor(req.query, userId);
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
  const article = await Articles.findArticleById(articleId);

  if (!article) {
    throw {
      success: false,
      message: 'article is not found',
    };
  }

  if (article.author_id === userId) {
    await Articles.deleteArticleById(articleId);
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
  await Commentaries.addNewCommentary(req.body.message, articleId, userId);
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
  const сomments = await Commentaries.getCommentaryList(req.query, articleId);
  res.data = сomments;
  next();
};

const getComment = async (req, res, next) => {
  const {
    params: {
      id: commentId,
    },
  } = req;
  const comment = await Commentaries.getCommentaryById(commentId);
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
  const article = await Articles.findArticleById(articleId);
  const comment = await Commentaries.findCommentaryById(commentId);

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

  const isUserAuthorOfComment = comment.author_id === userId;
  const isUserOwnerOfArticle = article.author_id === userId;

  if (isUserAuthorOfComment || isUserOwnerOfArticle) {
    await Commentaries.deleteCommentaryById(commentId);
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
