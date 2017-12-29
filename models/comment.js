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

const getCommentaryList = async (properties, articleId) => {
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
