import SQ, { Sequelize } from "sequelize";
import { Student } from "./student.js";
import {sequelize} from "../db/database.js";
const DataTypes = SQ.DataTypes;

// 점수 테이블 등록
export const Score = sequelize.define(
    "score",
    {
        score_java:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        score_python:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        score_c:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        score_regdate:{
            type:DataTypes.DATE, 
            defaultValue: DataTypes.NOW
        },
        score_total:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        score_avg:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
    },
    {timestamps: false}
);
// foreign key 등록
Score.belongsTo(Student, { foreignKey: 'student_idx' });
Student.hasOne(Score, { foreignKey: 'student_idx' });

// 점수가 있을경우 출력하는 INCLUDE_STUDENT 상수
const INCLUDE_STUDENT = {
    attributes:[
        [Sequelize.col("student.student_idx"), "student_idx"],
        [Sequelize.col("student.student_id"), "student_id"],
        [Sequelize.col("student.student_name"), "student_name"],
        [Sequelize.col("student.student_phone"), "student_phone"],
        [Sequelize.col("student.student_email"), "student_email"],
        [Sequelize.col("student.student_address"), "student_address"],
        [Sequelize.col("student.student_regdate"), "student_regdate"],
        "score_java",
        "score_python",
        "score_c",
        "score_regdate",
        "score_total",
        "score_avg"
    ],
    include:{
        model:Student,
        attributes: []
    }
}

// 점수가 있을 경우 학생 검색
export async function getByStudentIdx(student_idx) {
    return Score.findOne({
        where:{student_idx},
        ...INCLUDE_STUDENT
    });
}

// 점수 등록
export async function createScore(score) {
    return Score.create(score);
}

// 점수 등록 유무 조회하는 메소드
export async function searchByStudentIdx(student_idx) {
    return Score.findOne({where:{student_idx}});
}

// 학생 일렬번호로 해당 학생의 점수를 찾고 점수를 수정해주는 메소드
export async function updateScore(student_idx, score_java, score_python, score_c, score_total, score_avg) {
    return Score.findOne({where:{student_idx}}).then((score) => {
        score.score_java = score_java;
        score.score_python = score_python;
        score.score_c = score_c;
        score.score_total = score_total;
        score.score_avg = score_avg;
        score.save();
        return score;
    });
}

// 학생 일렬번호로 점수 제거
export async function deleteScore(student_idx) {
    return Score.findOne({where:{student_idx}}).then((score) => {
        score.destroy();
    });
}

