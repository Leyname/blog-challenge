const { models: { Tag: tag } } = require('../common/db');
const { models: { Article_Tag: articleTag } } = require('../common/db');

const addNewTag = async (name) => {
  const newTag = await tag.create({
    name,
  });
  return newTag.toJSON();
};

const addBindArticleTag = async (postId, tagId) => {
  const newArticleTag = await articleTag.create({
    post_id: postId,
    tag_id: tagId,
  });
  return newArticleTag.toJSON();
};

const findTagByName = name =>
  tag.findOne({
    where: {
      name,
    },
  });

const getTagsCloud = async () => {
  const tagsCloud = [];
  const tags = tag.findAll();

  for (let i; i < Object.keys(tags).length; i++) {
    tagsCloud[i] = {
      tag: tags.name,
      post_count: 10,
    };
  }

  tags.forEach(async (tag) => {

  });
  tagsCloud[0] = {
    tag: 'tagname',
    post_count: 10,
  };
};

const getPostCountTagById = async tagId =>
  articleTag.count({
    where: {
      tag_id: tagId,
    },
  });

module.exports = {
  addNewTag,
  addBindArticleTag,
  findTagByName,
  // getTagsCloud,
};
