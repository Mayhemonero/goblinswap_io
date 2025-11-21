/*
  GoblinSwap.io Reserve Scanner
  -----------------------------
  This script scans the current page for any sections
  mentioning "reserve", "reserves", "liquidity", etc.,
  then extracts all numbers it finds.
*/

(function () {
  console.log("%c[GOBLINSWAP] Reserve Scanner", "color:#7bd63d; font-weight:bold;");

  const keywords = ["reserve", "reserves", "liquidity", "balance", "pool"];
  const numberRegex = /[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g;

  function elementContainsKeyword(el) {
    const t = el.innerText.toLowerCase();
    return keywords.some(k => t.includes(k));
  }

  function scanForReserveBlocks() {
    const all = Array.from(document.querySelectorAll("*"));
    const matches = all.filter(el => elementContainsKeyword(el));
    return matches;
  }

  function extractNumbersFromElement(el) {
    const txt = el.innerText;
    const nums = txt.match(numberRegex) || [];
    return nums;
  }

  function run() {
    const blocks = scanForReserveBlocks();
    if (!blocks.length) {
      console.log("No reserve-related elements found.");
      return;
    }

    const result = [];

    blocks.forEach((el, i) => {
      const nums = extractNumbersFromElement(el);
      if (nums.length) {
        result.push({
          index: i,
          tag: el.tagName.toLowerCase(),
          snippet: el.innerText.slice(0, 80).trim() + (el.innerText.length > 80 ? "…" : ""),
          numbers: nums
        });
      }
    });

    console.log("Found sections:", result.length);
    console.table(result);
    return result;
  }

  run();
})();
