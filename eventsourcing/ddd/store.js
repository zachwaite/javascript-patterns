const fs = require('fs');
const { Event } = require('./event.js');

class AbstractEventStore {
  constructor(kwargs) {
    this.subscribers = new Set([]);
  }

  async __dump__(event) {
    throw new Error('Not implemented');
  }

  async getAllEvents() {
    throw new Error('Not implemented');
  }

  async getAllEventsForEntity(key) {
    throw new Error('Not implemented');
  }

  add_subscriber(subscriber) {
    this.subscribers.add(subscriber);
  }

  remove_subscriber(subscriber) {
    this.subscribers.delete(subscriber);
  }

  notify(event) {
    this.subscribers.forEach(callback => {
      callback(event);
    });
  }

};

class FileStore extends AbstractEventStore {
  constructor(kwargs) {
    super(kwargs);
    this.file = kwargs.file;
  }

  async getAllEvents() {
    const raw = await fs.promises.readFile(this.file);
    const lines = raw.toString().split('\n');
    const events = [];
    for ( let i = 0; i < lines.length - 1; i++ ) {
      events.push(Event.fromCsv(lines[i]));
    }
    return events;
  }

  async getAllEventsForEntity(key) {
    const raw = await fs.promises.readFile(this.file);
    const lines = raw.toString().split('\n');
    const events = [];
    for ( let i = 0; i < lines.length - 1; i++ ) {
      const event = Event.fromCsv(lines[i]);
      if ( event.entity === key ) {
        events.push(event);
      }
    }
    return events;
  }

  async __dump__(event) {
    await fs.promises.appendFile(this.file, event.toCsv())
    this.notify(event);
  }
}

class MemoryStore extends AbstractEventStore {
  constructor(kwargs) {
    super(kwargs);
    this.events = [];
  }

  async __dump__(event) {
    this.events.push(event);
    this.notify(event);
  }

  async getAllEvents() {
    return this.events;
  }

  async getAllEventsForEntity(key) {
    return this.events.filter(e => e.entity === key);
  }

}

module.exports = {
  MemoryStore,
  FileStore,
}
