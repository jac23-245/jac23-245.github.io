/* Login Page */


const BASE_URL = 'http://class';
const API_URL = 'https://yaran-soft.com/ghafor/raziq';

document.addEventListener('DOMContentLoaded', () => {

    // Load Sidebar
    loadSidebar();

    // Load Topbar
    loadTopbar();

    login();

    detectLanguageOnPageLoad();



});

function detectLanguageOnPageLoad() {
    const storedLang = localStorage.getItem('preferredLanguage');
    const defaultLang = storedLang || 'en';
    setLanguage(defaultLang);

  
    let langs = document.querySelectorAll('#languageSwitcher option');
    langs.forEach(lang => {

        if (lang.value === defaultLang) {
            lang.selected = true;
        }
    });


}


function changeDynamicselect() {
  const lang = localStorage.getItem('preferredLanguage') || 'en';

  fetch(`${BASE_URL}/lang/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      const options = document.querySelectorAll('#add_status option');
      options.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (data[optionLang]) {
          option.textContent = data[optionLang];
        }
      });
    })
    .catch(error => console.error('Error loading JSON:', error));
}



function updateStatusTexts() {
    const lang = localStorage.getItem('preferredLanguage') || 'en'; 
    fetch(`${BASE_URL}/lang/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            document.querySelectorAll('span[data-lang]').forEach(span => {
                const key = span.getAttribute('data-lang');
                if (data[key]) {
                    span.textContent = data[key];
                }
            });
        })
        .catch(error => console.error('Error loading translations:', error));
}



function changeDynamicLabels(){
    let lang = localStorage.getItem('preferredLanguage');
    lang = lang || 'en';
    
    fetch(`${BASE_URL}/lang/${lang}.json`)
        .then(response => response.json())
        .then(data => {

            let labels = document.querySelectorAll("[data-lang]");
            for (let i = 0; i < labels.length; i++) {
                let lbl = labels[i].getAttribute("data-lang");
                if (labels[i].getAttribute('data-lang') === lbl) {
                    labels[i].textContent = data[lbl];
                }
            }
        })
        .catch(error => console.log('Error loading JSON:', error));
}




function chooseLanguage() {
    const languageSwitcher = document.getElementById('languageSwitcher');
    setLanguage(languageSwitcher.value);

}

function setLanguage(lang) {

    fetch(`${BASE_URL}/lang/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            let labels = document.querySelectorAll("[data-lang]");
            for (let i = 0; i < labels.length; i++) {
                let lbl = labels[i].getAttribute("data-lang");
                if (labels[i].getAttribute('data-lang') === lbl) {
                    labels[i].textContent = data[lbl];

                    if (labels[i].tagName.toLowerCase() === 'input') {
                        labels[i].setAttribute('placeholder', data[lbl]);
                    }

                }
            }

            document.documentElement.setAttribute('dir', data['lb_dir']);
            document.documentElement.setAttribute('lang', lang);

            localStorage.setItem('preferredLanguage', lang);
        })
        .catch(error => console.log('Error loading JSON:', error));
}

// Logout User
function logoutUser() {
    if (window.confirm("Are you sure to logout")) {
        localStorage.removeItem("course_user_email");
        localStorage.removeItem("course_is_user_logged_in");
        window.location.assign(BASE_URL + "/login.html");
    }

}

// Simple email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function ToastMessage(title) {
    Toastify({
        text: title,
        duration: 3000,
        newWindow: true,
        close: true,
        className: "warning",
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

function checkIfUserIsLoggedIn() {

    const is_user_logged_in = localStorage.getItem("course_is_user_logged_in");

    if (is_user_logged_in != null) {
        return true;
    } else {
        return false;
    }
}

function loadSidebar() {
    if (document.getElementById('sidebar') != null && document.getElementById('sidebar') != undefined) {
        fetch(`${BASE_URL}/sidebar.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('sidebar').innerHTML = data;
                addActiveClassToSidebar();
            })
            .catch(error => console.error('Error loading sidebar:', error));
    }
}

function loadTopbar() {
    if (document.getElementById('topbar') != null && document.getElementById('topbar') != undefined) {
        fetch(`${BASE_URL}/topbar.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('topbar').innerHTML = data;
            })
            .catch(error => console.error('Error loading topbar:', error));
    }
}

function addActiveClassToSidebar() {
    // Get the current page URL
    const currentUrl = window.location.pathname;

    // Select all navigation links
    const navLinks = document.querySelectorAll('#sidebar a.nav-link');

    navLinks.forEach(link => {
        // Create a URL object to compare paths more reliably
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentUrl) {
            // Remove 'active' class from other links if needed
            // (Optional if only one link should be active)
            navLinks.forEach(l => l.classList.remove('active'));

            // Add 'active' class to the matching link
            link.classList.add('active');
        }
    });
}

function login() {

    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const btn_login = document.getElementById('btn_login');
    const login_spinner = document.getElementById('login_spinner');



    // Existing login form logic
    if (form != null) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();


            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Validate inputs
            let isValid = true;

            if (!email) {
                getAlertMessage("lbl_etner_username");
                isValid = false;
            }

            if (!password) {
                getAlertMessage("lbl_enter_password");
                isValid = false;
            }

            if (isValid) {

                btn_login.disabled = true;
                login_spinner.classList.remove("d-none");

                fetch('' + API_URL + '/login.php', {
                    method: 'POST', // Specify the method
                    headers: {
                        'Content-Type': 'application/json' // Set the content type if sending JSON
                    },
                    body: JSON.stringify({
                        username: email,
                        password: password
                    }) // Convert your data to JSON string
                })
                    .then(response => response.json()) // Parse the JSON response
                    .then(data => {
                        if (data.status == "success") {
                            localStorage.setItem("course_user_email", email);
                            localStorage.setItem("course_is_user_logged_in", true);
                            window.location.assign(BASE_URL + "/dashboard.html");
                        } else {

                            getAlertMessage("lbl_wrong_email_or_password");

                            btn_login.disabled = false;
                            login_spinner.classList.add("d-none");
                        }

                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        btn_login.disabled = false;
                        login_spinner.classList.add("d-none");
                    });
            }
        });
    }
}

function showAlertMessage(title, icon, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

function getAlertMessage(messageKey, titleKey='', type="toast", icon="") {
    const storedLang = localStorage.getItem('preferredLanguage');
    const lang = storedLang || 'en';

    let message = '';
    let title = '';
    fetch(`${BASE_URL}/lang/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            if (messageKey in data) {
                message = data[messageKey];
                title = data[titleKey];
            }
            if (type == "toast") {
                ToastMessage(message);
            } else {
                showAlertMessage(title, icon, message);
            }
        })
        .catch(error => console.error('Error loading JSON:', error));

}
