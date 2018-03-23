import { ConsoleBot, ServiceBot } from 'botbuilder-botbldr';

interface EchoState {
    count: number;
}

const bot = new ConsoleBot<EchoState>();

bot.onRequest(async context => {
    switch (context.request.type) {
        case 'conversationUpdate':
            await context.sendActivity(`'[${context.request.type}' activity detected]`);
            break;

        case 'message':
            context.conversationState.count = context.conversationState.count === undefined ? 0 : context.conversationState.count + 1;
            await context.sendActivity(`${context.conversationState.count}: You said "${context.request.text}"`);
            break;
    }
});
