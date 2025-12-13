const proceedBtn = document.getElementById('proceed-btn');
const backBtn = document.getElementById('back-btn');
const saveBtn = document.getElementById('save-btn');
const shareBtn = document.getElementById('share-btn');
const selectionSection = document.getElementById('selection-section');
const summarySection = document.getElementById('summary-section');
const selectedItemsList = document.getElementById('selected-items');
const totalCostElem = document.getElementById('total-cost');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const saveFeedback = document.getElementById('save-feedback');
const shareFeedback = document.getElementById('share-feedback');

const PACKAGE_SAVE_KEY = 'hasSavedPackage';
const PACKAGE_SHARE_KEY = 'hasSharedPackage';

const storageAvailable = (() => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
})();

const getStoredFlag = key => storageAvailable && window.localStorage.getItem(key) === 'true';
const setStoredFlag = key => {
  if (storageAvailable) {
    window.localStorage.setItem(key, 'true');
  }
};

const markActionComplete = (button, label, feedbackElem, message, color = '#4ade80') => {
  if (button) {
    button.disabled = true;
    if (label) button.textContent = label;
  }
  if (feedbackElem) {
    feedbackElem.textContent = message;
    feedbackElem.style.color = color;
  }
};

const warnAction = (feedbackElem, message) => {
  if (feedbackElem) {
    feedbackElem.textContent = message;
    feedbackElem.style.color = '#f87171';
  }
};

if (getStoredFlag(PACKAGE_SAVE_KEY)) {
  markActionComplete(saveBtn, 'Saved', saveFeedback, 'Details already saved on this device.');
}

if (getStoredFlag(PACKAGE_SHARE_KEY)) {
  markActionComplete(shareBtn, 'Shared', shareFeedback, 'Already shared from this device.');
}

// Proceed logic with validation
proceedBtn.addEventListener('click', () => {
  if (!firstNameInput.value.trim() || !lastNameInput.value.trim()) {
    alert('Please enter your first and last name.');
    return;
  }
  const selectedPackage = document.querySelector('input[name="package"]:checked');
  const selectedTrad = document.querySelector('input[name="trad"]:checked');
  if (!selectedPackage || !selectedTrad) {
    alert('Please select a package and Trad wear.');
    return;
  }

  const packageName = selectedPackage.value;
  const packageCost = parseInt(selectedPackage.dataset.cost);
  const tradName = selectedTrad.value;
  const tradCost = parseInt(selectedTrad.dataset.cost);
  const total = packageCost + tradCost;

  // Display selections
  selectedItemsList.innerHTML = '';
  [packageName, `Trad Wear: ${tradName}`].forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    selectedItemsList.appendChild(li);
  });
  totalCostElem.textContent = `Total: ₦${total}`;

  // Store data
  window.selectedData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    items: [packageName, `Trad Wear: ${tradName}`],
    total
  };

  // Toggle sections
  selectionSection.style.display = 'none';
  summarySection.style.display = 'block';
});

// Back logic
backBtn.addEventListener('click', () => {
  selectionSection.style.display = 'block';
  summarySection.style.display = 'none';
});

// Save to Package Google Sheet
saveBtn.addEventListener('click', () => {
  const data = window.selectedData;
  if (getStoredFlag(PACKAGE_SAVE_KEY)) {
    markActionComplete(saveBtn, 'Saved', saveFeedback, 'Details already saved on this device.');
    return;
  }
  const feedbackElem = document.getElementById('save-feedback');
  feedbackElem.innerHTML = '<div class="spinner" style="display: block;"></div> Saving...';

  const formData = new URLSearchParams();
  formData.append('payload', JSON.stringify(data));

  fetch('https://script.google.com/macros/s/AKfycbyPr4sEv4NO-MqOdmCyFv1sSdZ7qTGmRJpkU092T9vH5QrZ7p7ECiJJUt_LAICPbX-c/exec', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(result => {
    markActionComplete(saveBtn, 'Saved', saveFeedback, 'You successfully saved details!');
    setStoredFlag(PACKAGE_SAVE_KEY);
    console.log(result);
  })
  .catch(error => {
    feedbackElem.innerHTML = '';
    alert('Save failed. Please try again or check the console for details.');
    console.error('Error saving:', error);
  });
});

// Share to WhatsApp
shareBtn.addEventListener('click', () => {
  if (!window.selectedData) {
    alert('Please review and proceed with your selection before sharing.');
    return;
  }
  if (!getStoredFlag(PACKAGE_SAVE_KEY)) {
    warnAction(shareFeedback, 'Please save your details before sharing.');
    return;
  }
  if (getStoredFlag(PACKAGE_SHARE_KEY)) {
    markActionComplete(shareBtn, 'Shared', shareFeedback, 'Already shared from this device.');
    return;
  }
  const data = window.selectedData;
  const phone = '+2347036805391';
  const message = `Hi, this is ${data.firstName} ${data.lastName}. My selections: ${data.items.join(', ')}. Total: ₦${data.total}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  setStoredFlag(PACKAGE_SHARE_KEY);
  markActionComplete(shareBtn, 'Shared', shareFeedback, 'Shared with the financial secretary.');
  window.location.href = url;
});
