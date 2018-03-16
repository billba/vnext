import { BrandonBot, BrandonContext } from './BrandonBot';

interface MyState {
    count: number;
}

const bot = new BrandonBot<MyState>();

bot.processRequest(async context => {
    if (context.request.type === 'message') {
        context.state.count = context.state.count === undefined ? 0 : context.state.count + 1;
        await context.reply(`${context.state.count}: You said "${context.request.text}"`);
    } else {
        await context.reply(`'[${context.request.type}' activity detected]`);
    }
});

function onSomeEventSomewhere(context: BrandonContext<MyState>) {
    bot.startConversation(context, async context => {
        context.reply(`This is a proactive message`);
    })
}
