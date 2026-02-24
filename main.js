
document.addEventListener('DOMContentLoaded', () => {
    const setsInput = document.getElementById('sets-input');
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');
    const themeToggle = document.getElementById('theme-toggle');
    const themeStorageKey = 'preferred-theme';

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
                setContainer.appendChild(ball);
            });

            numbersDisplay.appendChild(setContainer);
        }
    };

    generateBtn.addEventListener('click', generateLottoNumbers);

    const applyTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        themeToggle.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
        themeToggle.setAttribute(
            'aria-label',
            theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'
        );
    };

    const getPreferredTheme = () => {
        const storedTheme = localStorage.getItem(themeStorageKey);
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    applyTheme(getPreferredTheme());

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        localStorage.setItem(themeStorageKey, nextTheme);
        applyTheme(nextTheme);
    });

    // Generate initial numbers on load
    generateLottoNumbers();
});
