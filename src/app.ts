import { ConsoleBot, AppContext } from './botstrap';

interface MyState {
    count: number;
}

new ConsoleBot<MyState>().listen(async context => {
    if (context.request.type === 'message') {
        context.state.count = context.state.count === undefined ? 0 : context.state.count + 1;
        await context.reply(`${context.state.count}: You said "${context.request.text}"`);
    } else {
        await context.reply(`'[${context.request.type}' activity detected]`);
    }
});
