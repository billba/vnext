import { ConsoleAdapter, MemoryStorage, ConversationState } from 'botbuilder';

interface MyState {
    count: number;
}

// Add conversation state middleware
const conversationState = new ConversationState<MyState>(new MemoryStorage());

const adapter = new ConsoleAdapter()
    .use(conversationState);

adapter.listen(async (context) => {
    if (context.request.type === 'message') {
        const state = conversationState.get(context)!;
        const count = state.count === undefined ? 0 : state.count + 1;
        await context.sendActivity(`${count}: You said "${context.request.text}"`);
    } else {
        await context.sendActivity(`[${context.request.type} event detected]`);
    }
});
