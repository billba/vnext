import { ConsoleBot, StateContext } from 'botbuilder-botbldr';
import { Topic } from 'botbuilder-topical';
import { Root } from './game';
import { TurnContext, MemoryStorage } from 'botbuilder';

const storage = new MemoryStorage();

Topic.init(storage);

const bot = new ConsoleBot(storage);

bot.onTurn(async context => {
    await Root.do<any, any, any, TurnContext>(context)
});