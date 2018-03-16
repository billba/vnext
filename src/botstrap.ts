import { ConsoleAdapter, MemoryStorage, ConversationState, BotContext, Middleware, Storage, StoreItems } from 'botbuilder';
import { contextHelpers } from './contextHelpers';
import { AppContext } from './AppContext';
export { AppContext }

export class ConsoleBot <AppState> {
    private conversationState: ConversationState<AppState>;
    withContext:  (handler: (context: AppContext<AppState>) => any) => (context: BotContext) => Promise<any>;
    adapter: ConsoleAdapter;

    constructor() {
        this.conversationState = new ConversationState(new MemoryStorage());
        this.withContext = contextHelpers(async context => await AppContext.from(context, this.conversationState)).withContext;
        this.adapter = new ConsoleAdapter().use(this.conversationState);
    }
    
    listen(handler: (context: AppContext<AppState>) => Promise<void>) {
        this.adapter.listen(this.withContext(handler));
    }
}
