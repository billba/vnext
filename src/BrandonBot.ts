import { ConversationState, ConsoleAdapter, MemoryStorage, BotContext } from 'botbuilder';

import { Botstrap } from './Botstrap';

import { BrandonContext } from './BrandonContext';
export { BrandonContext }

export class BrandonBot <AppState> extends Botstrap<BrandonContext<AppState>> {
    conversationState = new ConversationState<AppState>(new MemoryStorage());
    adapter = new ConsoleAdapter();

    getContext(
        context: BotContext,
    ) {
        return BrandonContext.from(context, this.conversationState)
    }

    processRequest(
        handler: (
            context: BrandonContext<AppState>,
        ) => Promise<void>
    ) {
        this.adapter.listen(this.do(handler));
    }

    startConversation(
        appContext: BrandonContext<AppState>,
        handler: (
            context: BrandonContext<AppState>,
        ) => Promise<void>
    ) {
        // this.adapter.startConversation(appContext, this.do(handler));
    }
}
