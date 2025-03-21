console.log("Global JS loaded");

// Simple Counter Logic
    let count = 0;
    const counterButton = document.getElementById('counter');
    counterButton.addEventListener('click', () => {
      count++;
      counterButton.textContent = count;
    });