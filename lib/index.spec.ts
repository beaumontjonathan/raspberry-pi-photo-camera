import {expect} from 'chai';
import hello from "./index";

describe('hello', () => {
    it('should return world', () => {
        expect(hello()).to.equal('world');
    });
});