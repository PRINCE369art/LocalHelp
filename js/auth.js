const registerForm =
    document.getElementById("registerForm");

const loginForm =
    document.getElementById("loginForm");


if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const phone =
            document.getElementById("registerPhone").value.trim();

        const role =
            document.getElementById("registerRole").value;

        const password =
            document.getElementById("registerPassword").value;


        const message =
            document.getElementById("registerMessage");


        if (name.length < 3) {

            message.innerHTML =
                '<div class="alert alert-danger">Please enter a valid name.</div>';

            return;

        }


        if (!/^[0-9]{10}$/.test(phone)) {

            message.innerHTML =
                '<div class="alert alert-danger">Please enter a valid 10-digit phone number.</div>';

            return;

        }


        if (!role) {

            message.innerHTML =
                '<div class="alert alert-danger">Please select your role.</div>';

            return;

        }


        if (password.length < 6) {

            message.innerHTML =
                '<div class="alert alert-danger">Password must contain at least 6 characters.</div>';

            return;

        }


        message.innerHTML =
            '<div class="alert alert-success">Registration successful!</div>';

    });

}


if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        const message =
            document.getElementById("loginMessage");


        if (!email || !password) {

            message.innerHTML =
                '<div class="alert alert-danger">Please enter email and password.</div>';

            return;

        }


        message.innerHTML =
            '<div class="alert alert-success">Login successful! Backend authentication will be pending.</div>';

    });

}