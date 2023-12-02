const { AbstractValueObject } = require('./valueObject.js');


class ValueObject extends AbstractValueObject {
  _fields() {
    return ['a', 'b'];
  }
}


test('keys() are sorted', ()=>{
  const obj = new ValueObject({b: 'foo', a: 'bar'});
  expect(obj.keys()[0]).toBe('a');
  expect(obj.keys()[1]).toBe('b');
  expect(obj.keys().length).toBe(2);
});

test('values() are sorted', () => {
  const obj = new ValueObject({b: 'foo', a: 'bar'});
  expect(obj.values()[0]).toBe('bar');
  expect(obj.values()[1]).toBe('foo');
  expect(obj.values().length).toBe(2);
});

test('items() are sorted', () => {
  const obj = new ValueObject({b: 'foo', a: 'bar'});
  expect(obj.items()[0][0]).toBe('a');
  expect(obj.items()[0][1]).toBe('bar');
  expect(obj.items()[1][0]).toBe('b');
  expect(obj.items()[1][1]).toBe('foo');
});

test('equals()', () => {
  const obj1 = new ValueObject({b: 'foo', a: 'bar'});
  const obj2 = new ValueObject({b: 'foo', a: 'baz'});
  expect(obj1.equals(obj2)).toBe(false);
  expect(obj2.equals(obj1)).toBe(false);
});

test('diff()', () => {
  const obj1 = new ValueObject({b: 'foo', a: 'bar'});
  const obj2 = new ValueObject({b: 'moo', a: 'baz'});
  expect(obj1.diff(obj2)[0]).toBe('a');
  expect(obj2.diff(obj1)[0]).toBe('a');
  expect(obj1.diff(obj2)[1]).toBe('b');
  expect(obj2.diff(obj1)[1]).toBe('b');
});

test('get()', () => {
  const obj1 = new ValueObject({b: 'foo', a: 'bar'});
  let a = obj1.get('a');
  a = 'test';
  expect(obj1.get('a')).toBe('bar');
});

test('toObject()', () => {
  const vobj = new ValueObject({b: 'foo', a: 'bar'});
  const obj = vobj.toObject();
  expect(obj.a).toBe('bar');
  obj.a = 'test';
  expect(obj.a).toBe('test');
  expect(vobj.get('a')).toBe('bar');
});

test('hash()', () => {
  const vobj1 = new ValueObject({b: 'foo', a: 'bar'});
  const vobj2 = new ValueObject({b: 'foo', a: 'baz'});
  expect(vobj1.hash()).toBe(vobj1.hash());
  expect(vobj1.hash()).not.toBe(vobj2.hash());
});
