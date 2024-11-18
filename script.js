// Sidebar

const graphicsLeft = document.getElementById("graphics-arrow-left");
const graphicsRight = document.getElementById("graphics-arrow-right");
const grpahicsValues = document.getElementById("graphics-values");

window.graphics = parseInt(localStorage.getItem("graphics") || 2);

updateProperties();

graphicsLeft.addEventListener("click", () => {
    window.graphics -= 1;

    updateProperties();
});

graphicsRight.addEventListener("click", () => {
    window.graphics += 1;

    updateProperties();
});

function updateProperties() {
    if (window.graphics < 0) window.graphics = 2;
    if (window.graphics > 2) window.graphics = 0;

    localStorage.setItem("graphics", window.graphics);

    Array.from(grpahicsValues.children).forEach((val) => {
        val.style.translate = `0 -${window.graphics * 100}%`;
    });

    document.body.style.setProperty("--graphics", window.graphics);
}

// Cursor

const cursor = document.getElementById("cursor");
const skillsText = document.getElementById("skills-text");

document.addEventListener("mousemove", (event) => {
    if (window.graphics == 0) {
        cursor.style.display = "none";
        skillsText.style.textShadow = "unset";

        return;
    } else if (window.graphics < 2) {
        skillsText.style.animation = "none";
    } else if (window.graphics == 2) {
        skillsText.style.animation = "hover 5s ease-in-out infinite";
    } else {
        cursor.style.display = "block";
    }

    const {clientX, clientY} = event;

    cursor.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, {duration: 3000, fill: "forwards"});

    const xChange = (clientX / window.innerWidth - 0.5) * 2;
    const yChange = (clientY / window.innerHeight - 0.5) * 2;

    text3d(skillsText, 10, -xChange, -yChange, "#ccc");
});

function text3d(el, layersNum, xPos, yPos, colour) {
    let layers = [];

    for (let layer = 0; layer < layersNum; layer += 1) {
        layers.push(`${xPos * (layer + 1)}px ${yPos * (layer + 1)}px 0 ${colour}`);
    }

    el.style.textShadow = layers.join(",");
}

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
    if (window.graphics == 0) {
        el.setAttribute("data-value", el.innerText);
        return;
    }

    const val = el.innerText;

    let i = 0;

    const interval = setInterval(() => {
        el.setAttribute("data-value", el.innerText.split("").map((char, index) => {
            if (index < i) {
                return val[index];
            }

            return chars[Math.floor(Math.random() * 26)]
        }).join(""));

        el.innerText = el.getAttribute("data-value");

        if (i >= val.length) clearInterval(interval);

        i += 1 / 5;
    }, 30);
}

// Skills section

const wrapper = document.getElementById("skills-preview");
const skills = document.getElementsByClassName("skill");


createAllLines();

function connectDots(dot1, dot2) {
    const canvas = document.getElementById("lines");
    const ctx = canvas.getContext('2d');

    // Resize the canvas to match the viewport size
    function resizeCanvas() {
        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;

        // Redraw all lines when resizing
        lines.forEach(line => drawLine(line.dot1, line.dot2));
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Draw a line connecting two dots
    function drawLine(dot1, dot2) {
        let tmp = dot1.style.left.split("");
        tmp.pop();
        tmp.join("");
        const topVal1 = parseFloat((tmp.join(""))) * canvas.width / 100;

        tmp = dot2.style.left.split("");
        tmp.pop();
        tmp.join("");
        const topVal2 = parseFloat((tmp.join(""))) * canvas.width / 100;

        tmp = dot1.style.top.split("");
        tmp.pop();
        tmp.join("");
        const leftVal1 = parseFloat((tmp.join(""))) * canvas.height / 100;

        tmp = dot2.style.top.split("");
        tmp.pop();
        tmp.join("");
        const leftVal2 = parseFloat((tmp.join(""))) * canvas.height / 100;

        const rect1 = dot1.getBoundingClientRect();
        const rect2 = dot2.getBoundingClientRect();

        const x1 = topVal1;
        const y1 = leftVal1;
        const x2 = topVal2;
        const y2 = leftVal2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#ffffff40';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Store lines so they can be redrawn on resize
    window.lines.push({ dot1, dot2 });
    drawLine(dot1, dot2);

    // Draw the new line
    drawLine(dot1, dot2);
}

function createAllLines() {
    window.lines = [];

    Array.from(skills).forEach((skill1, skillIdx1) => {
        Array.from(skills).forEach((skill2, skillIdx2) => {
            if (skillIdx1 > skillIdx2) {
                connectDots(skill1, skill2);
            }
        });
    });
}

const positions = [[20, 100], [100, 80], [0, 60], [60, 40], [80, 20], [40, 0]];

randomisePositions();

Array.from(skills).forEach((skill) => {
    skill.style.left = `${skill.getAttribute("data-target-x")}%`;
    skill.style.top = `${skill.getAttribute("data-target-y")}%`;
});

setInterval(() => {
    randomisePositions();
}, 10000);

function randomisePositions() {
    let arr = Array.from(positions);

    Array.from(skills).forEach((skill) => {
        const item = arr[Math.floor(Math.random() * arr.length)];

        skill.setAttribute("data-target-x", item[0]);
        skill.setAttribute("data-target-y", item[1]);

        skill.style.zIndex = 1 + Math.round(Math.random());

        const i = arr.indexOf(item);
        if (i > -1) {
            arr.splice(i, 1);
        }
    });
}

let lastTimestamp = 0;

function gameLoop(timestamp) {
    let delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (window.graphics > 0) {
        Array.from(skills).forEach((skill) => {
            let xPos = parseFloat(skill.getAttribute("data-x")) || Math.random() * 100;
            let yPos = parseFloat(skill.getAttribute("data-y")) || Math.random() * 100;
    
            xPos += (skill.getAttribute("data-target-x") - xPos) / 3 * delta;
            yPos += (skill.getAttribute("data-target-y") - yPos) / 3 * delta;
    
            skill.style.left = `${xPos}%`;
            skill.style.top = `${yPos}%`;
    
            skill.setAttribute("data-x", xPos);
            skill.setAttribute("data-y", yPos);
        });
    }

    if (window.graphics == 2) {
        createAllLines();
    } else {
        const canvas = document.getElementById("lines");

        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);