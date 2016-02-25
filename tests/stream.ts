import xs from '../src/index';
import * as assert from 'assert';

describe('Stream', () => {
  it('can be subscribed and unsubscribed with one observer', (done) => {
    const stream = xs.interval(100);
    const expected = [0, 1, 2];
    let observer = {
      next: (x: number) => {
        assert.equal(x, expected.shift());
        if (expected.length === 0) {
          stream.unsubscribe(observer);
          done();
        }
      },
      error: done.fail,
      complete: done.fail,
    };
    stream.subscribe(observer);
  });
});

describe('Stream.prototype.from', () => {
  it('should convert an array to a stream', (done) => {
    const stream = xs.from([10, 20, 30, 40, 50])
      .map(i => String(i));
    let expected = ['10', '20', '30', '40', '50'];
    let observer = {
      next: (x: string) => {
        assert.equal(x, expected.shift());
      },
      error: done.fail,
      complete: () => {
        assert.equal(expected.length, 0);
        done();
      },
    };
    stream.subscribe(observer);
  });
});

describe('Stream.prototype.map', () => {
  it('should transform values from input stream to output stream', (done) => {
    const stream = xs.interval(100).map(i => 10 * i);
    const expected = [0, 10, 20];
    let observer = {
      next: (x: number) => {
        assert.equal(x, expected.shift());
        if (expected.length === 0) {
          stream.unsubscribe(observer);
          done();
        }
      },
      error: done.fail,
      complete: done.fail,
    };
    stream.subscribe(observer);
  });
});

describe('Stream.prototype.filter', () => {
  it('should filter in only even numbers from an input stream', (done) => {
    const stream = xs.interval(50).filter(i => i % 2 === 0);
    const expected = [0, 2, 4, 6];
    let observer = {
      next: (x: number) => {
        assert.equal(x, expected.shift());
        if (expected.length === 0) {
          stream.unsubscribe(observer);
          done();
        }
      },
      error: done.fail,
      complete: done.fail,
    };
    stream.subscribe(observer);
  });
});

describe('Stream.prototype.take', () => {
  it('should allow specifying max amount to take from input stream', (done) => {
    const stream = xs.interval(50).take(4)
    const expected = [0, 1, 2, 3];
    let observer = {
      next: (x: number) => {
        assert.equal(x, expected.shift());
      },
      error: done.fail,
      complete: () => {
        assert.equal(expected.length, 0);
        stream.unsubscribe(observer);
        done();
      },
    };
    stream.subscribe(observer);
  });
});

describe('Stream.prototype.skip', () => {
  it('should allow specifying max amount to skip from input stream', (done) => {
    const stream = xs.interval(50).skip(4)
    const expected = [4, 5, 6];
    let observer = {
      next: (x: number) => {
        assert.equal(x, expected.shift());
        if (expected.length === 0) {
          stream.unsubscribe(observer);
          done();
        }
      },
      error: done.fail,
      complete: done.fail,
    };
    stream.subscribe(observer);
  });
});

describe('Stream.prototype.debug', () => {
  it('should allow inspecting the operator chain', (done) => {
    const expected = [0, 1, 2];
    const stream = xs.interval(50).debug(x => {
      assert.equal(x, expected.shift());
    });
    let observer = {
      next: (x: number) => {
        if (x === 2) {
          assert.equal(expected.length, 0);
          stream.unsubscribe(observer);
          done();
        }
      },
      error: done.fail,
      complete: done.fail,
    };
    stream.subscribe(observer);
  });
});