import express from "express";
import * as scoreController from "../controller/score.js"

const router = express.Router();

// GET
// /tweets?username=:username
// router.get('/', studentController.getStudent);

// 점수 추가
router.post('/add', scoreController.addScore);

// 학생 점수 업데이트
router.put("/:idx", scoreController.updateScore);

// 학생 점수 삭제
router.delete("/:idx", scoreController.deleteScore);


export default router;