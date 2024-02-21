let page = 1;
let hrefList = [];

function clearTable() {
  const tableBody = document.getElementById('gameBody');
  tableBody.innerHTML = ''; // Clear the table body
}

function populateTable(gameLinks) {
  const tableBody = document.getElementById('gameBody');
  gameLinks.forEach((link, index) => {
    const row = document.createElement('tr');
    const indexCell = document.createElement('td');
    indexCell.textContent = index;
    const gameCell = document.createElement('td');
    gameCell.textContent = link.textContent; // Assuming link.textContent contains the game title
    row.appendChild(indexCell);
    row.appendChild(gameCell);
    tableBody.appendChild(row);
  });
}

function getGameURL() {
  const input = document.getElementById('gameInput').value;
  if (input.toLowerCase() === 'exit') {
    console.log("Exiting the Itch Game Grabber. Goodbye!");
    return;
  }
  if (input.toLowerCase() === 'next') {
    console.log("Getting more games...");
    page++;
    fetchGameURLs();
    return;
  }

  const selectedGame = parseInt(input);
  if (!isNaN(selectedGame) && selectedGame >= 0 && selectedGame < hrefList.length) {
    const selectedHref = hrefList[selectedGame];
    fetch(selectedHref)
      .then(response => response.text())
      .then(content => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const iframePlaceholder = doc.querySelector('.iframe_placeholder');
        if (iframePlaceholder) {
          const iframeData = iframePlaceholder.getAttribute('data-iframe');
          const iframeDoc = parser.parseFromString(iframeData, 'text/html');
          const iframeSrc = iframeDoc.querySelector('iframe').getAttribute('src');
          console.log("Game Source (copied): " + iframeSrc);
          navigator.clipboard.writeText(iframeSrc);
        } else {
          const gameDropIframe = doc.querySelector('#game_drop');
          if (gameDropIframe) {
            console.log("Game Source (copied): " + gameDropIframe.getAttribute('src'));
            navigator.clipboard.writeText(gameDropIframe.getAttribute('src'));
          } else {
            console.log("No source found");
          }
        }
      })
      .catch(error => {
        console.log("An error occurred:", error);
      });
  } else {
    console.log("Invalid input. Please enter a number within the range.");
  }
}

function fetchGameURLs() {
  fetch("https://itch.io/games/platform-web?page=" + page)
    .then(response => response.text())
    .then(content => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const gameLinks = Array.from(doc.querySelectorAll('.title.game_link'));
      hrefList = gameLinks.map(link => link.getAttribute('href'));
      clearTable();
      populateTable(gameLinks);
    })
    .catch(error => {
      console.log("An error occurred:", error);
    });
}

// Initial fetch
fetchGameURLs();
