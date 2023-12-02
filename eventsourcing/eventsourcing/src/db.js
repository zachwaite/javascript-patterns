import Dexie from 'dexie';
import 'dexie-observable';


const db = new Dexie('EventStore');
db.version(1).stores({ events: '++id' });


const subscriptions = new Set([]);
// subscriptions.add((event) => { console.log(event.type === 'Todo.Created') });

db.on('changes', (changes) => {
  changes.forEach(change => {
    switch (change.type) {
      case 1:
        console.log(`created ${JSON.stringify(change.obj)}`);
        subscriptions.forEach(f => f(change.obj));
        break;
      default:
        console.log('Should not be here');
    }
  });
});


class AggregateProcess {
  constructor(db, setter, namespace) {
    this.db = db;
    this.setter = setter;
    this.namespace = namespace;
  }

  hydrate(state) {
    const self = this;
    self.db.table('events')
      .toArray()
      .then((events) => {
        self.process(events, state);
      });
  }

  process(events, state) {
    const self = this;
    const newState = {...state};
    events.forEach(event => {
      if ( event.type.startsWith(self.namespace) ) {
        self._process(event, newState);
      }
    });
    this.setter(newState);
  }

  // override
  _process(event, state) {
    event.data.id = event.id;
    switch (event.type) {
      default:
        console.log('Pass');
    };
  }

  promisePushEvent(event) {
    return this.db.table('events').add(event);
  }

  createEvent(type, data) {
    return {
      id: Math.floor(Math.random()*10000),
      type: type,
      data: data
    };
  }

}

class TodoProcess extends AggregateProcess {
  _process(event, state) {
    event.data.id = event.id;
    switch (event.type) {
      case 'Todo.Created':
        state.todos.push(event.data);
        break;
      default:
        console.log('Pass');
    };
  }

  createTodo(state) {
    const self = this;
    const todo = {title: 'todo', done: false};
    const todoEvent = self.createEvent('Todo.Created', todo);
    self.promisePushEvent(todoEvent).then(id => {
      self.process([todoEvent], state);
    });
  }
}

class FooProcess extends AggregateProcess {
  _process(event, state) {
    event.data.id = event.id;
    switch (event.type) {
      case 'Foo.Created':
        state.foos.push(event.data);
        break;
      default:
        console.log('Pass');
    };
  }

  createFoo(state) {
    const self = this;
    const foo = {title: 'foo', done: false};
    const fooEvent = self.createEvent('Foo.Created', foo);
    self.promisePushEvent(fooEvent).then(id => {
      self.process([fooEvent], state);
    });
  }
};

export class Environment {
  constructor(setter) {
    this.todoProcess = new TodoProcess(db, setter, 'Todo');
    this.fooProcess = new FooProcess(db, setter, 'Foo');
    this.processes = [this.fooProcess, this.todoProcess];
    this.commands = {
      createFoo: (state) => this.fooProcess.createFoo(state),
      createTodo: (state) => this.todoProcess.createTodo(state)
    };
  }

  hydrate(state) {
    this.todoProcess.hydrate(state);
    this.fooProcess.hydrate(state);
  }

}

