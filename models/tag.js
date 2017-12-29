const {
  models: {
    Tag,
    Article_Tag,
  },
} = require('../common/db');

const addNewTag = async (name) => {
  const newTag = await Tag.create({
    name,
  });
  return newTag.toJSON();
};

const addBindArticleTag = async (postId, tagId) => {
  const newArticleTag = await Article_Tag.create({
    post_id: postId,
    tag_id: tagId,
  });
  return newArticleTag.toJSON();
};

const findTagByName = name =>
  Tag.findOne({
    where: {
      name,
    },
  });

const getPostCountTagById = async tagId =>
  Article_Tag.count({
    where: {
      tag_id: tagId,
    },
  });

const getTagsCloud = async () => {
  const tagsCloud = [];
  const tags = Tag.findAll();
/*
  tags.forEach((tag) => {
    tagsCloud[] = {
      tag: tag.name,
      post_count: getPostCountTagById(tag.id),
    };
  }); */
};

module.exports = {
  addNewTag,
  addBindArticleTag,
  findTagByName,
  getTagsCloud,
};
