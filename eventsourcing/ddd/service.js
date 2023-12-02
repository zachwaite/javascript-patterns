class Service {
  constructor(kwargs) {
    this.store = kwargs.store;
    this.Aggregate = kwargs.Aggregate;
    this.__subscriptions__().forEach(subscriber => {
      this.store.add_subscriber(event => subcriber.predicate(event) && subcriber.handle(event));
    });
  }

  /* subscriptions listen to event store
   * 1) predicate: filters which events to listen to
   * 2) handle: dispatch the event to the proper command(s) which will interact with
   * the domain, via the normal pattern of creating events via emitters and
   * saving them with this.__dump__(events)
   *
   *   Example:
   *
   *     __subscriptions__() {
   *       return [
   *         {
   *           predicate: (event) => event.namespace === this.Aggregate.__namespace__,
   *           handle: (event) => this.someCommmand(event.data)
   *         },
   *       ]
   *     }
   *
   *
   */
  __subscriptions__() {
    return [];
  }

  /**
   * Hydrate an aggregate root from the event store by querying the store
   * for relevant events, then applying them sequentially.
   *
   * @returns DomainEntity
   */
  async __load__(key) {
    const events = await this.store.getAllEventsForEntity(key);
    const entity = new this.Aggregate({key: key});
    events.forEach(event => {
      entity.__apply__(event);
    });
    return entity;
  }

  /**
   * Dump a sequence of events to the store.
   *
   */
  async __dump__(events) {
    events.forEach(event => {
      this.store.__dump__(event);
    });
  }

  // commands
  // the main external interface to the service
}

module.exports = { Service };
