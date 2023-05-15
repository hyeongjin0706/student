import * as studentRepository from "../data/student.js";
import * as scoreRepository from "../data/score.js";
import {Score} from "../data/score.js";

// 학생 등록
export async function addStudent(req, res) {
    // json으로 요청보낸 데이터를 상수에 담음
    const {student_id, student_name, student_phone, student_email, student_address }  = req.body;
    // 학번이 존재하는지 유무 검사
    const found = await studentRepository.searchById(student_id);
    // 존재하면 이미 가입한 학번이라고 리턴
    if (found) {
        return res.status(409).json({ message: `${student_id}은 이미 가입된 학번입니다`})
    }

    // 학생 등록
    await(studentRepository.createStudent({
        student_id,
        student_name,
        student_phone,
        student_email,
        student_address
    }));
    
    // 등록 완료 응답 보냄
    res.status(201).json({message:`${student_name}님 등록완료!`});
}

// 학생 정보 업데이트 
export async function updateStudent(req, res) {
    // 파라미터로 일렬번호 받음
    const student_idx = req.params.idx;
    // json으로 요청보낸 데이터를 상수에 담음
    const { student_id, student_name, student_phone, student_email, student_address }  = req.body;

    // 일렬번호로 검색
    const student = await studentRepository.searchByIdx(student_idx);
    
    // 존재하지 않은 일렬번호면 404
    if(!student){
        return res.status(404).json({message: `일렬 번호 (${student_idx})을 찾을 수 없습니다.`});
    }
    
    // 학번을 수정하는 경우
    if (student.dataValues.student_id != student_id) {
        // 중복된 학번이 있는지 검색
        const duplication = await studentRepository.searchById(student_id);
        // 중복된 학번이 있으면 404
        if (duplication) {
            return res.status(404).json({message: `중복된 학번입니다!`});
        }
    }
    // 학생 정보 수정
    const result = await studentRepository.updateStudent(student_idx, student_id, student_name, student_phone, student_email, student_address);

    // 수정완료되면 수정된 결과 응답
    res.status(200).json(result);
}

// 학생 검색
export async function searchStudent(req, res) {
    // 학생 검색은 학번으로 하라고 되어 있어서 학번으로 받음
    const student_id = req.params.id;

    // 학번으로 검색
    const student = await studentRepository.searchById(student_id);
    
    // 학번이 존재하지 않으면 404
    if(!student){
        return res.status(404).json({message: `학번 (${student_id})을 찾을 수 없습니다.`});
    }

    // 일렬번호를 담음
    const student_idx = student.dataValues.student_idx;

    // 일렬번호로 점수 테이블 찾음
    const score = await scoreRepository.searchByStudentIdx(student_idx);

    // 점수가 등록되어 있지 않으면 학생 정보만 리턴
    if (!score) {
        return res.status(200).json(student);
    }
    // 점수가 등록되어 있으면 학생정보와 점수까지 리턴
    const result = await scoreRepository.getByStudentIdx(student_idx);
    return res.status(200).json(result);
}

// 모든 학생 검색
export async function searchAll(req, res) {
    // 모든 학생 검색
    const result = await studentRepository.searchAll(Score);
    
    // 결과 리턴
    return res.status(200).json(result);
}

// 학생 정보 삭제
export async function deleteStudent(req, res) {
    // 일렬번호로 받음
    const student_idx = req.params.idx;

    // 일렬번호로 학생 검색
    const student = await studentRepository.searchByIdx(student_idx);

    // 학생이 없으면 404 리턴
    if(!student){
        return res.status(404).json({message: `일렬번호 (${student_idx})을 찾을 수 없습니다.`});
    }

    // 일렬번호로 점수 찾음
    const score = await scoreRepository.searchByStudentIdx(student_idx);

    // 점수가 있으면 점수 지움
    if (score) {
        await scoreRepository.deleteScore(student_idx);
    }
    // 학생 지움
    await studentRepository.deleteStudent(student_idx);

    // 사용자에게 응답
    return res.status(200).json({message: `학생 정보 삭제 완료!`});
}