export class Event {
  constructor(args) {
    this.type = args.type;
    this.timestamp = "";
    this.version = "";
    this.data = args.data;
  }
}
