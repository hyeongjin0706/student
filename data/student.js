import SQ, { Sequelize } from "sequelize";
import {sequelize} from "../db/database.js";
const DataTypes = SQ.DataTypes;

// 학생 테이블 등록
export const Student = sequelize.define(
    "student",
    {
        student_idx:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        student_id:{
            type:DataTypes.STRING(45),
            allowNull:false,
            unique: true
        },
        student_name:{
            type:DataTypes.STRING(128),
            allowNull:false
        },
        student_phone:{
            type:DataTypes.STRING(45),
            allowNull:false
        },
        student_email:{
            type:DataTypes.STRING(128),
            allowNull:false
        },
        student_address:{
            type:DataTypes.STRING(128),
            allowNull:false
        },
        student_regdate:{
            type:DataTypes.DATE, 
            defaultValue: DataTypes.NOW
        }
    },
    {timestamps: false}
);


// 모든 학생 검색
export async function searchAll(Score) {
    // sequelize.query를 사용하여 쿼리문으로 조회
    return sequelize.query("SELECT RANK() OVER(ORDER BY sc.score_total DESC) as '석차', s.student_idx, s.student_id, s.student_name, s.student_phone, s.student_email, s.student_address, s.student_regdate, sc.score_java, sc.score_python, sc.score_c, sc.score_regdate, sc.score_total, sc.score_avg FROM students AS s LEFT JOIN scores AS sc ON s.student_idx = sc.student_idx",
    { type: sequelize.QueryTypes.SELECT })
    .then((result) => {
        return result;
    })
}

// 일렬번호로 조회
export async function searchByIdx(student_idx) {
    return Student.findByPk(student_idx).then((result) => {
        return result
    });
}

// 학번으로 조회
export async function searchById(student_id) {
    return Student.findOne({where: {student_id}}).then((result) => {
        return result
    });
}

// 학생 정보 등록
export async function createStudent(student) {
    return Student.create(student).then((data)=>data.dataValues.student_name);
}

// 학생 정보 수정
export async function updateStudent(student_idx, student_id, student_name, student_phone, student_email, student_address) {
    return Student.findByPk(student_idx).then((student) => {
        student.student_id = student_id;
        student.student_name = student_name;
        student.student_phone = student_phone;
        student.student_email = student_email;
        student.student_address = student_address;
        student.save();
        return student
    });
}

// 학생 정보 삭제
export async function deleteStudent(student_idx) {
    return Student.findByPk(student_idx).then((student) => {
        student.destroy();
    });
}