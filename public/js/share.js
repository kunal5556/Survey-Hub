document.addEventListener('DOMContentLoaded', function () {
  const shareLinkInput = document.getElementById('shareLink');
  const copyButton = document.getElementById('copyShareLink');
  const originalLabel = copyButton.innerHTML;

  const showTemporaryLabel = function (label) {
    copyButton.innerHTML = label;
    setTimeout(function () {
      copyButton.innerHTML = originalLabel;
    }, 2000);
  };

  copyButton.addEventListener('click', function () {
    shareLinkInput.select();

    navigator.clipboard.writeText(shareLinkInput.value).then(function () {
      showTemporaryLabel('<i class="fa-solid fa-check"></i> Copied');
    }).catch(function () {
      showTemporaryLabel('<i class="fa-solid fa-keyboard"></i> Press Ctrl+C');
    });
  });
});
