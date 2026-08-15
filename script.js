document.getElementById("loginButton").addEventListener("click", function () {

    const backendURL = "http://10.0.2.44:5000/login";

    const responseBox = document.getElementById("response");

    responseBox.innerHTML =
        "<div class='loading'>⏳ Fetching data from App Server...</div>";

    fetch(backendURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText
            );
        }

        return response.json();
    })

    .then(data => {

        if (data.username && data.email) {

            responseBox.innerHTML = `
                <div class="user-card">
                    <h3>✅ User Found</h3>

                    <p>
                        <strong>Username:</strong>
                        ${data.username}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${data.email}
                    </p>
                </div>
            `;

        } else {

            responseBox.innerHTML = `
                <div class="user-card">
                    ⚠️ No user data found!
                </div>
            `;
        }
    })

    .catch(error => {

        console.error(error);

        responseBox.innerHTML = `
            <div class="user-card">
                ❌ Failed to load data!
            </div>
        `;
    });

});
