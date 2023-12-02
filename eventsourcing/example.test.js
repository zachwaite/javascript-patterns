const { MemoryStore } = require('./ddd/store.js');
const { CowService, CowAggregate } = require('./example.js');


test('create', async () => {
  const store = new MemoryStore({});
  const service = new CowService({
    store: store,
    Aggregate: CowAggregate,
  });
  service.createCow({key: 'besse', name: 'besse', pen: 'pen1'});
  const cow = await service.__load__('besse');
  expect(cow.state.name).toBe('besse');
});

test('move', async () => {
  const store = new MemoryStore({});
  const service = new CowService({
    store: store,
    Aggregate: CowAggregate,
  });
  await service.createCow({key: 'besse', name: 'besse', pen: 'pen1'});
  await service.moveCow({key: 'besse', pen: 'pen2'});

  const cow = await service.__load__('besse');
  expect(cow.state.pen).toBe('pen2');
});
