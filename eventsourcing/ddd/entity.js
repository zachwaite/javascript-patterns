const { Event } = require('./event.js');

class DomainEntity {
  constructor(kwargs) {
    this.key = kwargs.key;
    this.state = {};
  }

  /**
   * The individial event handlers. Called by __apply__() to dispatch
   * the right behavior for the event type.
   *
   * @returns A dict of { <Event Type>: <Event Handler> }
   *
   * Example: 
   *
   *  __handlers__() {
   *    return {
   *      'Created': (event) => this.applyCreated(event),
   *    }
   *  }
   *
   */
  __handlers__() {
    return {};
  }

  /**
   * Dispatch the appropriate event handler.
   *
   */
  __apply__(event) {
    try {
      this.__handlers__()[event.type](event);
    } catch {
      // pass
    }
  }

  /**
   *  Domain logic
   *
   *  Domain logic is synchronous, but is often called from asynchronous methods
   *  in the service layer.
   *
   *  The domain logic consists of two types of methods: applicators and emitters.
   *  Applicators are the event handlers that mutate the state of the entity and
   *  are used when hydrating the state from the store.
   *
   *  Example: 
   *
   *    applyCreated(event) {
   *      this.state = event.data;
   *    }
   *  
   *  Emitters perform validations and return an array of events to be sent to
   *  the store. If invalid, the emitter method should raise an error, breaking
   *  execution.
   *
   *  Example:
   *
   *    static create(kwargs) {
   *      const events = new Event(kwargs);
   *      return events;
   *    }
   *
   */
}

/**
 * An Aggregate Root is a Domain Entity that serves as the main object of
 * reasoning in the bounded context.
 *
 * Currently no extra logic exists, but this class should be used in Service
 * definitions rather than DomainEntity directly to respect the DDD conventions
 * and also to allow future functional separation if needed.
 */
class AggregateRoot extends DomainEntity {};

module.exports = { DomainEntity, AggregateRoot };
