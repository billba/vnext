import { BotContext } from 'botbuilder';

export abstract class Botstrap <AppContext> {
    protected do (
        handler: (appContext: AppContext,
    ) => Promise<void>) {
        return (context: BotContext) => this
            .getContext(context)
            .then(appContext => handler(appContext));
    }
    
    abstract getContext(
        context: BotContext
    ): Promise<AppContext>;

    abstract processRequest(
        handler: (
            appContext: AppContext,
        ) => Promise<void>
    ): Promise<void>;

    abstract startConversation(
        reference: Partial<ConversationReference>,
        handler: (
            appContext: AppContext,
        ) => Promise<void>
    ): Promise<void>;

    abstract continueConversation(
        reference: Partial<ConversationReference>,
        handler: (
            appContext: AppContext,
        ) => Promise<void>
    ): Promise<void>;
}
