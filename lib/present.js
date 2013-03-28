var fs = require("fs");
var markdown = require("node-markdown").Markdown;

var content = {
    "title": null,
    "data": [[""]]
};

var options = {
    template: "media/present.html",
    css: "media/present.css",
    script: "media/present.js",
    infile: null,
    outfile: null,
    split: 2
};

var i, option;

for(i=2; i<process.argv.length; i++) {
    option = process.argv[i];

    if(/--?t/.test(option)) {
        i++;
        options.template = process.argv[i];
    } else if(/--?c/.test(option)) {
        i++;
        options.css = process.argv[i];
    } else if(/--?o/.test(option)) {
        i++;
        options.outfile = process.argv[i];
    } else if(/--?s/.test(option)) {
        i++;
        options.split = parseInt(process.argv[i]);
    } else {
        options.infile = process.argv[i];
    }
}

if(!options.infile) {
    console.log("Need file plzkthx");
    process.exit(1);
}

var pageSplitPattern = new RegExp("^\\s*" + new Array(options.split + 1).join("#") + "[^#]");
var partSplitPattern = new RegExp("^\\s*(\\*|" + new Array(options.split + 2).join("#") + ")");

function addLine(line) {
    var currentPage = content.data.length - 1;
    var currentPart = content.data[currentPage].length - 1;

    content.data[currentPage][currentPart] += line + "\n";
}

function newPage() {
    var currentPage = content.data.length - 1;

    if(content.data[currentPage].length > 0) {
        content.data.push([""]);
    }
}

function newPart() {
    var currentPage = content.data.length - 1;

    content.data[currentPage].push("");
}

fs.readFile(options.infile, "utf8", function(err, data) {
    if(err) {
        console.log(err);
        process.exit(1);
    }

    data.split("\n").forEach(function(line) {
        if(pageSplitPattern.test(line)) {
            newPage();
        } else if(partSplitPattern.test(line)) {
            newPart();
        }

        addLine(line);
    });

    content.data = content.data.map(function(page) {
        return page.map(function(part) {
            return markdown(part);
        });
    });

    fs.readFile(options.script, "utf8", function(err, script) {
        if(err) {
            console.log(err);
            process.exit(1);
        }

        script = script.replace(/\{\{\s*data\s*\}\}/, JSON.stringify(content.data));

        fs.readFile(options.template, "utf8", function(err, template) {
            if(err) {
                console.log(err);
                process.exit(1);
            }

            template = template.replace(/\{\{\s*script\s*\}\}/, script);

            console.log(template);
        });
    });
});
