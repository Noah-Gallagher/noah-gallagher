// Cursor

const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (event) => {
    const {clientX, clientY} = event;

    cursor.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, {duration: 3000, fill: "forwards"});
});

// Scroll animations

window.addEventListener("scroll", setScrollVar);
window.addEventListener("resize", setScrollVar);

function setScrollVar() {
    const htmlEl = document.documentElement;
    const screenHeightScrollPercent = htmlEl.scrollTop / htmlEl.clientHeight;

    htmlEl.style.setProperty("--scroll", screenHeightScrollPercent * 100);
}

setScrollVar();

// On scroll

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add("show");

            if (entry.target.classList.contains("hack-effect")) {
                textEffect(entry.target);
            }
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Text hack effect

const chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', // Uppercase letters
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', // Lowercase letters
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', // Numbers
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '[', ']', '{', '}', '|', ';', ':', ',', '.', '<', '>', '?', '/', '~', '`', '-', '=', '\\' // Common symbols
];

function textEffect(el) {
    const val = el.innerText;

    let i = 0;

    const interval = setInterval(() => {
        el.setAttribute("data-value", el.innerText.split("").map((char, index) => {
            if (index < i) {
                return val[index];
            }

            return chars[Math.floor(Math.random() * 26)]
        }).join(""));

        if (i >= val.length) clearInterval(interval);

        i += 1 / 8;
    }, 30);
}