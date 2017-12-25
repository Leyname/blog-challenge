const { models: { Article: article } } = require('../common/db');

const addNewArticle = async (articledata, authorId) => {
  const newArticle = await article.create({
    title: articledata.title,
    text: articledata.text,
    status: articledata.status,
    author_id: authorId,
  });
  return newArticle.toJSON();
};

const getPubicArticles = async () =>
  article.findOne({
    where: {
      status: 'public',
    },
  });

const getArticlesByAuthor = async authorId =>
  article.findOne({
    where: {
      author_id: authorId,
    },
  });

const deleteArticleById = async id =>
  article.destroy({
    where: {
      id,
    },
  });

module.exports = {
  addNewArticle,
  getPubicArticles,
  getArticlesByAuthor,
  deleteArticleById,
};
