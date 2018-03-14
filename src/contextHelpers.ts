
import { BotContext, Promiseable } from 'botbuilder';

export const toPromise = <T> (t: Promiseable<T>) => t instanceof Promise ? t : Promise.resolve(t);

export const contextHelpers = <Context> (
    getContext: (
        context: BotContext
    ) => Promiseable<Context>
) => ({
    getContext: (context: BotContext) => toPromise(getContext(context)),
    withContext: (handler: (context: Context) => Promiseable<any>) => async (context: BotContext) => toPromise(handler(await toPromise(getContext(context))))
});
