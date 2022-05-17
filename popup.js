const $scramble = document.querySelector('input[name="scramble"]');
const $blur = document.querySelector('input[name="blur"]');

chrome.storage.sync.get(['scramble', 'blur'], function ({ scramble = true, blur = true }) {
  $scramble.checked = scramble;
  $blur.checked = blur;
});

$scramble.addEventListener('change', (e) => {
  const isEnabled = e.currentTarget.checked;
  chrome.storage.sync.set({ scramble: isEnabled }, function () {
    reloadPageIfTwitter();
  });
});

$blur.addEventListener('change', (e) => {
  const isEnabled = e.currentTarget.checked;
  chrome.storage.sync.set({ blur: isEnabled }, function () {
    reloadPageIfTwitter();
  });
});

function reloadPageIfTwitter() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].url.includes('twitter.com')) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
}
