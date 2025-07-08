    
    console.log("theme js loaded");
    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
    
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light');
        localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light');
    }
    
    // Submenu toggle
    const navItems = document.querySelectorAll('.nav-item.has-submenu');
    
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            item.classList.toggle('open');
        });
    });
    
    // Initialize charts
    initCharts();


function initCharts() {
    // Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Users',
                data: [320, 450, 380, 510, 620, 750],
                borderColor: '#ff69b4',
                backgroundColor: 'rgba(255, 105, 180, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }, {
                label: 'Active Users',
                data: [500, 600, 550, 700, 800, 900],
                borderColor: '#9370db',
                backgroundColor: 'rgba(147, 112, 219, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text')
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border')
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                    }
                },
                y: {
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border')
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                    }
                }
            }
        }
    });
    
    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Direct', 'Organic', 'Referral', 'Social'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: [
                    '#ff69b4',
                    '#9370db',
                    '#6b46c1',
                    '#a78bfa'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text')
                    }
                }
            }
        }
    });
    
    // Update charts on theme change
    const observer = new MutationObserver(function() {
        lineChart.update();
        pieChart.update();
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}


// Dropdown functionality
const notificationsToggle = document.getElementById('notificationsToggle');
const notificationsDropdown = document.getElementById('notificationsDropdown');
const userDropdownToggle = document.getElementById('userDropdownToggle');
const userDropdownMenu = document.getElementById('userDropdownMenu');
const dropdownOverlay = document.createElement('div');
dropdownOverlay.className = 'dropdown-overlay';
document.body.appendChild(dropdownOverlay);

function toggleDropdown(dropdown, show) {
    if (show) {
        dropdown.classList.add('show');
        dropdownOverlay.style.display = 'block';
    } else {
        dropdown.classList.remove('show');
        dropdownOverlay.style.display = 'none';
    }
}

notificationsToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isShowing = notificationsDropdown.classList.contains('show');
    
    // Close all other dropdowns
    toggleDropdown(userDropdownMenu, false);
    
    // Toggle this dropdown
    toggleDropdown(notificationsDropdown, !isShowing);
});

userDropdownToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isShowing = userDropdownMenu.classList.contains('show');
    
    // Close all other dropdowns
    toggleDropdown(notificationsDropdown, false);
    
    // Toggle this dropdown
    toggleDropdown(userDropdownMenu, !isShowing);
});

// Close dropdowns when clicking outside
dropdownOverlay.addEventListener('click', function() {
    toggleDropdown(notificationsDropdown, false);
    toggleDropdown(userDropdownMenu, false);
});

// Close dropdowns when clicking on document (except the toggle buttons)
document.addEventListener('click', function(e) {
    if (!notificationsToggle.contains(e.target) && !notificationsDropdown.contains(e.target)) {
        toggleDropdown(notificationsDropdown, false);
    }
    
    if (!userDropdownToggle.contains(e.target) && !userDropdownMenu.contains(e.target)) {
        toggleDropdown(userDropdownMenu, false);
    }
});