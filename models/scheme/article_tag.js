module.exports = (sequelize, DataType) => {
  const ArticleTag = sequelize.define('Article_Tag', {
    post_id: {
      type: DataType.INTEGER,
    },
    tag_id: {
      type: DataType.INTEGER,
    },
  });

  ArticleTag.associate = (models) => {
    ArticleTag.belongsTo(models.Tag, { foreignKey: 'tag_id' });
    ArticleTag.belongsTo(models.Article, { foreignKey: 'post_id' });
  };

  return ArticleTag;
};

