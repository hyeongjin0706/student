import * as studentRepository from "../data/student.js";
import * as scoreRepository from "../data/score.js"

// 점수 추가
export async function addScore(req, res) {
    // 일렬번호가 점수 전달받음
    const {student_idx, score_java, score_python, score_c} = req.body;
    // 일렬번호로 학생이 등록되어 있는지 검색
    const student = await studentRepository.searchByIdx(student_idx);
    
    // 학생이 등록되어 있지 않다면 404 리턴
    if (!student) {
        return res.status(404).json({message: `일렬 번호 (${student_idx})을 찾을 수 없습니다.`});
    }

    // 일렬번호로 점수 존재 유무 검색
    const score = await scoreRepository.searchByStudentIdx(student_idx);

    // 점수가 이미 존재한다면 404 리턴
    if(score){
        return res.status(404).json({message: `일렬 번호(${student_idx})는 이미 점수가 등록된 학생입니다`});
    }

    // 총점 구하기
    const score_total = score_java + score_python + score_c;
    // 평균 구하기
    const score_avg = parseInt(score_total/3);

    // 점수 등록
    await scoreRepository.createScore({score_java, score_python, score_c, score_total, score_avg, student_idx});

    // 점수등록이 완료되면 사용자에게 응답
    return res.status(201).json({message:`점수 등록 완료!`});
}

// 점수 수정
export async function updateScore(req, res) {
    // 일렬번호 받음
    const student_idx = req.params.idx;
    // 수정될 점수 받음
    const { score_java, score_python, score_c } = req.body;
    // 점수 등록 유무 검사
    const score = await scoreRepository.searchByStudentIdx(student_idx);
    // 점수가 없을 경우 점수 먼저 등록하라고 404
    if (!score) {
        return res.status(404).json({message: `점수를 먼저 등록 해주세요!`});
    }

    // 총점 구하기
    const score_total = score_java + score_python + score_c;
    // 평균 구하기
    const score_avg = parseInt(score_total/3);

    // 점수 수정하기
    await scoreRepository.updateScore(student_idx, score_java, score_python, score_c, score_total,score_avg);

    // 수정이 완료되면 응답
    return res.status(200).json({message:`점수 수정 완료!`});
}

// 점수 제거
export async function deleteScore(req, res) {
    // 일렬번호 파라미터로 받음
    const student_idx = req.params.idx;
    // 점수 존재 유무 검사
    const score = await scoreRepository.searchByStudentIdx(student_idx);

    // 점수가 등록되지 않으면 404리턴
    if (!score) {
        return res.status(404).json({message: `점수가 등록되지 않았습니다!`});
    }
    
    // 점수 제거 
    await scoreRepository.deleteScore(student_idx);

    // 점수가 제거되면 응답
    return res.status(200).json({message: `점수가 삭제되었습니다!`});
}