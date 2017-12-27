const { models: { Commentary: commentary } } = require('../common/db');
const { Op } = require('sequelize');

const addNewCommentary = async (message, articleId, authorId) => {
  const newArticle = await commentary.create({
    message,
    post_id: articleId,
    author_id: authorId,
  });
  return newArticle.toJSON();
};
/*
const getCommentarytList = async articleId =>
  commentary.findAll({
    where: {
      post_id: articleId,
    },
    attributes: ['id', 'message', 'post_id', 'author_id', 'created_at', 'updated_at'],
  }); */

const getCommentaryList = async (properties, articleId) => {
/*
  Фильтр: comments?skip=0&limit=3&message=ha&author=1&sort=updated_at&order=desc
  Пример сформированного параметра для findAll:
  { offset: '0',
    limit: '3',
    order: [ [ 'updated_at', 'asc' ] ],
    where:
    { post_id: '8',
    message: { [Symbol(like)]: '%ha%' },
    author_id: '1' },
    attributes: [ 'id', 'message', 'author_id', 'created_at', 'updated_at' ] }
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
  filter.where.post_id = articleId;

  if (properties.message !== undefined) {
    filter.where.message = {};
    filter.where.message[Op.like] = `%${properties.message}%`;
  }

  if (properties.author !== undefined) {
    filter.where.author_id = properties.author;
  }

  filter.attributes = ['id', 'message', 'post_id', 'author_id', 'created_at', 'updated_at'];

  console.log(filter);

  const commentaries = await commentary.findAll(filter);

  return commentaries;
};

const getCommentaryById = async id =>
  commentary.findOne({
    where: {
      id,
    },
    attributes: ['id', 'message', 'post_id', 'author_id', 'created_at', 'updated_at'],
  });

const findCommentaryById = async id =>
  commentary.findById(id);

const deleteCommentaryById = async id =>
  commentary.destroy({
    where: {
      id,
    },
  });

module.exports = {
  addNewCommentary,
  getCommentaryList,
  getCommentaryById,
  findCommentaryById,
  deleteCommentaryById,
};
