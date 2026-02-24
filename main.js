
document.addEventListener('DOMContentLoaded', () => {
    const setsInput = document.getElementById('sets-input');
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');

    // Function to get ball color based on number
    const getBallColor = (number) => {
        if (number <= 10) return '#fbc400'; // 노란색
        if (number <= 20) return '#69c8f2'; // 파란색
        if (number <= 30) return '#ff7272'; // 빨간색
        if (number <= 40) return '#aaa';    // 회색
        return '#b0d840';                     // 녹색
    };

    const generateLottoNumbers = () => {
        numbersDisplay.innerHTML = ''; // Clear previous numbers
        const numberOfSets = parseInt(setsInput.value, 10);

        if (isNaN(numberOfSets) || numberOfSets < 1 || numberOfSets > 10) {
            alert('1에서 10 사이의 숫자를 입력해주세요.');
            return;
        }

        for (let i = 0; i < numberOfSets; i++) {
            const numberSet = new Set();
            while (numberSet.size < 6) {
                const randomNumber = Math.floor(Math.random() * 45) + 1;
                numberSet.add(randomNumber);
            }
            const sortedNumbers = Array.from(numberSet).sort((a, b) => a - b);

            const setContainer = document.createElement('div');
            setContainer.className = 'number-set';

            sortedNumbers.forEach(number => {
                const ball = document.createElement('div');
                ball.className = 'number-ball';
                ball.textContent = number;
                ball.style.backgroundColor = getBallColor(number);
                ball.style.color = '#1A1A1A'; // 어두운 텍스트 색상으로 가독성 확보
                setContainer.appendChild(ball);
            });

            numbersDisplay.appendChild(setContainer);
        }
    };

    generateBtn.addEventListener('click', generateLottoNumbers);

    // Generate initial numbers on load
    generateLottoNumbers();
});
