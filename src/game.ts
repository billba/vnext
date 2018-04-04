import { BotContext } from 'botbuilder';
import { TopicWithChild, TopicInstance, Topic } from 'botbuilder-topical';

interface GameInit {
    maxNumber: number;
    maxGuesses: number;
}

interface GameState {
    maxNumber: number;
    maxGuesses: number;
    number: number;
    guess: number;
}

interface GameReturn {
    success: boolean;
}

class Game extends Topic<GameInit, GameState, GameReturn> {
    async init(
        context: BotContext,
        instance: TopicInstance<GameState>,
        args: GameInit,
    ) {
        instance.state = {
            ... args,
            number: Math.floor(Math.random() * args.maxNumber),
            guess: 0,
        }

        await context.sendActivity(`Please guess a number between 0 and ${instance.state.maxNumber}`);
    }

    async onReceive(
        context: BotContext,
        instance: TopicInstance<GameState>,
    ) {
        if (context.request.type !== 'message')
            return;
        
        const text = context.request.text.trim();

        if (text === 'cheat') {
            await context.sendActivity(`The number is ${instance.state.number}`);
            return;
        }

        const num = Number.parseInt(text);

        if (isNaN(num) || num < 0 || num > instance.state.maxNumber) {
            await context.sendActivity(`Please guess a number between 0 and ${instance.state.maxNumber}`);
        } else {
            if (num === instance.state.number) {
                context.sendActivity(`You got it!`);
                return this.returnToParent(instance, {
                    success: true
                });
            }

            await context.sendActivity(`Too ${num < instance.state.number ? "low" : "high"}`);

            instance.state.guess ++;

            if (instance.state.guess >= instance.state.maxGuesses) {
                context.sendActivity(`Sorry, you're out of guesses`);
                return this.returnToParent(instance, {
                    success: false
                });
            }

            await context.sendActivity(`You have ${instance.state.maxGuesses - instance.state.guess} guesses left.`);
        }
    }
}

const game = new Game();

export class Root extends TopicWithChild {
    constructor(name?: string) {
        super(name);

        this
            .onChildReturn(game, async (context, instance, childInstance) => {
                if (childInstance.returnArgs.success)
                    await context.sendActivity(`Congraulations on your victory!`);
                await context.sendActivity(`Welcome back to the root!`);
                this.clearChild(context, instance);
            });
    }

    async init(
        context: BotContext,
        instance: TopicInstance,
    ) {
        await context.sendActivity(`Hello. You can 'start game'`);
    }

    async onReceive(
        context: BotContext,
        instance: TopicInstance,
    ) {
        const text = context.request.type === 'message' && context.request.text.trim();

        if (text === 'cancel') {
            await context.sendActivity(`Okay, cancelled.`);
            this.clearChild(context, instance);
            return;
        }

        if (await this.dispatchToChild(context, instance))
            return;

        if (text === 'start game') {
            this.setChild(context, instance, await game.createInstance(context, instance, {
                maxGuesses: 7,
                maxNumber: 100,
            }))
            return;
        }

        await context.sendActivity(`You can 'start game'.`);
    }
}

export const root = new Root();
