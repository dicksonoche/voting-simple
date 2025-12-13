const items = [
  { id: 'sash', name: 'Sash', cost: 5000, mandatory: true, description: 'Official OAU and Pharmacy sash for every Compounder.' },
  { id: 'yearbook', name: 'Yearbook', cost: 2000, mandatory: true, description: 'Memory-filled book capturing our images, details, stories, quotes, and highlights.' },
  { id: 'cultural-night', name: 'Cultural / Trad Night', cost: 10000, mandatory: true, description: 'Food, fashion, music, and vibes at the cultural night.' },
  { id: 'class-project', name: 'Class Project', cost: 3000, mandatory: true, description: 'Collective impact project that represents Compound ’25.' },
  { id: 'health-outreach', name: 'Health Outreach', cost: 2000, mandatory: true, description: 'Community health service and awareness beyond the classroom. Our very own Coporate Social Responsibility.' },
  { id: 'alumni-brunch', name: 'Alumni Networking Brunch', cost: 4000, mandatory: false, description: 'Connect with alumni from various practice settings(Industry & Supply Chain, Community, Hospital, Regulatory, Academic & Research) to gain insights, mentorship, and opportunities. It also doubles as a Brunch.' },
  { id: 'fyb-journal', name: 'FYB Branded Journal', cost: 7000, mandatory: false, description: 'Personalized Compound \'25 journal for you.' },
  { id: 'movie-night', name: 'Movie Night', cost: 1500, mandatory: false, description: '' },
  { id: 'sport-fiesta', name: 'Sport Fiesta', cost: 1500, mandatory: false, description: 'Friendly competition, fun games, and stress relief at the Main Bowl.' },
  { id: 'class-dinner', name: 'Class Dinner', cost: 25000, mandatory: false, description: 'Final year dinner like no other. No need for too much talk. Come experience it first-hand.' },
  { id: 'class-trip', name: 'Class Trip & Staycation', cost: 30000, mandatory: false, description: 'Relax, bond, and create memories outside campus.' },
  { id: 'souvenirs', name: 'Souvenirs', cost: 8000, mandatory: false, description: 'Extra souvenirs and keepsakes for you.' },
  { id: 'imperial-souvenirs', name: 'Imperial Souvenirs', cost: 12000, mandatory: false, description: 'Souvenir pack reserved for Imperial-inspired looks.' }
];

const form = document.getElementById('item-form');
const customItemsContainer = document.getElementById('custom-items');
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

const CUSTOM_SAVE_KEY = 'hasSavedCustomPackage';
const CUSTOM_SHARE_KEY = 'hasSharedCustomPackage';

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

if (getStoredFlag(CUSTOM_SAVE_KEY)) {
  markActionComplete(saveBtn, 'Saved', saveFeedback, 'Custom details already saved on this device.');
}

if (getStoredFlag(CUSTOM_SHARE_KEY)) {
  markActionComplete(shareBtn, 'Shared', shareFeedback, 'Custom bundle already shared on this device.');
}

// Generate checkboxes with the new visual style
if (customItemsContainer) {
  items.forEach(item => {
    const label = document.createElement('label');
    label.classList.add('option-card', 'checkbox-card');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = item.id;
    checkbox.value = item.name;
    checkbox.checked = item.mandatory;
    checkbox.disabled = item.mandatory;
    label.appendChild(checkbox);

    const content = document.createElement('div');
    content.className = 'option-content';

    const row = document.createElement('div');
    row.className = 'option-row';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'option-name';
    nameSpan.textContent = item.name;

    const priceSpan = document.createElement('span');
    priceSpan.className = 'option-price';
    if (!item.mandatory) {
      priceSpan.textContent = `₦${item.cost.toLocaleString()}`;
    }

    row.appendChild(nameSpan);
    row.appendChild(priceSpan);

    const desc = document.createElement('p');
    desc.className = 'option-description';
    desc.textContent = item.description ||
      (item.mandatory
        ? 'Automatically included so everyone stays coordinated.'
        : 'Optional add-on. Select it to include in your look.');

    content.appendChild(row);
    content.appendChild(desc);

    if (item.mandatory) {
      const badge = document.createElement('span');
      badge.className = 'option-badge';
      badge.textContent = 'Mandatory';
      content.appendChild(badge);
    }

    label.appendChild(content);
    customItemsContainer.appendChild(label);
  });
}

