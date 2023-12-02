const fs = require('fs');
const {
  MemoryStore,
  FileStore,
} = require('./store.js');

beforeEach(() => {
  try {
    fs.closeSync(fs.openSync('./store.csv', 'w'));
  } catch {
    // pass
  }
});

afterEach(() => {
  try {
    fs.unlinkSync('./store.csv');
  } catch {
    // pass
  }
});

test('Create memory store', () => {
  const store = new MemoryStore();
});

test('Add event to store', async () => {
  const store = new MemoryStore();
  const eventLike = {namespace: 'Some', type: 'Event', entity: '', data: {foo: 'a', bar: 'b'}};
  await store.__dump__(eventLike);
  const events = await store.getAllEvents();
  expect(events.length).toBe(1);
  expect(events[0].data.foo).toBe('a');
});

test('store event subscription', () => {
  const store = new MemoryStore();
  store.add_subscriber((event) => { console.log(`yielded ${event}` )});
});

test('store subscription nodupage if named', () => {
  const store = new MemoryStore();
  const sub = (event) => { out.push(event) };
  store.add_subscriber(sub);
  store.add_subscriber(sub);
  expect([...store.subscribers].length).toBe(1);
});

test('store subscription dupage if anonymous', () => {
  const store = new MemoryStore();
  store.add_subscriber((event) => { out.push(event) });
  store.add_subscriber((event) => { out.push(event) });
  expect([...store.subscribers].length).toBe(2);
});

test('store event notification single', async () => {
  const out = [];
  const store = new MemoryStore();
  const sub = (event) => { out.push(event) };
  store.add_subscriber(sub);
  const eventLike = {namespace: 'Some', type: 'Event', entity: '', data: {foo: 'a', bar: 'b'}};
  await store.__dump__(eventLike);
  expect(out.length).toBe(1);
  expect(out[0].data.foo).toBe('a');
});

