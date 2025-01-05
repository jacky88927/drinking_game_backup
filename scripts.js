document.addEventListener('DOMContentLoaded', function () {
    const rollDiceButton = document.getElementById('roll-dice');
    const diceCountInput = document.getElementById('dice-count');
    const diceResultsDiv = document.getElementById('dice-results');

    const diceGames = document.getElementById('dice-games');
    const cardGames = document.getElementById('card-games');
    const noPropGames = document.getElementById('no-prop-games');
    const gameDetails = document.getElementById('game-details');

    const diceRoller = document.getElementById('dice-roller'); // 骰子模擬器引用
    let games = []; // 用於存儲從 JSON 加載的遊戲數據

    // 骰子按鈕邏輯
    rollDiceButton.addEventListener('click', function () {
        const diceCount = parseInt(diceCountInput.value);
        let results = [];

        for (let i = 0; i < diceCount; i++) {
            results.push(Math.floor(Math.random() * 6) + 1);
        }

        diceResultsDiv.innerHTML = ''; // 清空之前的結果

        results.forEach(result => {
            const dice = document.createElement('div');
            dice.className = 'dice';
            dice.style.backgroundImage = `url('images/dice${result}.png')`; // 假設圖片存放在 images 文件夾中
            diceResultsDiv.appendChild(dice);
        });
    });

    // 動態加載 JSON 資料
    fetch('./games.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // 確認內容是否正確
            games = data;
            renderGameList(games);
        })
        .catch(error => {
            console.error('Error loading games:', error);
        });

    function renderGameList(games) {
        games.forEach(game => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${game.id}`;
            link.innerHTML = game.recommended
                ? '<span class="recommended-star">★</span> ' + game.title
                : game.title;
            listItem.appendChild(link);

            // 根據遊戲分類將遊戲添加到相應的部分
            if (game.category === 'dice') {
                diceGames.appendChild(listItem);
            } else if (game.category === 'card') {
                cardGames.appendChild(listItem);
            } else if (game.category === 'no-prop') {
                noPropGames.appendChild(listItem);
            }

            const gameSection = document.createElement('section');
            gameSection.id = game.id;

            const star = game.recommended ? '<span class="recommended-star">★</span>' : '';
            gameSection.innerHTML = `
                <h2>${star}${game.title}</h2>
                <div class="game-ratings">
                    <div class="game-rating">簡易度: ${game.ease}</div>
                    <div class="game-rating">酒量: ${game.alcohol}</div>
                    <div class="game-rating">適合人數: ${game.players}</div>
                </div>
                <p>${game.description}</p>
            `;
            gameDetails.appendChild(gameSection);
        });
    }

    // 篩選遊戲
    window.filterGames = function (category) {
        const allGames = document.querySelectorAll('#dice-games li, #card-games li, #no-prop-games li');
        const allSections = document.querySelectorAll('#game-details section');

        // 隱藏所有區塊
        allGames.forEach(game => (game.style.display = 'none'));
        allSections.forEach(section => (section.style.display = 'none'));
        diceRoller.style.display = 'none'; // 預設隱藏骰子模擬器

        if (category === 'all') {
            allGames.forEach(game => (game.style.display = 'block'));
            allSections.forEach(section => (section.style.display = 'block'));
        } else if (category === 'dice-roller') {
            diceRoller.style.display = 'block'; // 顯示骰子模擬器
        } else if (category === 'high-interaction') {
            games
                .filter(game => game.interaction)
                .forEach(game => {
                    const gameLink = document.querySelector(`#${game.category}-games li a[href="#${game.id}"]`);
                    if (gameLink) {
                        gameLink.parentElement.style.display = 'block';
                        document.getElementById(game.id).style.display = 'block';
                    }
                });
        } else {
            games
                .filter(game => game.category === category || (category === 'quick-drinking' && game.alcohol > 3))
                .forEach(game => {
                    const gameLink = document.querySelector(`#${game.category}-games li a[href="#${game.id}"]`);
                    if (gameLink) {
                        gameLink.parentElement.style.display = 'block';
                        document.getElementById(game.id).style.display = 'block';
                    }
                });
        }
    };
});
