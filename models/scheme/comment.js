module.exports = (sequelize, DataType) => {
  const Commentary = sequelize.define('Commentary', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataType.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    post_id: {
      type: DataType.INTEGER,
    },
    author_id: {
      type: DataType.INTEGER,
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    },
  });

  Commentary.associate = (models) => {
    Commentary.belongsTo(models.User, { foreignKey: 'author_id' });
    Commentary.belongsTo(models.Article, { foreignKey: 'post_id' });
  };

  return Commentary;
};
