const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 5);

module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        id: {
            type: DataTypes.STRING(5),
            // defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => nanoid()
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nisn: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        parent_id: {
            type: DataTypes.STRING(5),
            allowNull: true
        }
    }, {
        tableName: 'students',
    });

    Student.associate = (models) => {
        Student.belongsTo(models.User, { foreignKey: 'parent_id', as: 'parent' });
        Student.hasMany(models.Attendance, { foreignKey: 'student_id', as: 'attendance' });
        Student.hasMany(models.StudentEvaluation, { foreignKey: 'student_id', as: 'student_evaluation' });
        Student.hasMany(models.StudentGrade, { foreignKey: 'student_id', as: 'student_grade' });
        Student.hasMany(models.StudentClass, { foreignKey: 'student_id', as: 'student_class' });
        Student.belongsToMany(models.Class, {
            through: 'StudentClass',
            foreignKey: 'student_id',
            as: 'classes'
        });
    };

    return Student;
};
