import arabicToRoman from '../src/number-conversion';

describe("Test Arabic to Roman number converstion", () => {
    it("1 should be I", () => {
        expect(arabicToRoman(1)).toEqual('I');
    });
    it("2 should be II", () => {
        expect(arabicToRoman(2)).toEqual('II');
    });
    it("3 should be III", () => {
        expect(arabicToRoman(3)).toEqual('III');
    });
    it("4 should be IV", () => {
        expect(arabicToRoman(4)).toEqual('IV');
    });
    it("5 should be V", () => {
        expect(arabicToRoman(5)).toEqual('V');
    });
    it("6 should be VI", () => {
        expect(arabicToRoman(6)).toEqual('VI');
    });
    it("7 should be VII", () => {
        expect(arabicToRoman(7)).toEqual('VII');
    });
    it("8 should be VIII", () => {
        expect(arabicToRoman(8)).toEqual('VIII');
    });
    it("9 should be IX", () => {
        expect(arabicToRoman(9)).toEqual('IX');
    });
    it("10 should be X", () => {
        expect(arabicToRoman(10)).toEqual('X');
    });
    it("49 should be XLIX", () => {
        expect(arabicToRoman(49)).toEqual('XLIX');
    });
    it("354 should be CCCLIV", () => {
        expect(arabicToRoman(354)).toEqual('CCCLIV');
    });
    it("3999 should be MMMCMXCIX", () => {
        expect(arabicToRoman(3999)).toEqual('MMMCMXCIX');
    });
});