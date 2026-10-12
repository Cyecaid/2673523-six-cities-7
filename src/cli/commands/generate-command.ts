import axios from 'axios';
import {MockServerData} from '../../shared/types/index.js';
import {TsvOfferGenerator} from '../../shared/libs/offer-generator/index.js';
import {TsvFileWriter} from '../../shared/libs/file-writer/index.js';
import {getErrorMessage} from '../../shared/helpers/index.js';
import {CliCommand} from './cli-command.interface.js';

export class GenerateCommand implements CliCommand {
  public readonly name = '--generate';

  private async load(url: string): Promise<MockServerData> {
    try {
      const {data} = await axios.get<MockServerData>(url);
      return data;
    } catch (error) {
      throw new Error(`Не удалось загрузить данные с ${url}: ${getErrorMessage(error)}`);
    }
  }

  private async write(path: string, count: number, mockData: MockServerData): Promise<void> {
    const generator = new TsvOfferGenerator(mockData);
    const writer = new TsvFileWriter(path);

    try {
      for (let i = 0; i < count; i++) {
        await writer.write(generator.generate());
      }
    } finally {
      await writer.close();
    }
  }

  public async run(...args: string[]): Promise<void> {
    const [rawCount, path, url] = args;
    const count = Number(rawCount);

    if (!Number.isInteger(count) || count <= 0 || !path || !url) {
      throw new Error('Использование: --generate <n> <path> <url>, где n — целое число больше 0');
    }

    const mockData = await this.load(url);
    await this.write(path, count, mockData);
  }
}
