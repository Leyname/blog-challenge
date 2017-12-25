module.exports = (sequelize, DataType) => {
  const User = sequelize.define('User', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    last_name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    salt: {
      type: DataType.STRING,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      defaultValue: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    status: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Article);
    User.hasMany(models.Commentary);
  };

  return User;
};
