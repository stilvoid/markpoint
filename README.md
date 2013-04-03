# MarkPoint

Markpoint is a script for converting markdown documents into HTML presentations

## Installation

MarkPoint is in [npm](http://npmjs.org) and can be installed with:

    npm install -g markpoint

## Usage

    markpoint [options] <input file>

    -h | --help             This help text
    -t | --template <file>  Use <file> as HTML template
    -c | --css <file>       Use <file> for css
    -n | --name             Set the presentation name
    -s | --split <n>        Split pages by headings of level <n> or lower (default 2, min 1)
    -o | --output <file>    Output to <file> instead of stdout

## Input format

The input file should be text formatted as [markdown](http://daringfireball.net/projects/markdown/).

Headings must use `#` syntax rather than underlines.

Markpoint will split the content into pages using headings. The highest-level heading that will be used to split pages can be set with the `-s` option.

Markpoint will split pages into parts (that are hidden until you click through the presentation) by higher-level headings and bullet points (`*`).
