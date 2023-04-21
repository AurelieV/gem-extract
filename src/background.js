let title = "";

chrome.webNavigation.onCompleted.addListener(
    ({ url, tabId }) => {
        const isResult = url.includes("/report");
        const isMain = url.includes("/run") && !isResult;

        if (isMain) {
            chrome.scripting.executeScript(
                {
                    target: { tabId },
                    function: setTitle,
                },
                (results) => {
                    const { result } = results[0];
                    if (result) {
                        title = result;
                    }
                }
            );
        } else if (isResult) {
            chrome.scripting.executeScript({
                target: { tabId },
                function: setTitle,
                args: [title],
            });
        }
    },
    { url: [{ hostContains: "gem.fabtcg.com" }] }
);

function setTitle(forcedTitle) {
    if (forcedTitle) {
        document.title = forcedTitle;
        return;
    }
    const title = document.querySelector("h1").innerText;
    document.title = title;
    return title;
}
