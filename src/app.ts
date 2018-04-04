import { ConsoleBot } from 'botbuilder-botbldr';
import { Topic } from 'botbuilder-topical';
import { root } from './game';
import { MemoryStorage } from 'botbuilder';

const storage = new MemoryStorage();

const bot = new ConsoleBot(storage);

Topic.init(storage);

bot.onRequest(async context => {
    await Topic.do(context, () => root.createInstance(context))
})