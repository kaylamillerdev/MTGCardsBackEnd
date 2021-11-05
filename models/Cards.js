import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('Cards', {
    CardID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    Type: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    'Color(s)': {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ConvertedManaCost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Power: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Toughness: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Rarity: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    SetName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    Printing: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Cards',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CardID" },
        ]
      },
      {
        name: "CardID_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CardID" },
        ]
      },
    ]
  });
};
