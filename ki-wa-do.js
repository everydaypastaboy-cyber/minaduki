// --- 設定：場所ごとの文字 ---
const WORD_MASTER = {
    "1": { morning: "コ", afternoon: "ゆ" },
    "2": { morning: "ン", afternoon: "だ" },
    "3": { morning: "ピ", afternoon: "お" },
    "4": { morning: "ュ", afternoon: "ん" },
    "5": { morning: "タ", afternoon: "せ" },
    "6": { morning: "ア", afternoon: "ん" }
};

window.onload = function() {
    // 1. URLから「?id=1」などの数字を読み取る
    const params = new URLSearchParams(window.location.search);
    const currentId = params.get('id');

    // 2. 「開始時間」をスマホに保存（最初の一回だけ）
    let startTimeGroup = localStorage.getItem('rally_start_time');
    if (!startTimeGroup) {
        const hour = new Date().getHours();
        // 12時前なら「午前」、12時以降なら「午後」グループに固定
        startTimeGroup = (hour < 12) ? 'morning' : 'afternoon';
        localStorage.setItem('rally_start_time', startTimeGroup);
    }

    // 3. 今までに集めたスタンプをスマホから読み出す
    let stamps = JSON.parse(localStorage.getItem('rally_stamps')) || [];

    // 4. もし新しい場所のQRを読み取っていたら、追加する
    if (currentId && WORD_MASTER[currentId]) {
        if (!stamps.includes(currentId)) {
            stamps.push(currentId);
            localStorage.setItem('rally_stamps', JSON.stringify(stamps));
        }
        // 今読み取った場所の文字を表示する
        document.getElementById('word-section').classList.remove('hidden');
        document.getElementById('word-display').innerText = WORD_MASTER[currentId][startTimeGroup];
        document.getElementById('info-msg').innerText = "スタンプをゲットしました！";
    }

    // 5. 画面上のスタンプ台を更新する
    stamps.forEach(id => {
        const target = document.getElementById('s' + id);
        if (target) target.classList.add('active');
    });

    // 6. 6つ全部集まったらお祝いメッセージを出す
    if (stamps.length === 6) {
        document.getElementById('goal-section').classList.remove('hidden');
    }
};

// 全データを消して最初からにする関数（テスト用）
function resetGame() {
    if(confirm("データを消して最初からやり直しますか？")) {
        localStorage.clear();
        location.href = window.location.pathname; // URLの?id=以降を消してリロード
    }
}