let inputPalette = ["-", "-", "-", "-", "-", "-"];

function generate() {
    let json_data = {
        "adjacency": [
            1, 75, 33, 45, 31,
            75, 1, 58, 51, 77,
            33, 58, 1, 0, 0,
            45, 51, 0, 1, 0,
            31, 77, 0, 0, 1
        ],
        "mode": "transformer",
        "num_colors": 5,
        "num_results": 1,
        "palette": inputPalette,
        "temperature": "1.5"
    };

    fetch("https://api.huemint.com/color", {
        body: JSON.stringify(json_data),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        method: "POST"
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        let palette = data.results[0].palette;
        document.getElementById("palette-container").dataset.value = JSON.stringify(palette);
        let divs = document.getElementsByClassName("color");
        for (let x = 0; x < 5; x++) {
            let color = palette[x];
            divs[x].style.backgroundColor = color;
        }
        let cards = document.getElementsByClassName("color-card");
        for (let x = 0; x < 5; x++) {
            cards[x].dataset.value = palette[x];
        }
    });
}

function copy(x) {
    if (x.dataset.value != undefined) {
        navigator.clipboard.writeText(x.dataset.value).then(function () {
            document.getElementById("alert").innerHTML = "color " + x.dataset.value + " copied to your clipboard";
            document.getElementById("alert").style.opacity = "1";
            setTimeout(function () {
                document.getElementById("alert").style.opacity = "0";
            }, 3000);
        });
    }
}

function copyAll() {
    navigator.clipboard.writeText(document.getElementById("palette-container").dataset.value).then(function () {
        document.getElementById("alert").innerHTML = "palette copied to your clipboard";
        document.getElementById("alert").style.opacity = "1";
        setTimeout(function () {
            document.getElementById("alert").style.opacity = "0";
        }, 3000);
    });
}

function lock(e, x) {
    e.stopPropagation();
    let y = document.getElementsByClassName("lock")[x];

    if (y.dataset.locked == "false") {
        inputPalette[x] = document.getElementsByClassName("color-card")[x].dataset.value;
        y.children[0].innerHTML = "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>";
        y.dataset.locked = "true";
    } else {
        inputPalette[x] = "-";
        y.children[0].innerHTML = "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 9.9-1\"/>";
        y.dataset.locked = "false";
    }
}

let isKeyDown = false;

function keyCommands(e) {
    e.stopPropagation();
    if (isKeyDown == false && (e.key == "n" || e.key == "N" || e.code == "keyN" || e.keyCode == 78)) {
        generate();
    } else if (isKeyDown == false && (e.key == "c" || e.key == "C" || e.code == "keyC" || e.keyCode == 67)) {
        copyAll();
    } else if (isKeyDown == false && (e.key == " " || e.code == "Space" || e.keyCode == 32 || e.key == "Enter" || e.code == "Enter" || e.keyCode == 13)) {
        copy(e.target);
    }
    isKeyDown = true;
}

function keyUp() {
    isKeyDown = false;
}
