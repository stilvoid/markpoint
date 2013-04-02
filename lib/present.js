var fs = require("fs");
var path = require("path");
var markdown = require("node-markdown").Markdown;

var content = {
    "title": null,
    "data": [[""]]
};

var options = {
    template: path.join(__dirname, "..", "media", "present.html"),
    //css: path.join(__dirname, "..", "media", "present.css"),
    script: path.join(__dirname, "..", "media", "present.js"),
    infile: null,
    outfile: null,
    split: 2
};

function printHelp() {
    console.log("Usage: markpoint [options] <input file>");
    console.log();
    console.log("-h | --help             This help text");
    console.log("-t | --template <file>  Use <file> as HTML template");
    //console.log("-c | --css <file>       Use <file> for css");
    console.log("-n | --name             Set the presentation name");
    console.log("-s | --split <n>        Split pages by headings of level <n> or lower (default 2, min 1)");
    console.log("-o | --output <file>    Output to <file> instead of stdout");
    console.log();

    process.exit(1);
}

var i, option;

try {
    for(i=2; i<process.argv.length; i++) {
        option = process.argv[i];

        if(/--?t/.test(option)) {
            i++;
            options.template = process.argv[i];
        } else if(/--?h/.test(option)) {
            printHelp();
        } else if(/--?c/.test(option)) {
            i++;
            options.css = process.argv[i];
        } else if(/--?n/.test(option)) {
            i++;
            content.title = process.argv[1];
        } else if(/--?o/.test(option)) {
            i++;
            options.outfile = process.argv[i];
        } else if(/--?s/.test(option)) {
            i++;
            options.split = parseInt(process.argv[i]);

            if(options.split < 1) {
                printHelp();
            }
        } else {
            options.infile = process.argv[i];
        }
    }
} catch(e) {
    printHelp();
}

if(!options.infile) {
    console.log("No input file supplied!");
    console.log();

    printHelp();
}

var titlePattern = /^\s*#\s+(.+)\s*$/;
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
        console.log("Could not read input file");
        process.exit(1);
    }

    data.split("\n").forEach(function(line) {
        // Title
        if(!content.title && titlePattern.test(line)) {
            content.title = titlePattern.exec(line)[1];
        }

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
            console.log("Error reading script file");
            process.exit(1);
        }

        script = script.replace(/\{\{\s*data\s*\}\}/, JSON.stringify(content.data));

        fs.readFile(options.template, "utf8", function(err, template) {
            if(err) {
                console.log("Could not read HTML template");
                process.exit(1);
            }

            template = template.replace(/\{\{\s*title\s*\}\}/g, content.title);

            template = template.replace(/\{\{\s*script\s*\}\}/, script);

            if(options.outfile) {
                fs.writeFile(options.outfile, template, function(err) {
                    if(err) {
                        console.log("Could not write to output file");
                    }
                });
            } else {
                console.log(template);
            }
        });
    });
});
