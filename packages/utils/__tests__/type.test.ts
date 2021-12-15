import { PickMethodsKey } from '../src/type';

describe('@zeronejs/utils => type', () => {
    it('PickMethodsKey', () => {
        const obj = {
            a: (c: number) => c,
            b: (d: string) => d,
        };
        type Keys = PickMethodsKey<typeof obj>;
        const a: Keys = 'a';
        const b: Keys = 'b';
        expect(a).toBeDefined();
        expect(b).toBeDefined();
    });
    // https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md
    it('PickMethodsKey LeetCode demo', () => {
        interface Action<T> {
            payload?: T;
            type: string;
        }

        class EffectModule {
            count = 1;
            message = 'hello!';

            delay(input: Promise<number>) {
                return input.then(i => ({
                    payload: `hello ${i}!`,
                    type: 'delay',
                }));
            }

            setMessage(action: Action<Date>) {
                return {
                    payload: action.payload!.getMilliseconds(),
                    type: 'set-message',
                };
            }
        }

        type ConnectResult = {
            [key in PickMethodsKey<EffectModule>]: EffectModule[key] extends (
                input: Promise<infer I>
            ) => Promise<Action<infer O>>
                ? (input: I) => Action<O>
                : EffectModule[key] extends (action: Action<infer I>) => Action<infer O>
                ? (input: I) => Action<O>
                : never;
        };

        // 修改 Connect 的类型，让 connected 的类型变成预期的类型
        type Connect = (module: EffectModule) => ConnectResult;

        const connect: Connect = m => ({
            delay: (input: number) => ({
                type: 'delay',
                payload: `hello 2`,
            }),
            setMessage: (input: Date) => ({
                type: 'set-message',
                payload: input.getMilliseconds(),
            }),
        });

        type Connected = {
            delay(input: number): Action<string>;
            setMessage(action: Date): Action<number>;
        };

        const connected: Connected = connect(new EffectModule());
        expect(connected).toBeDefined();
    });
});
