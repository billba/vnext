import { ConversationState, ConsoleAdapter, MemoryStorage, BotContext, ConversationReference } from 'botbuilder';

import { Botstrap } from './Botstrap';

import { BrandonContext } from './BrandonContext';
export { BrandonContext }

export class BrandonBot <AppState> extends Botstrap<BrandonContext<AppState>> {
    conversationState = new ConversationState<AppState>(new MemoryStorage());

    adapter = new ConsoleAdapter()
        .use(this.conversationState);

    getContext(
        context: BotContext,
    ) {
        return BrandonContext.from(context, this.conversationState)
    }

    onRequest(
        handler: (
            context: BrandonContext<AppState>,
        ) => Promise<void>
    ) {
        this.adapter.listen(this.do(handler));
        return Promise.resolve();
    }
}
