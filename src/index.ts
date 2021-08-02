import { Number, String, Record, Union, Undefined, Lazy } from 'runtypes';
import { RuntypeBase } from 'runtypes/lib/runtype';

interface BigObject {
  [a: string]:
    | {
        cvalue: number | string | undefined | BigObject;
      }
    | undefined;
}

//summ :: BigObject → number

function summ(a: BigObject): number {
  const x = Object.keys(a).map((k) => {
    const elem = a[k];
    if (elem === undefined) {
      return 0;
    }
    if (typeof elem.cvalue === 'string') {
      return +elem.cvalue || 2021;
    }
    if (isBigObject(elem.cvalue)) {
      return summ(elem.cvalue as BigObject);
    }
    return elem.cvalue ?? 2021;
  });
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += x[i] as number;
  }
  return sum;
}

function isBigObject(obj: unknown): boolean {
  if (typeof obj !== 'object' || !obj) return false;
  let keys: string[] = Object.keys(obj);
  // const CValueObj: RuntypeBase<unknown> = Lazy(() =>
  //   Record({
  //     cvalue: Union(String, Number, Undefined, BigObject),
  //   }),
  // );

  const CValueObj: RuntypeBase<unknown> = Record({
    cvalue: Union(
      String,
      Number,
      Undefined,
      Lazy(() => {
        if (hasKey(obj, keys[0])) {
          const newObj = obj[keys[0]];
          const cvalue = 'cvalue';
          if (hasKey(newObj, cvalue) && typeof newObj[cvalue] === 'object') {
            keys = Object.keys(newObj[cvalue]);
            console.log('we are here');
          }
        }

        return Union(Undefined, CValueObj);
      }),
    ),
  });

  const BigObjValue = Union(Undefined, CValueObj);
  const a: { [l: string]: typeof BigObjValue } = {};
  //const keys: string[] = Object.keys(obj);
  // if (!hasKey(obj, keys[0])) return false;
  // let newObj = obj[keys[0]];
  // const cvalue = 'cvalue';
  // if (hasKey(newObj, cvalue) && typeof newObj[cvalue] === 'object') {
  //   keys = Object.keys(newObj[cvalue]);
  //   console.log('we are here');
  // }
  // newObj = newObj[keys[0]];
  // if (hasKey(newObj, cvalue) && typeof newObj[cvalue] === 'object') {
  //   keys = Object.keys(newObj[cvalue]);
  //   console.log('we are here now');
  // }
  console.log('keys ', keys);
  for (let i = 0; i < keys.length; i++) {
    a[keys[i]] = BigObjValue;
  }
  const BigObject = Record(a);
  try {
    BigObject.check(obj);
    return true;
  } catch (e) {
    console.log('Oops...', e);
    return false;
  }
}

function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj;
}

const example: BigObject = {
  hello: { cvalue: 1 },
  world: {
    cvalue: { yay: { cvalue: '2' } },
  },
};

const example1: BigObject = {
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

const example2: BigObject = {
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

const example3: BigObject = {
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

const example4: BigObject = {
  hello: { cvalue: 1 },
  world: {
    cvalue: undefined,
  },
};

const example5: BigObject = {
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
