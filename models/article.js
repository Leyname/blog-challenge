const { models: { Article: article } } = require('../common/db');
const { Op } = require('sequelize');

const editArticleById = async (articledata, id) =>
  article.update({
    title: articledata.title,
    text: articledata.text,
    status: articledata.status,
  }, {
    where: {
      id,
    },
  });

const addNewArticle = async (articledata, authorId) => {
  const newArticle = await article.create({
    title: articledata.title,
    text: articledata.text,
    status: articledata.status,
    author_id: authorId,
  });
  return newArticle.toJSON();
};

const deleteArticleById = async id =>
  article.destroy({
    where: {
      id,
    },
  });

const findArticleById = async id =>
  article.findById(id);

const getPublicArticles = async (properties) => {
  const filter = {};
  if (properties.skip !== undefined) {
    filter.offset = properties.skip;
  }

  if (properties.limit !== undefined) {
    filter.limit = properties.limit;
  }

  if (properties.sort !== undefined) {
    const order = [];
    order[0] = [];
    order[0][0] = properties.sort;
    order[0][1] = properties.order;
    filter.order = order;
  }

  filter.where = {};
  filter.where.status = 'public';

  if (properties.q !== undefined) {
    filter.where.title = {};
    filter.where.title[Op.like] = `%${properties.q}%`;
  }

  if (properties.author !== undefined) {
    filter.where.author_id = properties.author;
  }

  filter.attributes = ['id', 'title', 'text', 'author_id', 'created_at', 'updated_at'];

  console.log(filter);

  const articles = await article.findAll(filter);

  return articles;
};

const getArticlesByAuthor = async (properties, authorId) => {
  const filter = {};
  if (properties.skip !== undefined) {
    filter.offset = properties.skip;
  }

  if (properties.limit !== undefined) {
    filter.limit = properties.limit;
  }

  if (properties.sort !== undefined) {
    const order = [];
    order[0] = [];
    order[0][0] = properties.sort;
    order[0][1] = properties.order;
    filter.order = order;
  }

  filter.where = {};
  filter.where.author_id = authorId;

  if (properties.q !== undefined) {
    filter.where.title = {};
    filter.where.title[Op.like] = `%${properties.q}%`;
  }

  if (properties.status !== undefined) {
    filter.where.status = properties.status;
  }

  filter.attributes = ['id', 'title', 'text', 'author_id', 'created_at', 'updated_at'];

  console.log(filter);

  const articles = await article.findAll(filter);

  return articles;
};

module.exports = {
  editArticleById,
  addNewArticle,
  deleteArticleById,
  findArticleById,
  getPublicArticles,
  getArticlesByAuthor,
};
