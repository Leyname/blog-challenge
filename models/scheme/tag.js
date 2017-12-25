module.exports = (sequelize, DataType) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Tag.associate = (models) => {
    Tag.hasMany(models.Article_Tag);
  };

  return Tag;
};
