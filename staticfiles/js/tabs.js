
window.onload = ()=> {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

  function showTab(tabId) {
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
  }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          showTab(button.getAttribute('data-tab'));
        });
      });
}

