
import { BotContext, ConversationState } from 'botbuilder';

export class AppContext <State> extends BotContext {
    // instead of adding things here, add them in `from()`
    private constructor(context: BotContext) {
        super(context);
    }

    // define the properties and methods to add to BotContext
    state!: State;
    reply(text: string) {
        return this.sendActivity(text);
    }

    // "from" adds any properties or methods that depend on arguments or async calls or both
    // think of it as an async constructor

    static async from <State = any> (
        context: BotContext,
        conversationState: ConversationState<State>,
    ): Promise<AppContext<State>> {
        const appContext = new AppContext<State>(context);
        appContext.state = await conversationState.read(context);
        return appContext;
    }
}
