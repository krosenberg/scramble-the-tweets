const scrambleText = (node) => {
  const iter = document.createNodeIterator(node, NodeFilter.SHOW_TEXT);
  let textnode;

  // all text nodes
  while ((textnode = iter.nextNode())) {
    if (textnode.textContent.trim().length) {
      const oldText = textnode.textContent;
      const newText = oldText
        // Split text into words
        .split(' ')
        .map((d) => {
          return (
            d
              // Split word into characters
              .split('')
              // Shift each character by one
              .map((l) =>
                ['#', '@', '$', '.', '?', ',', ';'].includes(l) ? l : String.fromCharCode(l.charCodeAt() + 1)
              )
              .join('')
          );
        })
        .join(' ');
      textnode.textContent = newText;
    }
  }
};

const enableTheScrambling = () => {
  // Select the node that will be observed for mutations
  const targetNode = document.querySelector('body');

  // Options for the observer (which mutations to observe)
  const config = {
    attributes: false,
    childList: true,
    subtree: true,
  };

  // Callback function to execute when mutations are observed
  const callback = function (mutations, observer) {
    // look through all mutations that just occured
    for (var i = 0; i < mutations.length; ++i) {
      // look through all added nodes of this mutation
      for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
        const node = mutations[i].addedNodes[j];
        // Check if a child was added with a `translate`` css rule (i.e. tweet)
        if (node.getAttribute('style') && node.getAttribute('style').includes('transform: translateY')) {
          window.requestAnimationFrame(() => {
            node.querySelectorAll('article [lang], [data-testid="card.wrapper"]').forEach((n) => {
              scrambleText(n);
            });
          });
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
};

chrome.storage.sync.get(['scramble', 'blur'], function ({ scramble = true, blur = true }) {
  if (scramble) {
    enableTheScrambling();
  }
  if (blur) {
    document.body.classList.add('scrambled-tweets-enabled');
  }
});
