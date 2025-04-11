import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mock from 'mock-fs';
import dedent from 'dedent';
import fs from 'fs';
import { MagicFile } from './magicFile';

describe('MagicFile Tests', () => {
  beforeEach(() => {
    mock({
      'example.ts': dedent`
        const x = 10;
        const y = 20;
        console.log(x + y);
        const z = x + y;
      `,
      'example.js': dedent`
        let a = 5;
        let b = 10;
        console.log(a + b);
      `,
      'example.json': dedent`
        {
          "key1": "value1",
          "key2": "value2"
        }
      `,
      'example.svelte': dedent`
        <script>
          let count = 0;
        </script>
        <p>The total is {count}.</p>
      `,
      'example.scss': dedent`
        .class {
          color: red;
        }
      `,
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('should append content to a specific line in a .ts file', () => {
    const magicFile = new MagicFile('example.ts');

    magicFile.findOffsetLine(/console.log/).appendToLine(' // Added comment');

    magicFile.findOffsetLine('const z =').prependToLine('// ');

    magicFile.saveFile();

    const updatedContent = fs.readFileSync('example.ts', 'utf-8');
    expect(updatedContent).toContain('console.log(x + y); // Added comment');
    expect(updatedContent).toContain('// const z');
  });

  it('should prepend content to a specific line in a .js file', () => {
    const magicFile = new MagicFile('example.js');

    magicFile
      .offsetLine(1)
      .prependLeft(0, '// Initialize variables\n')
      .saveFile();

    const updatedContent = fs.readFileSync('example.js', 'utf-8');
    expect(updatedContent).toContain('// Initialize variables\nlet a = 5;');
  });

  it('should overwrite content in a .json file', () => {
    const magicFile = new MagicFile('example.json');
    const magicString = magicFile.findOffsetLine(/"key2": "value2"/);

    magicString.replaceLine('  "key2": "newValue"');
    magicString.saveFile();

    const updatedContent = fs.readFileSync('example.json', 'utf-8');
    expect(updatedContent).toContain('  "key2": "newValue"');
  });

  it('should append content to a specific line in a .svelte file', () => {
    const magicFile = new MagicFile('example.svelte');

    magicFile.replaceAll('count', 'number').saveFile();

    const updatedContent = fs.readFileSync('example.svelte', 'utf-8');
    expect(updatedContent).toContain(
      dedent`
      <script>
        let number = 0;
      </script>
      <p>The total is {number}.</p>
      `
    );
  });

  it('should overwrite content in a .scss file', () => {
    const magicFile = new MagicFile('example.scss');
    const magicString = magicFile.findOffsetLine('color: red;');

    magicString.overwrite(0, 11, 'color: blue;');
    magicString.saveFile();

    const updatedContent = fs.readFileSync('example.scss', 'utf-8');
    expect(updatedContent).toContain('color: blue;');
    expect(updatedContent).not.toContain('color: red;');
  });
});
