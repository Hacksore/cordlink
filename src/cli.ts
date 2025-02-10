#!/usr/bin/env node
import clipboardy from 'clipboardy';
import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const DEFAULT_EMOJI = ':japanese_goblin:';

program
  .description('Convert the direct link to a voice channel to markdown')
  .option('-e, --emoji [emoji]', 'the emoji to use on the start end and', DEFAULT_EMOJI)
  .option('-b, --block [char]', 'the block char to use', '▓')
  .option('-l, --length [number]', 'the amount of block chars to use', '666')
  .option('-v, --verbose', 'raise the verbosity over 9001')
  .argument('[inviteLink]', 'discord invite link to convert')
  .action((link, options) => {
    try {
      const cordLinkFileExists = fs.existsSync(path.join(os.homedir(), '.cordlink'));

      // check if they have a cordlink on the fs
      if (!link && cordLinkFileExists) {
        const cordlink = fs.readFileSync(path.join(os.homedir(), '.cordlink'), 'utf-8');
        link = cordlink;
      }

      if (!link) {
        program.help();
      }

      const url = new URL(link);
      const blockSize = Number(options.length);
      const blockString = Array(blockSize).fill(options.block).join('');
      const markdownText = `# ${options.emoji}👉[${blockString}](<${url}>)👈${options.emoji}`;

      if (options.verbose) {
        console.log('Link:', link);
        console.log('Emoji:', options.emoji);
        console.log('Block size:', blockSize);
        console.log('Markdown', markdownText);
      }

      // copy to clipboard
      clipboardy.write(markdownText);

      // write it their home directory for later usage as ~/.cordlink
      fs.writeFileSync(path.join(os.homedir(), '.cordlink'), link);

      console.log('✅ VC markdown link copied to clipboard!');
    } catch (err: any) {
      console.error(err.message);
    }
  });

program.parse();

