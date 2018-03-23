"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const chai_1 = require("chai");
describe('hello', () => {
    it('should return world', () => {
        chai_1.expect(index_1.default()).to.equal('world');
    });
});
//# sourceMappingURL=index.spec.js.map