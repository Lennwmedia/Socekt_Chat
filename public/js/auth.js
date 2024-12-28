const myform = document.querySelector('form');

const url = "http://localhost:8080/api/auth/";

myform.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {};
    
    for ( let el of myform.elements ) {
        if ( el.name.length > 0 ) 
            formData[el.name] = el.value;
    }

     fetch(url + "login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then((resp) => resp.json())
    .then(({ token, msg }) => {
        if ( msg ) {
            return console.error(msg);
        }

        localStorage.setItem("token", token);
    })
    .catch(err => console.log(err)) 
});

function handleCredentialResponse(response) {

    const data = { id_token: response.credential};

    fetch(url + "google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( data ),
    })
        .then((resp) => resp.json())
        .then(({ token }) => {

            localStorage.setItem("token", token);
        })
        .catch(console.warn);
}

const button = document.getElementById("google_signout");

button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
        localStorage.clear();
        location.reload();
    });
};

