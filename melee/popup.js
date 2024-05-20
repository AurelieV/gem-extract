let timeout;

extractResultBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    clearTimeout(timeout);
    okMessage.style.display = "none";
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: extractResult,
        },
        (results) => {
            const { result } = results[0];
            navigator.clipboard.writeText(JSON.stringify(result));
            okMessage.style.display = "block";
            clearTimeout(timeout);
            timeout = setTimeout(() => (okMessage.style.display = "none"), 3000);
        }
    );
});

extractSeatingsBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    clearTimeout(timeout);
    okMessage.style.display = "none";
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: extractSeatings,
        },
        (results) => {
            const { result } = results[0];
            navigator.clipboard.writeText(JSON.stringify(result));
            okMessage.style.display = "block";
            clearTimeout(timeout);
            timeout = setTimeout(() => (okMessage.style.display = "none"), 3000);
        }
    );
});

// extractPairingsBtn.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     clearTimeout(timeout);
//     okMessage.style.display = "none";
//     chrome.scripting.executeScript(
//         {
//             target: { tabId: tab.id },
//             function: extractPairings,
//         },
//         (pairings) => {
//             const { result } = pairings[0];
//             navigator.clipboard.writeText(JSON.stringify(result));
//             okMessage.style.display = "block";
//             clearTimeout(timeout);
//             timeout = setTimeout(() => (okMessage.style.display = "none"), 3000);
//         }
//     );
// });

function extractResult() {
    const result = [];
    document.querySelectorAll("#tournament-player-pairings-table tbody tr").forEach((row) => {
        const tableColumn = row.querySelector(".TableNumber-column")?.innerText;
        const tableNumber = tableColumn && parseInt(tableColumn);
        if (tableColumn && tableNumber && !isNaN(tableNumber)) {
            const tableResult = row.querySelector(".AdminResultString-column")?.innerText;
            const playerNames = row.querySelectorAll(".Teams-column .match-table-team-container a");

            const playerName1 = playerNames[0]?.innerText?.trim();
            const playerGameId1 = playerNames[0]?.getAttribute("data-id");
            const playerName2 = playerNames[1]?.innerText?.trim();
            const playerGameId2 = playerNames[1]?.getAttribute("data-id");

            result.push({
                tableNumber,
                playerName1,
                playerGameId1,
                playerName2,
                playerGameId2,
                result: tableResult === "Not reported" ? null : tableResult,
            });
        }
    });
    return result;
}

function extractSeatings() {
    const result = {};
    document.querySelectorAll("#tournament-seatings-table tbody tr").forEach((row) => {
        const tableNumber = row.querySelector(".TableNumber-column input")?.value;
        if (tableNumber) {
            const name = row.querySelector(".Name-column")?.innerText;
            result[tableNumber] = result[tableNumber] || [];
            result[tableNumber].push(name);
        }
    });
    return Object.entries(result).map(([tableNumber, players]) => ({
        tableNumber: parseInt(tableNumber),
        playerName1: players[0],
        playerName2: players[1],
    }));
}

// function extractPairings() {
//     const result = [];
//     document.querySelectorAll(".pairing-table tr").forEach((row) => {
//         const cells = row.querySelectorAll("td");
//         const tableNumber = cells[0] && parseInt(cells[0].innerHTML);
//         if (tableNumber && !isNaN(tableNumber)) {
//             result.push({
//                 tableNumber,
//                 playerName1: cells[1].innerHTML,
//                 playerGameId1: cells[1].innerHTML,
//                 playerName2: cells[5].innerHTML,
//                 playerGameId2: cells[5].innerHTML,
//                 playerScore1: cells[2].innerHTML,
//                 playerScore2: cells[4].innerHTML,
//             });
//         }
//     });
//     return result;
// }
