let timeout;

extractResultBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    clearTimeout(timeout)
    okMessage.style.display = "none"
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: extractResult,
        },
        (results) => {
            const {result} = results[0]; 
            navigator.clipboard.writeText(JSON.stringify(result));
            okMessage.style.display = "block";
            clearTimeout(timeout)
            timeout = setTimeout(() => (okMessage.style.display = "none"), 3000);
        }
    );
});

function extractResult() {
    const PLAYER_REGEXP = /^(.+) \((.+)\)$/
    const result = [];
    document.querySelectorAll(".match-row").forEach((row) => {
        const cells = row.querySelectorAll(".match-element");
        const [,playerName1 = null, playerGameId1 = null] = cells[1].innerHTML.match(PLAYER_REGEXP) || []
        const [,playerName2 = null, playerGameId2 = null] = cells[2].innerHTML.match(PLAYER_REGEXP) || []
        result.push({
            tableNumber: parseInt(cells[0].innerHTML),
            playerName1,
            playerGameId1,
            playerName2,
            playerGameId2,
            result: cells[3].querySelector("select").value || null
        });
    });
    return result;
}
