import express from "express";
import * as studentController from "../controller/student.js"

const router = express.Router();

// GET
// /tweets?username=:username
// router.get('/', studentController.getStudent);

// 학생 정보 추가
router.post('/add', studentController.addStudent);

// 전체 학생 정보 검색
router.get('/', studentController.searchAll);

// 학생 정보 검색
router.get('/:id', studentController.searchStudent);

// 학생 정보 업데이트
router.put("/:idx", studentController.updateStudent);

// 학생 정보 삭제
router.delete("/:idx", studentController.deleteStudent);


export default router;