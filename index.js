#!/usr/bin/env node
const fs = require('fs');
const marked = require('marked');
const slugify = require('slugify');
const EOL = require('os').EOL;

const excludedHeadings = ['Table of Contents'];
const headingDepthStart = 2;
const headingDepthEnd = 6;
const listCharacter = '-';
const indentCharacter = ' ';
const indentSize = 2;
const args = process.argv.slice(2);
const startToc = '<!-- START TOC -->';
const endToc = '<!-- END TOC -->';
const tocPlaceholder = new RegExp(`${startToc}.*[\\s\\S]*?${endToc}`, 'g');

if (args.length && !!args[0].match(/.*\.(md|markdown)$/)) {
	const file = args[0];
	fs.readFile(file, 'utf8', (error, data) => {
		if (error) {
			console.log(`[-] Error reading file ${file}${EOL}${error}`);
			process.exit(1);
		} else {
			const headings = marked.lexer(data).filter(token => {
				return token.type === 'heading'
					&& (token.depth >= headingDepthStart && token.depth <= headingDepthEnd)
					&& !excludedHeadings.includes(token.text)
			});
			const toc = headings.map(heading => {
				const indentation = indentCharacter.repeat((heading.depth - headingDepthStart) * indentSize);
				return `${indentation}${listCharacter} [${heading.text}](#${slugify(heading.text, { lower: true })})`
			});

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
				console.log(`[!] No matching headings found in ${file}`);
				process.exit();
			}
		}
	});
} else {
	console.log('[-] No Markdown file (*.md or *.markdown) specified.');
	process.exit(1);
}
