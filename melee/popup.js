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
    document.querySelectorAll("#tournament-player-pairings-table tr").forEach((row) => {
        const tableColumn = row.querySelector('.TableNumber-column')?.innerText;
        const tableNumber = tableColumn && parseInt(tableColumn);
        if (tableColumn && tableNumber && !isNaN(tableNumber)) {
            const tableResult = row.querySelector('.Result-column')?.innerText;
            result.push({
                tableNumber,
                playerName1: row.querySelector('.Player1-column a')?.innerText?.trim(),
                playerGameId1: row.querySelector('.Player1-column a')?.getAttribute('data-id'),
                playerName2: row.querySelector('.Player2-column a')?.innerText?.trim(),
                playerGameId2: row.querySelector('.Player2-column a')?.getAttribute('data-id'),
                result: tableResult === 'Not reported' ? null : tableResult,
            });
        }
    });
    return result;
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
