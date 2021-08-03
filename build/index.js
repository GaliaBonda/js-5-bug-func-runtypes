"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
//summ :: BigObject → number
function summ(a) {
    const x = Object.keys(a).map((k) => {
        var _a;
        const elem = a[k];
        if (elem === undefined) {
            return 0;
        }
        if (typeof elem.cvalue === 'string') {
            return +elem.cvalue || 2021;
        }
        // if (isBigObject(elem.cvalue)) {
        //   return summ(elem.cvalue);
        // }
        if (typeof elem.cvalue === 'number' || typeof elem.cvalue === 'undefined')
            return (_a = elem.cvalue) !== null && _a !== void 0 ? _a : 2021;
        return summ(elem.cvalue);
    });
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
        sum += x[i];
    }
    return sum;
}
function isBigObject(obj) {
    if (typeof obj !== 'object' || !obj)
        return false;
    let keys = Object.keys(obj);
    const CValueObj = runtypes_1.Record({
        cvalue: runtypes_1.Union(runtypes_1.String, runtypes_1.Number, runtypes_1.Undefined, runtypes_1.Lazy(() => {
            if (hasKey(obj, keys[0])) {
                const newObj = obj[keys[0]];
                const cvalue = 'cvalue';
                if (hasKey(newObj, cvalue) && typeof newObj[cvalue] === 'object') {
                    keys = Object.keys(newObj[cvalue]);
                }
            }
            return runtypes_1.Union(runtypes_1.Undefined, CValueObj);
        })),
    });
    const BigObjValue = runtypes_1.Union(runtypes_1.Undefined, CValueObj);
    const a = {};
    for (let i = 0; i < keys.length; i++) {
        a[keys[i]] = BigObjValue;
    }
    const BigObject = runtypes_1.Record(a);
    try {
        BigObject.check(obj);
        return true;
    }
    catch (e) {
        console.log('Oops...', e);
        return false;
    }
}
function hasKey(obj, key) {
    return key in obj;
}
const example = {
    hello: { cvalue: 1 },
    world: {
        cvalue: { yay: { cvalue: '2' } },
    },
};
const example1 = {
    hello: { cvalue: 1 },
    world: {
        cvalue: { yay: { cvalue: '2' } },
    },
    again: {
        cvalue: {
            yak: {
                cvalue: { yak: { cvalue: 3 } },
            },
        },
    },
};
const example2 = {
    hello: { cvalue: 1 },
    world: {
        cvalue: { yay: { cvalue: 'gg' } },
    },
    again: {
        cvalue: {
            yay: {
                cvalue: { yay: { cvalue: 3 } },
            },
        },
    },
};
const example3 = {
    hello: { cvalue: 1 },
    world: {
        cvalue: { yay: { cvalue: 'gg' } },
    },
    again: {
        cvalue: {
            ha: {
                cvalue: { good: { cvalue: undefined } },
            },
        },
    },
};
const example4 = {
    hello: { cvalue: 1 },
    world: {
        cvalue: undefined,
    },
};
const example5 = {
    mobo: undefined,
    hello: { cvalue: 1 },
    world: {
        cvalue: {
            yay: { cvalue: '2' },
            grgr: { cvalue: undefined },
            grr: { cvalue: '1q' },
            qq: undefined,
        },
    },
    grgr: { cvalue: undefined },
};
console.log(summ(example));
console.log(summ(example1));
console.log(summ(example2));
console.log(summ(example3));
console.log(summ(example4));
console.log(summ(example5));
//# sourceMappingURL=index.js.map