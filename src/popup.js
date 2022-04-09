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
        const [,player1_name = null, player1_gemid = null] = cells[1].innerHTML.match(PLAYER_REGEXP) || []
        const [,player2_name = null, player2_gemid = null] = cells[2].innerHTML.match(PLAYER_REGEXP) || []
        result.push({
            table_number: parseInt(cells[0].innerHTML),
            player1_name,
            player1_gemid,
            player2_name,
            player2_gemid,
            result: cells[3].querySelector("select").value || null
        });
    });
    return result;
}
