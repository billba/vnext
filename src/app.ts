import { ConsoleAdapter, MemoryStorage, ConversationState, BotContext } from 'botbuilder';
import { contextHelpers } from './contextHelpers';
import { AppContext } from './AppContext';

interface MyState {
    count: number;
}

// Add conversation state middleware
const conversationState = new ConversationState<MyState>(new MemoryStorage());

const { withContext } = contextHelpers(async context => await AppContext.from(context, conversationState));

const bot = new ConsoleAdapter()

bot
    .use(conversationState);

bot.listen(withContext(async context => {
    if (context.request.type === 'message') {
        context.state.count = context.state.count === undefined ? 0 : context.state.count + 1;
        await context.reply(`${context.state.count}: You said "${context.request.text}"`);
    } else {
        await context.reply(`[${context.request.type} event detected]`);
    }
}));
