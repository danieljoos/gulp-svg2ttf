'use strict';

var gulp = require('gulp')
  , assert = require('assert')
  , es = require('event-stream')
  , fs = require('fs')
  , svg2ttf = require(__dirname + '/../src/index.js')
;

// Erasing date to get an invariant created and modified font date
// See: https://github.com/fontello/svg2ttf/blob/c6de4bd45d50afc6217e150dbc69f1cd3280f8fe/lib/sfnt.js#L19
Date = (function(d) {
  function Date() {
    d.call(this, 3600);
  }
  Date.now = d.now;
  return Date;
})(Date);

describe('gulp-svg2ttf conversion', function() {
  var filename = __dirname + '/fixtures/iconsfont';
  var ttf = fs.readFileSync(filename + '.ttf');

  it('should work in buffer mode', function(done) {

      gulp.src(filename + '.svg')
        .pipe(svg2ttf())
        // Uncomment to regenerate the test files if changes in the svg2ttf lib
        // .pipe(gulp.dest(__dirname + '/fixtures/'))
        .pipe(es.map(function(file) {
          assert.equal(file.contents.length, ttf.length);
          assert.equal(file.contents.toString('utf-8'), ttf.toString('utf-8'));
          done();
        }));

  });

  it('should work in stream mode', function(done) {

      gulp.src(filename + '.svg', {buffer: false})
        .pipe(svg2ttf())
        .pipe(es.map(function(file) {
          // Get the buffer to compare results
          file.contents.pipe(es.wait(function(err, data) {
            assert.equal(data.length, ttf.toString('utf-8').length);
            assert.equal(data, ttf.toString('utf-8'));
            done();
          }));
        }));

  });

});