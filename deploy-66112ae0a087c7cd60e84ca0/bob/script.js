function getMealInfo(mealType, dateInputId, contentElementId) {
    const inputDate = document.getElementById(dateInputId).value;

    // 사용자가 날짜를 선택했는지 확인
    if (!inputDate) {
        document.getElementById(contentElementId).innerText = '날짜를 선택해주세요.';
        return;
    }

    const apiUrl = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
    const date = inputDate.replace(/-/g, '');
    const rydbrcjd = 'B10';
    const key = '9da4db4b2cb844b4be2ae2006cd2dacb';
    const schoolCode = '7010738';

    fetch(`${apiUrl}?KEY=${key}&ATPT_OFCDC_SC_CODE=${rydbrcjd}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${date}&Type=json`)
        .then(response => response.json())
        .then(data => {
            if(data.mealServiceDietInfo && data.mealServiceDietInfo[1].row) {
                const meals = data.mealServiceDietInfo[1].row;
                const mealData = meals.find(meal => meal.MMEAL_SC_CODE === mealType);
                const formattedMealData = mealData ? mealData.DDISH_NM.split('<br/>').join('\n') : '급식 정보가 없습니다.';
                document.getElementById(contentElementId).innerText = formattedMealData;
            } else {
                document.getElementById(contentElementId).innerText = '급식 정보가 없습니다.';
            }
        })
        .catch(error => {
            console.error('API 호출 중 오류 발생:', error);
            document.getElementById(contentElementId).innerText = '급식 정보를 가져오는 데 실패했습니다.';
        });
}


function getBreakfastInfo() {
    getMealInfo('1', 'breakfastDate', 'breakfast-content');
}

function getLunchInfo() {
    getMealInfo('2', 'lunchDate', 'lunch-content');
}

function getDinnerInfo() {
    getMealInfo('3', 'dinnerDate', 'dinner-content');
}

function getTimeInfo() {
    const selectedDate = document.getElementById('dateInputId').value;
    const selectedGrade = document.getElementById('gradeInputId').value;
    const selectedClass = document.getElementById('classInputId').value;

    // 실제 API 엔드포인트 URL로 이 URL을 업데이트하세요.
    const apiUrl = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
    
    // 선택된 날짜, 학년, 반에 따라 API 요청 파라미터를 조정하여 요청합니다.
    fetch(`${apiUrl}?date=${selectedDate}&grade=${selectedGrade}&class=${selectedClass}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('API 응답이 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.timetable) {
                // 시간표 정보 처리 및 표시
                document.getElementById('ti-content').innerText = JSON.stringify(data.timetable);
            } else {
                // 데이터가 없을 때 처리
                document.getElementById('ti-content').innerText = '해당 날짜의 시간표가 없습니다.';
            }
        })
        .catch(error => {
            console.error('시간표 정보를 가져오는 중 오류 발생:', error);
            document.getElementById('ti-content').innerText = '시간표 정보를 가져오는 데 실패했습니다.';
        });
}
