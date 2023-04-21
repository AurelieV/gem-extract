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

function extractResult() {
    const result = [];
    document.querySelectorAll("table.pairings-table tr").forEach((row) => {
        const column = row.querySelector('pairings-table__cell--table-num')
        const tableColumn = column?.innerText.trim();
        const tableNumber = tableColumn && parseInt(tableColumn);
        if (tableColumn && tableNumber && !isNaN(tableNumber)) {
            const player1Element = row.querySelectorAll('pairings-table__cell--left .team__display-name span')[1]
            const player2Element = row.querySelectorAll('pairings-table__cell--right .team__display-name span')[1]
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
