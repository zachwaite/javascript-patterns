const { Event } = require('./event.js');

test('Create event', () => {
  const event = new Event({namespace: 'Some', type: 'Event', entity: '', data: {foo: 'a', bar: 'b'}});
  expect(event.data.foo).toBe('a');
});

