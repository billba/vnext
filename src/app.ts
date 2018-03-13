import { ConsoleAdapter, MemoryStorage, ConversationState, BotContext } from 'botbuilder';

interface MyState {
    count: number;
}

// Add conversation state middleware
const conversationState = new ConversationState<MyState>(new MemoryStorage());

const bot = new ConsoleAdapter()

class AppContext <State> extends BotContext {

    // define the properties and methods to add to BotContext
    state!: State;
    reply(text: string) {
        return this.sendActivity(text);
    }

    // this is a nasty piece of work that will go away
    private constructor(
        context: BotContext,
    ) {
        super(context.adapter, context.request);
        Object.assign(this, context);
    }

    // "from" adds any properties or methods that depend on arguments or async calls or both
    static async from <State = any> (
        context: BotContext,
        conversationState: ConversationState<State>,
    ): Promise<AppContext<State>> {
        const appContext = new AppContext<State>(context);
        appContext.state = await conversationState.read(context);
        return appContext;
    }
}

bot
    .use(conversationState)
    .use(async (context, next) => {
        const state = await conversationState.read(context);
        // use state
        await next();
        // do stuff after child
    })

bot.listen(async (context) => {
    const app = await AppContext.from(context, conversationState);
    if (app.request.type === 'message') {
        const count = app.state.count === undefined ? 0 : app.state.count + 1;
        await app.reply(`${count}: You said "${app.request.text}"`);
    } else {
        await app.reply(`[${app.request.type} event detected]`);
    }
});

