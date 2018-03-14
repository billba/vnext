
import { BotContext, ConversationState } from 'botbuilder';

export class AppContext <State> extends BotContext {

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
