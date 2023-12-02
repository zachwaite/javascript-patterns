const { createHash } = require('crypto');

/* A base class for a value object.
 *
 * Features:
 *
 * - Immutable via Object.freeze
 * - Single level depth (k: v)
 * - Testable for equality
 * - Diff-able
 * - Iterable different ways (keys, values, items)
 *
 */
class AbstractValueObject {
  /*
   * @param vals (Object): a 1-level (k: v) obj of primatives (string, numeric, bool)
   */
  constructor(vals) {
    const _vals = {};
    this._fields().forEach(k => {
      _vals[k] = vals[k];
    });
    this._vals = Object.freeze(_vals);
  }

  /**
   * The fields of the value object.
   *
   * Override or extend this to make things work.
   *
   * @returns Array
   */
  _fields() {
    return [];
  }

  /**
   * Sorted field names
   *
   * @returns Array
   */
  keys() {
    return this._fields();
  }

  /**
   * Field values, in the same order as this.keys()
   *
   * @returns Array
   */
  values() {
    const self = this;
    return this.keys().map(k => self._vals[k]);
  }

  /**
   * Field name: value tuples, in the same order as this.keys()
   * e.g. [[a, 'foo'], [b, 'bar'], ...]
   *
   * @returns Array
   */
  items() {
    const self = this;
    return this.keys().map(k => [k, self._vals[k]]);
  }

  /**
   * Test this against another value object for equality
   *
   * @param other (AbstractValueObject): comparison object
   * @returns bool: true if equal by value, else false
   */
  equals(other) {
    const self = this;
    let rs = true;
    this.keys().forEach(k => {
      if ( self._vals[k] !== other._vals[k] ) {
        rs = false;
        return
      }
    });
    return rs;
  }

  /**
   * Determine which fields have changed between two objects
   * e.g.
   *
   * const foo1 = FooObject({a: 1, b: 2})
   * const foo2 = FooObject({a: 1, b: 3})
   * const changedFields = foo1.diff(foo2)
   * changedFields === ['b']
   *
   * @param other (AbstractValueObject): comparison object
   * @returns Array
   */
  diff(other) {
    const self = this;
    let rs = [];
    this.keys().forEach(k => {
      if ( self._vals[k] !== other._vals[k] ) {
        rs.push(k);
      }
    });
    return rs;
  }

  /**
   * Given a field, get it's value
   *
   * @param field (string): A field name
   * @returns primitive
   */
  get(field){
    return this._vals[field];
  }

  /**
   * Return a copy of _vals
   */
  toObject(){
    return {...this._vals};
  }

  /**
   * Generate sha256 hash of the vals
   */
  hash(){
    const valsBlob = this.values().join("");
    return createHash('sha256').update(valsBlob).digest('hex');
  }
};


module.exports = {AbstractValueObject};

