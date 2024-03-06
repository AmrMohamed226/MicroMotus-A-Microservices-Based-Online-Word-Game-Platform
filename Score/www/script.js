const playerId = 'Amr'; // Use the key from Redis

function fetchAndDisplayScores() {
    fetch(`/getscore?playerId=${playerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('usernameScore').textContent = `${playerId}'s Score`;
            document.getElementById('wordCount').textContent = data.wordsFound;
            document.getElementById('averageTry').textContent = data.averageTries;
        })
        .catch(error => {
            console.error('Error fetching scores:', error);
            document.getElementById('usernameScore').textContent = 'Error';
            document.getElementById('wordCount').textContent = 'Error';
            document.getElementById('averageTry').textContent = 'Error';
        });
}

window.onload = fetchAndDisplayScores;