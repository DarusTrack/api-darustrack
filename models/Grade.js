module.exports = (sequelize, DataTypes) => {
    const Grade = sequelize.define('Grade', {
        id: {
            type: DataTypes.INTEGER,
            // defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            autoIncrement: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('Quiz', 'Tugas', 'UTS', 'UAS'),
            allowNull: false
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: null
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: null
        },
        description: {
            type: DataTypes.STRING,
            allowNull: null
        }
    }, {
        tableName: 'grades',
    });

    Grade.associate = (models) => {
        Grade.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
        Grade.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
        Grade.belongsTo(models.Subject, { foreignKey: 'subject_id', as: 'subject' });
    };

    return Grade;
};
