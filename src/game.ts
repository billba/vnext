import { TopicWithChild, Topic, Culture, hasNumber, Validator } from 'botbuilder-topical';

interface GameInit {
    maxNumber: number;
    maxGuesses: number;
}

interface GameState {
    maxNumber: number;
    maxGuesses: number;
    number: number;
    guess: number;

    child?: string;
}

class Game extends Topic<GameInit, GameState, boolean, string> {

    hasNumber: Validator<number>;

    constructor(culture: string) {
        super(culture);

        this.hasNumber = hasNumber(culture)
            .and<number>((activity, num) =>
                num > 0 && num < this.state.maxNumber
                    ? num
                    : { reason: 'out_of_range' }
            )
    }

    async onBegin(
        args: GameInit,
    ) {
        this.state = {
            ... args,
            number: Math.floor(Math.random() * args.maxNumber),
            guess: 0,
        }

        await this.context.sendActivity(`Please guess a number between 0 and ${this.state.maxNumber}`);
    }

    async onTurn() {

        if (!this.text)
            return;
        
        if (this.text === 'cheat') {
            await this.context.sendActivity(`The number is ${this.state.number}`);
            return;
        }

        const result = await this.hasNumber.validate(this.context.activity);

        if (result.reason) {

            await this.context.sendActivity(`Please guess a number between 0 and ${this.state.maxNumber}`);
            return;
        }

        const num = result.value!;

        if (num === this.state.number) {

            await this.context.sendActivity(`You got it!`);
            return this.returnToParent(true);
        }

        await this.context.sendActivity(`Too ${num < this.state.number ? "low" : "high"}`);

        this.state.guess ++;

        if (this.state.guess >= this.state.maxGuesses) {

            await this.context.sendActivity(`Sorry, you're out of guesses`);
            return this.returnToParent(false);
        }

        await this.context.sendActivity(`You have ${this.state.maxGuesses - this.state.guess} guesses left.`);
    }
}

const help = `You can 'start game' or ask the time.`;

export class Root extends TopicWithChild {

    static subtopics = [Game];

    async onBegin() {

        await this.context.sendActivity(`Hello. ${help}`);
    }

    async onTurn() {

        if (!this.text)
            return;

        if (this.text === 'cancel') {

            await this.context.sendActivity(`Okay, cancelled.`);
            this.clearChild();
            return;
        }

        if (this.text.includes('time')) {

            await this.context.sendActivity(`It's ${new Date().toLocaleTimeString()}.`);
            return;
        }

        if (await this.dispatchToChild())
            return;

        if (this.text === 'start game') {

            await this.beginChild(Game, {
                maxGuesses: 7,
                maxNumber: 100,
            }, Culture.English);
            return;
        }

        await this.context.sendActivity(help);
    }

    async onChildReturn(child: Game) {

        if (child.return!)
            await this.context.sendActivity(`Congragulations on your victory!`);

        await this.context.sendActivity(`Welcome back to the root!`);
        this.clearChild();
    }
}
