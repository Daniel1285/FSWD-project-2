document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const leaderboardTableGame1 = document.getElementById('leaderboardTableGame1');
    const leaderboardTableGame2 = document.getElementById('leaderboardTableGame2');
    const summaryContent = document.getElementById('summaryContent');

    // Load Leaderboard Data
    const game1Leaderboard = JSON.parse(localStorage.getItem('leaderboardGame1')) || { Easy: [], Medium: [], Hard: [] };
    const game2Leaderboard = JSON.parse(localStorage.getItem('leaderboardGame2')) || { Easy: [], Medium: [], Hard: [] };

    // Populate Scores Table
    const populateTable = (leaderboard, tableElement) => {
        for (const level of ['Easy', 'Medium', 'Hard']) {
            if (Array.isArray(leaderboard[level])) {
                leaderboard[level]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5) // Top 5 scores
                    .forEach((entry) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${level}</td>
                            <td>${entry.name}</td>
                            <td>${entry.score}</td>
                            <td>${entry.date || 'N/A'}</td>
                        `;
                        tableElement.appendChild(row);
                    });
            }
        }
    };

    populateTable(game1Leaderboard, leaderboardTableGame1);
    populateTable(game2Leaderboard, leaderboardTableGame2);

    // Populate Summary Section
    const generateSummary = (leaderboard, gameName) => {
        const allScores = Object.values(leaderboard).flat(); // Flatten all level scores
        if (allScores.length === 0) return `<p>No scores yet for ${gameName}.</p>`;

        const topPlayer = allScores.reduce((max, player) => (player.score > max.score ? player : max));
        return `<p>Top Player for ${gameName}: <strong>${topPlayer.name}</strong> with a score of <strong>${topPlayer.score}</strong> on <strong>${topPlayer.date || 'N/A'}</strong>.</p>`;
    };

    const game1Summary = generateSummary(game1Leaderboard, 'Catch the Ball');
    const game2Summary = generateSummary(game2Leaderboard, '4 in Row');

    summaryContent.innerHTML = `
        ${game1Summary}
        ${game2Summary}
    `;
});
