var currentPage = 0;
var currentPart = 0;

var pages = {{data}};

function display() {
var i;

document.getElementById("main").innerHTML = "";

for(var i=0; i<=currentPart; i++) {
    document.getElementById("main").innerHTML += pages[currentPage][i];
}


document.getElementById("pageCount").innerHTML = (currentPage + 1) + " / " + pages.length;

window.scrollTo(0, document.body.scrollHeight);
}

function next() {
currentPart++;

if(currentPart >= pages[currentPage].length) {
    currentPart = 0;
    currentPage = (currentPage + 1) % pages.length;
}

display();
}

function previous() {
currentPart--;

if(currentPart < 0) {
    currentPage = (currentPage + pages.length - 1) % pages.length;
    currentPart = pages[currentPage].length - 1;
}

display();
}

window.onload = function() {
display();
};

window.onmousedown = function(e) {
e.preventDefault();

if(e.button === 0) {
    next();
} else if (e.button === 2) {
    previous();
}

return false;
};

window.oncontextmenu = function(e) {
e.preventDefault();

return false;
};
