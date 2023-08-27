document.addEventListener("DOMContentLoaded", function () {
    const urduText = document.getElementById("urduText");
    const outputText = document.getElementById("outputText");
    const copyButton = document.getElementById("copyButton");

    urduText.addEventListener("input", function () {
        const inputLines = urduText.value.split("\n"); // Split input into lines
        const outputParagraphs = [];

        inputLines.forEach(inputLine => {
            transliterateUrduToLatin(inputLine)
                .then(result => {
                    outputParagraphs.push(result.replace(/\n/g, "<br>")); // Replace newlines with <br> tags
                    outputText.innerHTML = outputParagraphs.join("<br>"); // Join paragraphs with <br> tags
                });
        });
    });

    copyButton.addEventListener("click", function () {
        const textToCopy = outputText.textContent;
        copyTextToClipboard(textToCopy);
    });

async function transliterateUrduToLatin(input) {
    // Fetch the CSV file and parse it
    const response = await fetch("transliterationwordlist.csv");
    const data = await response.text();

    const rules = {};
    const rows = data.split("\n");

    // Skip the first row (header)
    for (let i = 1; i < rows.length; i++) {
        const [urdu, latin] = rows[i].split(",");
        if (urdu && latin) {
            rules[urdu.trim()] = latin.trim();
        }
    }

    // Define an ignore list for characters that should not be transliterated
    const ignoreList = ["؟", "،", "۔"];

    // Transliterate the input text
    const words = input.split(/\s+/);
    const latinWords = words.map(word => {
        let wordWithoutSpecialChars = word;
        let specialChars = "";

        // Check if the word ends with any character in the ignore list
        for (const char of ignoreList) {
            if (word.endsWith(char)) {
                wordWithoutSpecialChars = word.slice(0, -1);
                specialChars = char;
                break;
            }
        }

        const transliteratedWord = rules[wordWithoutSpecialChars] || wordWithoutSpecialChars;
        return transliteratedWord + specialChars;
    });

    return latinWords.join(" ");
}



    function copyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }
});
