const { Event } = require('./ddd/event.js');
const { AggregateRoot } = require('./ddd/entity.js');
const { Service } = require('./ddd/service.js');


class CowAggregate extends AggregateRoot {
  constructor(kwargs) {
    super(kwargs);
    this.state = {
      name: undefined,
      pen: undefined,
    };
  }

  static __namespace__ =  'Cow';

  __handlers__() {
    return {
      'Created': (event) => this.applyCreated(event),
      'Moved': (event) => this.applyMoved(event),
    }
  }

  // applicators
  //
  applyCreated(event) {
    this.state = event.data;
  }

  applyMoved(event) {
    this.state.pen = event.data.pen;
  }

  // emitters
  //
  static create(kwargs) {
    return [
      new Event({
        namespace: CowAggregate.__namespace__,
        type: 'Created',
        entity: kwargs.key,
        data: {
          name: kwargs.name,
          pen: kwargs.pen,
        }
      })
    ];
  }

  move(kwargs) {
    return [
      new Event({
        namespace: CowAggregate.__namespace__,
        type: 'Moved',
        entity: this.key,
        data: {
          pen: kwargs.pen,
        }
      })
    ];
  }
}


class CowService extends Service {
  async createCow(kwargs) {
    const events = CowAggregate.create(kwargs);
    this.__dump__(events);
  }

  async moveCow(kwargs) {
    const cow = await this.__load__(kwargs.key);
    const events = cow.move(kwargs);
    this.__dump__(events);
  }
}


module.exports = {
  CowAggregate,
  CowService,
}
