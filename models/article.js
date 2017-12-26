const { models: { Article: article } } = require('../common/db');

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

const getPubicArticles = async () =>
  article.findAll({
    where: {
      status: 'public',
    },
    attributes: ['id', 'title', 'text', 'author_id', 'created_at', 'updated_at'],
  });

const getArticlesByAuthor = async authorId =>
  article.findAll({
    where: {
      author_id: authorId,
    },
    attributes: ['id', 'title', 'text', 'status', 'created_at', 'updated_at'],
  });

const deleteArticleById = async id =>
  article.destroy({
    where: {
      id,
    },
  });

const findArticleById = async id =>
  article.findById(id);

const filterPublicArticles = async (properties) => {
  /*
  Фильтр: articles?skip=0&limit=3&q=Hi!&author=1&sort=updated_at&order=desc
  Пример сформированного параметра для findAll:
  { offset: '0',
    limit: '3',
    order: [ [ 'updated_at', 'asc' ] ],
    where: { title: 'Hi!', author_id: '1' },
    attributes: [ 'id', 'title', 'text', 'author_id', 'created_at', 'updated_at' ] }
  */

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

  if (properties.q !== undefined) {
    filter.where = {};
    filter.where.title = properties.q;
  }

  if (properties.author !== undefined) {
    if (filter.where === undefined) {
      filter.where = {};
    }
    filter.where.author_id = properties.author;
  }

  filter.attributes = ['id', 'title', 'text', 'author_id', 'created_at', 'updated_at'];

  console.log(filter);

  const articles = await article.findAll(filter);

  return articles;
};

const filterArticlesByAuthor = async (properties, authorId) => {
  /*
  Фильтр: my?skip=0&limit=3&q=Hi!&status=public&sort=updated_at&order=desc
  Пример сформированного параметра для findAll:
  { offset: '0',
    limit: '3',
    order: [ [ 'updated_at', 'desc' ] ],
    where: { author_id: 1, title: 'Hi!', status: 'public' },
    attributes: [ 'id', 'title', 'text', 'author_id', 'created_at', 'updated_at' ] }
  */

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
    filter.where.title = properties.q;
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
  getPubicArticles,
  getArticlesByAuthor,
  deleteArticleById,
  findArticleById,
  filterPublicArticles,
  filterArticlesByAuthor,
};
