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
  // Create a new Headers object
  var headers = new Headers();

  // Set common browser headers
  headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
  headers.append('Accept-Encoding', 'gzip, deflate, br');
  headers.append('Accept-Language', 'en-US,en;q=0.5');
  headers.append('Cache-Control', 'max-age=0');
  headers.append('Connection', 'keep-alive');
  headers.append('Host', 'itch.io');
  headers.append('Upgrade-Insecure-Requests', '1');
  headers.append('User-Agent', 'Mozilla/5.0 (Windows NT  10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
  headers.append('credentials', 'include');
  headers.append('Access-Control-Allow-Origin', '*');

  fetch("https://itch.io/games/platform-web", {
    method: 'GET',
    mode: 'no-cors',
    headers: headers,
  })
    .then(response => {
      if (response.type === 'opaque') {
        console.log('Opaque response, cannot read data');
      } else {
        return response.text();
      }
    })
    .then(content => {
      if (content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const gameLinks = Array.from(doc.querySelectorAll('.title.game_link'));
        hrefList = gameLinks.map(link => link.getAttribute('href'));
        clearTable();
        populateTable(gameLinks);
      }
    })
    .catch(error => {
      console.log("An error occurred:", error);
    });
}

// Initial fetch
fetchGameURLs();
