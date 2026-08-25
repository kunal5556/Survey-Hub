document.addEventListener('DOMContentLoaded', function () {
  const typeSelect = document.getElementById('type');
  const optionsSection = document.getElementById('optionsSection');
  const optionList = document.getElementById('optionList');
  const addOptionButton = document.getElementById('addOption');

  const selectedTypeNeedsOptions = function () {
    const selectedOption = typeSelect.options[typeSelect.selectedIndex];
    return selectedOption.dataset.needsOptions === 'true';
  };

  const toggleOptionsSection = function () {
    optionsSection.hidden = !selectedTypeNeedsOptions();
  };

  const addOptionRow = function () {
    const row = document.createElement('div');
    row.className = 'input-group mb-2';
    row.innerHTML = '<input type="text" class="form-control" name="options" placeholder="Option text">' +
      '<button type="button" class="btn btn-outline-danger remove-option"><i class="fa-solid fa-xmark"></i></button>';
    optionList.appendChild(row);
  };

  const ensureOptionRows = function () {
    if (selectedTypeNeedsOptions() && optionList.children.length === 0) {
      addOptionRow();
      addOptionRow();
    }
  };

  addOptionButton.addEventListener('click', addOptionRow);

  optionList.addEventListener('click', function (event) {
    const removeButton = event.target.closest('.remove-option');
    if (removeButton) {
      removeButton.parentElement.remove();
    }
  });

  typeSelect.addEventListener('change', function () {
    toggleOptionsSection();
    ensureOptionRows();
  });

  toggleOptionsSection();
  ensureOptionRows();
});
