const { DomainEntity } = require('./entity.js');

class FooEntity extends DomainEntity {
  constructor(kwargs) {
    super(kwargs);
    this.state = {foo: null};
  }

  __handlers__() {
    return {
      'Created': (event) => this.applyCreate(event),
      'Refoo': (event) => this.applyRefoo(event),
    }
  }

  applyRefoo(event) {
    this.state = event.data;
  }

  applyCreated(event) {
    this.state = event.data;
  }

  static create(kwargs) {
    const events = new Event(kwargs);
    return events;
  }
}

test('entity static create', () => {
  const events = FooEntity.create({key: 1});
});

test('entity applyCreated', () => {
  const entity = new FooEntity({key: 1});
  entity.applyCreated({data: {foo: 'bar'}});
  expect(entity.state.foo).toBe('bar');
});

test('entity applyCreate then applyRefoo', () => {

  const entity = new FooEntity({key: 1});
  entity.applyCreated({data: {foo: 'bar'}});
  entity.applyRefoo({data: {foo: 'baz'}});
  expect(entity.state.foo).toBe('baz');
});

test('entity extend handlers', () => {
  class FooEntity extends DomainEntity {
    constructor(kwargs) {
      super(kwargs);
      this.state = {foo: null};
    }

    __handlers__() {
      const out = super.__handlers__();
      out['Foo2'] = applyRefoo;
      return out;
    }

    applyRefoo(event) {
      this.state = event.data;
    }
  }

});

