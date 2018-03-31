import { expect } from 'chai';
import { OptionTester } from './index';

describe('OptionTester', () => {
    describe('hasOption', () => {
        const validOptions: string[] = ['width', 'height', 'timeout'];
        const invalidOptions: string[] = ['damn', 'widthheight', undefined, null, 77] as string[];

        const options = validOptions
            .map(option => {
                return { option, isValid: true }
            })
            .concat(invalidOptions.map(option => {
                return { option, isValid: false }
            }));

        options.forEach(({ option, isValid }) => {
            it(`should ${isValid ? 'accept' : 'reject'} ${option}`, () => {
                expect(OptionTester.hasOption(option)).to.equal(isValid);
            });
        });
    });

    describe('ensureValidOption', () => {
        const validOptions: { name: string, value: any }[] = [
            { name: 'width', value: '1000' },
            { name: 'width', value: 1000 }
        ];
        const invalidOptions: { name: string, value: any }[] = [
            { name: 'height', value: 'boom' },
            { name: 'width', value: -1 }
        ];

        const options = validOptions
            .map(option => {
                return { option, isValid: true }
            })
            .concat(invalidOptions.map(option => {
                return { option, isValid: false }
            }));

        options.forEach(({ option, isValid }) => {
            it(`should ${isValid ? 'accept' : 'reject'} option ${option.name} with value ${option.value}`, () => {
                if (isValid) {
                    expect(() => OptionTester.ensureValidOption(option.name, option.value)).to.not.throw(Error);
                } else {
                    expect(() => OptionTester.ensureValidOption(option.name, option.value)).to.throw(Error);
                }
            });
        });
    });
});