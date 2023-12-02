class Event {
  constructor(kwargs) {
    this.version = kwargs.version || 0;
    this.timestamp = kwargs.timestamp || new Date();
    this.namespace = kwargs.namespace;
    this.type = kwargs.type;
    this.entity = kwargs.entity;
    this.data = kwargs.data;
  }

  toCsv() {
    const csv = [];
    csv.push(this.version);
    csv.push(this.timestamp.toISOString());
    csv.push(this.namespace);
    csv.push(this.type);
    csv.push(this.entity);
    csv.push(JSON.stringify(this.data));
    return csv.join('|') + '\n';
  }

  static fromCsv(row) {
    const args = row.split('|');
    const version =  args[0];
    const timestamp =  new Date(args[1]);
    const namespace = args[2];
    const type =  args[3];
    const entity =  args[4];
    const data =  JSON.parse(args[5]);
    const kwargs = {
      version: version,
      timestamp: timestamp,
      namespace: namespace,
      type: type,
      entity: entity,
      data: data,
    };
    const evt = new Event(kwargs);
    return evt;
  }
}

module.exports = { Event };
