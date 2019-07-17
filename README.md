# Markdown Table of Contents Generator

Crude table of contents generator for Markdown files.

This script takes all level 2 to 6 headings in a Markdown file and generators a TOC with them. A heading named `Table of Contents` is ignored by default.

## How to use

Install dependencies by running: `npm install`.

The TOC is placed between the TOC comments in the file:

```
<!-- START TOC -->
<!-- END TOC -->
```

## Generating the TOC

To generate a TOC run the following command:

```
    $ npm start <filename>.md
```
