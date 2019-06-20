#!/usr/bin/env node
const fs = require('fs');
const marked = require('marked');
const slugify = require('slugify');

const args = process.argv.slice(2);
const startToc = '<!-- START TOC -->';
const endToc = '<!-- END TOC -->';
const listCharacter = '-';
const excludedHeading = 'Table of Contents';
const headingDepth = 2;
const tocPlaceholder = new RegExp(`${startToc}.*[\\s\\S]*${endToc}`);

if (args.length && !!args[0].match(/.*\.(md|markdown)$/)) {
	const file = args[0];
	fs.readFile(file, 'utf8', (error, data) => {
		if (error) {
			console.log(`[-] Error reading file ${file}`);
			console.log(error);
			process.exit(1);
		} else {
			const headings = marked.lexer(data).filter(token => (token.type === 'heading' && token.depth === headingDepth && token.text !== excludedHeading));
			const toc = headings.map(heading => `${listCharacter} [${heading.text}](#${slugify(heading.text, { lower: true })})`);

			if (toc.length) {
				fs.writeFile(file, data.replace(tocPlaceholder, `${startToc}\n${toc.join('\n')}\n${endToc}`), error => {
					if (error) {
						console.log(`[-] Error writing data to ${file}`);
						console.log(error);
						process.exit(1);
					} else {
						console.log(`[+] TOC written to ${file}`);
						process.exit();
					}
				});
			} else {
				console.log(`[!] No level ${headingDepth} headings found in ${file}`);
				process.exit();
			}
		}
	});
} else {
	console.log('[-] No Markdown file (*.md or *.markdown) specified.');
	process.exit(1);
}
