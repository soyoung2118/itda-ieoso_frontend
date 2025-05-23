export function collectVisibleTexts() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (!node.parentElement) return NodeFilter.FILTER_REJECT;
        if (node.parentElement.tagName === "SCRIPT") return NodeFilter.FILTER_REJECT;
        if (node.parentElement.tagName === "STYLE") return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const texts = [];
  while (walker.nextNode()) {
    texts.push(walker.currentNode.nodeValue.trim());
  }

  return texts;
}
