import fs from 'fs';
import MagicString from 'magic-string';

export class MagicFile extends MagicString {
  private filePath: string;

  constructor(filePath: string) {
    if (!fs.existsSync(filePath)) throw new Error('File not found');
    const content = fs.readFileSync(filePath, 'utf-8');
    super(content);
    this.filePath = filePath;
  }

  saveFile() {
    fs.writeFileSync(this.filePath, this.toString(), 'utf-8');
  }

  private getLineOffset(lineNumber: number) {
    const lines = this.original.split('\n');
    if (lineNumber < 0 || lineNumber >= lines.length) {
      throw new Error('Line number out of range');
    }

    return lines
      .slice(0, lineNumber)
      .reduce((offset, line) => offset + line.length + 1, 0); // +1 for the newline character
  }

  /**
   * Set the MagicString offset by the first line that includes the search.
   *
   * @param search Search string or RegEx
   * @param offsetLineNumber Line number after which to start searching (0-based index)
   * @returns MagicString instance
   */
  findOffsetLine(search: string | RegExp, offsetLineNumber: number = 0) {
    const lines = this.original.split('\n');
    if (offsetLineNumber < 0 || offsetLineNumber >= lines.length) {
      throw new Error('Offset line number out of range');
    }

    const lineIndex = lines
      .slice(offsetLineNumber + 1)
      .findIndex((line) =>
        typeof search === 'string' ? line.includes(search) : search.test(line)
      );

    if (lineIndex === -1) {
      throw new Error('Content not found');
    }

    const adjustedLineIndex = offsetLineNumber + 1 + lineIndex;

    this.offset = this.getLineOffset(adjustedLineIndex);

    return this;
  }

  /**
   * Set the MagicString offset by line index. (Lines start at 1.)
   *
   * @param {number} lineNumber
   * @returns MagicString instance
   */
  offsetLine(lineNumber: number) {
    const lines = this.original.split('\n');
    if (lineNumber <= 0 || lineNumber > lines.length) {
      throw new Error('Line number out of range');
    }

    this.offset = this.getLineOffset(lineNumber - 1);

    return this;
  }

  private getEndOfLineIndex() {
    const lineEndIndex = this.original.indexOf('\n', this.offset);
    const endIndex =
      lineEndIndex === -1 ? this.original.length : lineEndIndex - this.offset;
    return endIndex;
  }

  appendToLine(content: string) {
    const endOfLineIndex = this.getEndOfLineIndex();
    return this.appendRight(endOfLineIndex, content);
  }

  replaceLine(content: string) {
    const endOfLineIndex = this.getEndOfLineIndex();
    return this.overwrite(this.offset, endOfLineIndex, content);
  }

  prependToLine(content: string) {
    return this.appendLeft(0, content);
  }

  locations(search: string) {
    const start = this.original.indexOf(search);
    if (start === -1) throw new Error('Search string not found');
    const end = start + search.length;
    return { start, end };
  }
}
