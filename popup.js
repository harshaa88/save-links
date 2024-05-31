document.addEventListener('DOMContentLoaded', function () {
  const linksContainer = document.getElementById('links-container');
  const addLinkButton = document.getElementById('add-link');
  const saveLinksButton = document.getElementById('save-links');

  // Load saved links from storage when the popup is opened
  chrome.storage.sync.get(['savedLinks'], function (result) {
    const savedLinks = result.savedLinks || [];
    savedLinks.forEach(link => {
      const [title, url] = link.split('|'); // Splitting title and URL
      createLinkElement(title, url);
    });
  });

  addLinkButton.addEventListener('click', function () {
    const linkTitle = prompt('Enter the link title:');
    const linkURL = prompt('Enter the link URL:');
    
    if (linkTitle !== null && linkURL !== null) {
      createLinkElement(linkTitle, linkURL);
    }
  });

  saveLinksButton.addEventListener('click', function () {
    saveLinksToStorage();
  });

  function createLinkElement(title, url) {
    const linkContainer = document.createElement('div');
    linkContainer.classList.add('link-container');

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = title;
    titleInput.placeholder = 'Link Title';
    titleInput.readOnly = true; // Set the input as read-only to display the title only

    const urlInput = document.createElement('input');
    urlInput.type = 'hidden';
    urlInput.value = url;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const editButton = createButton('\uf044', function () {
      // Implement edit functionality
      const updatedTitle = prompt('Edit the link title:', titleInput.value);
      const updatedURL = prompt('Edit the link URL:', urlInput.value);
      if (updatedTitle !== null && updatedURL !== null) {
        titleInput.value = updatedTitle;
        urlInput.value = updatedURL;
      }
      saveLinksToStorage();
    });

    const copyButton = createButton('\uf0c5', function () {
      // Implement copy functionality
      navigator.clipboard.writeText(urlInput.value)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Unable to copy to clipboard', err));
    });

    const deleteButton = createButton('\uf2ed', function () {
      // Delete textbox and associated buttons
      linksContainer.removeChild(linkContainer);
      saveLinksToStorage();
    });

    linkContainer.appendChild(titleInput);
    linkContainer.appendChild(urlInput);
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(deleteButton);
    linkContainer.appendChild(buttonContainer);

    linksContainer.appendChild(linkContainer);

    saveLinksToStorage();
  }

  function saveLinksToStorage() {
    const linkContainers = document.querySelectorAll('.link-container');
    const links = Array.from(linkContainers).map(container => {
      const titleInput = container.querySelector('input:nth-child(1)');
      const urlInput = container.querySelector('input:nth-child(2)');
      return `${titleInput.value}|${urlInput.value}`;
    });

    chrome.storage.sync.set({ 'savedLinks': links }, function () {
      console.log('Links saved:', links);
    });
  }

  function createButton(icon, onClick) {
    const button = document.createElement('button');
    button.onclick = onClick;

    const iconElement = document.createElement('i');
    iconElement.classList.add('fas');
    iconElement.innerHTML = icon;

    button.appendChild(iconElement);
    return button;
  }
});
