import {once} from 'node:events';
import {createWriteStream, WriteStream} from 'node:fs';
import {finished} from 'node:stream/promises';
import {Writer} from './writer.interface.js';

export class TsvFileWriter implements Writer {
  private readonly stream: WriteStream;

  constructor(path: string) {
    this.stream = createWriteStream(path, {flags: 'w', encoding: 'utf-8'});
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      await once(this.stream, 'drain');
    }
  }

  public async close(): Promise<void> {
    this.stream.end();
    await finished(this.stream);
  }
}
