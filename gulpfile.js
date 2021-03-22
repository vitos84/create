/*eslint-disable node/no-unpublished-require*/ 
const {src,dest,series,parallel,watch}=require('gulp');
const scss=require('gulp-sass'); 
//const cssnano=require('gulp-cssnano');
const concat = require('gulp-concat')
const del=require('del');
const conkat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
/*eslint-enable node/no-unpublished-require*/ 



function cleaneCss(){
   return  del(['public/stylescheets/**.css'])
}
function cleaneJs(){
  return  del(['public/javascripts/**.js'])
}

function styles(){
    return src('dev/scss/**/*.scss')
  .pipe(scss())  
  //.pipe(cssnano())
  .pipe(conkat('styles.css'))
  .pipe(dest('public/stylescheets'))
}

function scripts(){
  return src(['dev/js/auth.js',
              'dev/js/post.js',
              'dev/js/coment.js',
              'node_modules/medium-editor/dist/js/medium-editor.min.js'

])
  .pipe(concat('scripts.js')) 
	.pipe(uglify()) 
	.pipe(dest('public/javascripts')) 
}

function serveCss(){
  watch('dev/scss/**/*.scss').on('change',series(cleaneCss,styles));
}

function serveJs(){
  watch('dev/js/**/*.js').on('change',series(cleaneJs,scripts));
}

const serve=parallel(serveCss,serveJs);
module.exports.serve=serve;