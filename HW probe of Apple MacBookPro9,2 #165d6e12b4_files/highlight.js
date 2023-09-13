var url = window.location.hash;
var id = url.substring(url.indexOf("#") + 1);
var colors = ["#B0B0B0", "#B8B8B8", "#C0C0C0", "#C8C8C8", "#D0D0D0", "#D8D8D8", "#E0E0E0", "#E8E8E8", "#F0F0F0", "#F4F4F4"];

var row = null;
var interval = null;
var counter = 0;

function highlight()
{
    if(counter > colors.length - 1)
    {
        clearInterval(interval);
        return;
    }
    
    if(!row)
    {
        if(!id.match(/^d\d+$/))
        {
            cell = document.getElementById(id);
            if(cell) {
                id = cell.parentElement.id;
            }
        }

        row = document.getElementById(id);
        if(row) {
            colors.push(row.style.backgroundColor);
        }
    }
    
    if(row) {
        row.style.backgroundColor = colors[counter++];
    }
}

function startTimer() {
    interval = setInterval(highlight, 100);
}

if(id) {
    window.onload = startTimer;
}
