
const submit_btn = document.getElementById("_btn")
const msgBox = document.getElementById("msg_box");

submit_btn.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log("hi there!")

    const userData = {
        name: document.querySelector('#A1').value,
        username: document.querySelector('#A2').value,
        email: document.querySelector('#A3').value,
        phone: document.querySelector('#A4').value,
        password: document.querySelector('#A5').value
    };
    if (!userData.name || !userData.username || !userData.email || !userData.phone || !userData.password) {
        return alert("Please fill complete details!");
    }
    // console.log(userData);
    else {
        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const result = await response.json();

            if (response.ok) {
                alert('Signup successful!', window.location.href = "Login.html");

            } else {
                alert('Error: ' + (result.message || "Signup failed"));
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}
)