// Proceed logic
proceedBtn.addEventListener('click', () => {
  if (!firstNameInput.value.trim() || !lastNameInput.value.trim()) {
    alert('Please enter your first and last name.');
    return;
  }
  const selectedTrad = document.querySelector('input[name="trad"]:checked');
  if (!selectedTrad) {
    alert('Please select Trad wear.');
    return;
  }

  const selectedItems = items.filter(item => {
    if (item.mandatory) return true;
    return document.getElementById(item.id).checked;
  });

  const tradName = selectedTrad.value;
  const tradCost = parseInt(selectedTrad.dataset.cost);
  const itemsTotal = selectedItems.reduce((sum, item) => sum + item.cost, 0);
  const total = itemsTotal + tradCost;

  // Display
  selectedItemsList.innerHTML = '';
  [...selectedItems.map(item => item.name), `Trad Wear: ${tradName}`].forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    selectedItemsList.appendChild(li);
  });
  totalCostElem.textContent = `Total: ₦${total}`;

  // Store data
  window.selectedData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    items: [...selectedItems.map(item => item.name), `Trad Wear: ${tradName}`],
    total
  };

  // Switch view
  selectionSection.style.display = 'none';
  summarySection.style.display = 'block';
});

// Back, Save, Share (same as packages)
backBtn.addEventListener('click', () => {
  selectionSection.style.display = 'block';
  summarySection.style.display = 'none';
});

saveBtn.addEventListener('click', () => {
  const data = window.selectedData;
  if (getStoredFlag(CUSTOM_SAVE_KEY)) {
    markActionComplete(saveBtn, 'Saved', saveFeedback, 'Custom details already saved on this device.');
    return;
  }
  const feedbackElem = document.getElementById('save-feedback');
  feedbackElem.innerHTML = '<div class="spinner" style="display: block;"></div> Saving...';

  const formData = new URLSearchParams();
  formData.append('payload', JSON.stringify(data));

  fetch('https://script.google.com/macros/s/AKfycbxYI6S6sg_D_ATJfc-jvzQqgZ1guntu2gGrZTztXV39N57lvvPO-Pp2qz-74zOe9cI/exec', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(result => {
    markActionComplete(saveBtn, 'Saved', saveFeedback, 'You successfully saved your custom details!');
    setStoredFlag(CUSTOM_SAVE_KEY);
    console.log(result);
  })
  .catch(error => {
    feedbackElem.innerHTML = '';
    alert('Save failed. Please try again or check the console for details.');
    console.error('Error saving:', error);
  });
});

shareBtn.addEventListener('click', () => {
  if (!window.selectedData) {
    alert('Please review and proceed with your custom selection before sharing.');
    return;
  }
  if (!getStoredFlag(CUSTOM_SAVE_KEY)) {
    warnAction(shareFeedback, 'Please save your custom details before sharing.');
    return;
  }
  if (getStoredFlag(CUSTOM_SHARE_KEY)) {
    markActionComplete(shareBtn, 'Shared', shareFeedback, 'Custom bundle already shared on this device.');
    return;
  }
  const data = window.selectedData;
  const phone = '+2347036805391';
  const message = `Hi, this is ${data.firstName} ${data.lastName}. My selections: ${data.items.join(', ')}. Total: ₦${data.total}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  setStoredFlag(CUSTOM_SHARE_KEY);
  markActionComplete(shareBtn, 'Shared', shareFeedback, 'Shared with the financial secretary.');
  window.location.href = url;
});
