// utility base
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const prettyError = require('gulp-prettyerror');
const plumber = require('gulp-plumber');
// var gutil = require('gulp-util');
const notify = require('gulp-notify');
const size = require('gulp-size');
const del = require('del');
const shell = require('gulp-shell');
const rename = require('gulp-rename');
const flog = require('fancy-log');
const c = require('ansi-colors');
// sass
const sass = require('gulp-sass');
// sass mixins
const bourbon = require('bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;
// css sourcemaps
const sourcemaps = require('gulp-sourcemaps');
const purgeSourcemaps = require('gulp-purge-sourcemaps');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const sorting = require('postcss-sorting');
const postcssMergeRules = require('postcss-merge-rules');
const flexbugsFixes = require('postcss-flexbugs-fixes');
// js
const jshint = require('gulp-jshint');
const stripDebug = require('gulp-strip-debug');
// js css utility min
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rjs = require('requirejs');
// image utility
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const JpegRecompress = require('imagemin-jpeg-recompress');
const gifsicle = require('imagemin-gifsicle');
const svgo = require('imagemin-svgo');
const tinypng = require('gulp-tinypng-nokey');
// html utility
const htmlReaplce = require('gulp-html-replace');
const htmlMin = require('gulp-htmlmin');
const htmlhint = require('gulp-htmlhint');
// json
const jsonlint = require('gulp-jsonlint');
// revision utility
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const insertLines = require('gulp-insert-lines');
// const moment = require('moment');
// const header = require('gulp-header');
// php Beautify
const phpcs = require('gulp-phpcs');
// react babel
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
// const newer = require('gulp-newer');
const webpack = require('webpack');
const webpackstream = require('webpack-stream');
const named = require('vinyl-named');
const through = require('through2');
// twig
// const twig = require('gulp-twig');

const webpackconfig = require('./webpack.config.js');
// configs
const pkg = require('./package.json');
const zensorting = require('./zen.json');

// =====================================================================//

// const banner = [
// 	'/**',
// 	' * @project        <%= pkg.name %>',
// 	' * @author         <%= pkg.author %>',
// 	` * @build          ${moment().format('llll')} ET`,
// 	` * @copyright      Copyright (c) ${moment().format('YYYY')}, <%= pkg.copyright %>`,
// 	' *',
// 	' */',
// 	''
// ].join('\n');

// dirs
const dist = './dist/';
const src = './src/';
const mapout = '/';
const distphpdir = `${dist}inc/`;
const localurl = 'sample_todo';

// src dist config
const config = {
	scssin: `${src}public/scss/**/*.scss`,
	cleanscssdist: `${dist}public/scss/`,
	cleanscssdistBS: `${dist}public/css/bootstrap/`,
	cssin: `${src}public/css/**/*.css`,
	cssout: `${src}public/css/`,
	distcss: `${dist}public/css/`,
	diststylefile: `${dist}public/**/style.css`,
	jsin: [`${src}public/js/**/*.js`, `!${src}public/js/vendor/**/*`, `!${src}public/js/todo.js`],
	jsxin: `${src}public/jsx/**/*.jsx`,
	jsxout: `${src}public/js/`,
	jsout: `${dist}public/js/`,
	htmlin: `${src}**/*.html`,
	twig: `${src}templates/**/*.twig`,
	phpin: [`${src}src/**/*.php`, `!${src}vendor/**`],
	jsonin: `${src}public/**/*.json`,
	fontin: `${src}public/fonts/**/*`,
	fontout: `${dist}public/fonts/`,
	imgin: `${src}public/img/**/*.{jpg,jpeg,png,gif}`,
	imgin2: `${src}public/img/**/*.{jpg,jpeg,png}`,
	imgout: `${dist}public/img/`,
	cssnamemin: 'style.min.css',
	jsnamemin: 'script.min.js',
	cssreplaceout: 'public/css/style.min.css',
	jsreplaceout: 'public/js/script.min.js',
	revmanifestfile: `${dist}rev-manifest.json`,
	revhead: `${distphpdir}head.php`,
	distindexphp: `${dist}index.php`,
	environment: 'development',
	vendorBin: 'vendor/bin/',
	phpDir: 'src/inc/',
	phpexclude: `${src}vendor/`
};

// =========================r.js============================================//
const rjsconfig = {
	appDir: 'src/public/',
	baseUrl: 'js/', // relative to appDir
	dir: 'dist/public/',
	mainconfigfile: 'src/public/js/main.js',
	modules: [
		{
			name: 'main',
			include: ['jquery', 'popper', 'bootstrap', 'sample_todo']
		}
	],
	paths: {
		jquery: 'empty:',
		popper: 'jsvendor/popper',
		bootstrap: 'jsvendor/bootstrap',
		sample_todo: 'empty:'
	},
	shim: {
		popper: {
			deps: ['jquery'],
			exports: ['Popper']
		},
		bootstrap: {
			deps: ['jquery', 'popper'],
			exports: ['bootstrap']
		}
	},
	optimize: 'uglify2',
	uglify2: {
		output: {
			beautify: false
		},
		mangle: true
	},
	optimizeCss: 'standard',
	removeCombined: true,
	preserveLicenseComments: false
};

// =========================funckcje============================================//

// =========================func jsonlint============================================//
const jsonlintreporter = file => {
	flog(`File ${file.path} is not valid JSON.`);
};

// =========================func error============================================//
const reportError = error => {
	const lineNumber = error.lineNumber ? `LINE ${error.lineNumber} -- ` : '';
	notify({
		title: `Task Failed [${error.plugin}]`,
		message: `${lineNumber}See console.`,
		sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).write(error);
	let report = '';
	const chalk = c.white.bgRed;
	report += `${chalk('TASK:')} [${error.plugin}]\n`;
	report += `${chalk('PROB:')} ${error.message}\n`;
	if (error.lineNumber) {
		report += `${chalk('LINE:')} ${error.lineNumber}\n`;
	}
	if (error.fileName) {
		report += `${chalk('FILE:')} ${error.fileName}\n`;
	}
	flog.error(report);
	this.emit('end');
};

// ==========================func plumber error conf==============================//
const onError = error => {
	flog(c.red(error));
	this.emit('end');
};

// ==============================konfigi============================================//
// =========================Sass options============================================//
const sassOptions = {
	includePaths: [bourbon, neat],
	imagePath: '../img',
	errLogToConsole: true,
	outputStyle: 'expanded'
};

// ==========================config css autoprefix sort==============================//
const sortOptions = [
	flexbugsFixes,
	postcssMergeRules,
	autoprefixer({
		overrideBrowserslist: [
			'> 1%',
			'last 1 major version',
			'not dead',
			'Chrome >= 45',
			'Firefox >= 38',
			'Edge >= 12',
			'Explorer >= 10',
			'iOS >= 9',
			'Safari >= 9',
			'Android >= 4',
			'Opera >= 30'
		],
		cascade: true
	}),
	sorting(zensorting)
];

// ==========================htmlhint options==============================//
const htmlhintOpt = {
	'attr-lowercase': true,
	'attr-no-duplication': true,
	'attr-unsafe-chars': true,
	'attr-value-double-quotes': true,
	'attr-value-not-empty': true,
	'doctype-first': true,
	'doctype-html5': true,
	'href-abs-or-rel': true,
	'head-script-disabled': true,
	'alt-require': true,
	'id-class-value': true,
	'id-class-ad-disabled': false,
	'id-unique': true,
	'space-tab-mixed-disabled': true,
	'spec-char-escape': true,
	'src-not-empty': true,
	'style-disabled': false,
	'tagname-lowercase': true,
	'tag-pair': true,
	'tag-self-close': false,
	'title-require': true
};

// ===========================taski produkcja================================//

// ===============================reload=====================================//
const reload = cb => {
	browserSync.reload();
	cb();
};
exports.reload = reload;
// ===============================serve=====================================//
const serve = cb => {
	browserSync.init({
		// server: src,
		notify: false,
		browser: 'Chrome',
		proxy: `localhost/${localurl}/src/public`
	});
	cb();
};
exports.serve = serve;
// ================================SASS=========================================//
// function sassCompile(cb) {
// 	let s = size();
// 	flog('-> Compile SASS Styles');
// 	return gulp
// 		.src(config.scssin)
// 		.pipe(
// 			plumber({
// 				errorHandler: onError
// 			})
// 		)
// 		.pipe(prettyError())
// 		.pipe(sourcemaps.init())
// 		.pipe(sass(sassOptions).on('error', reportError))
// 		.pipe(postcss(sortOptions))
// 		.pipe(s)
// 		.pipe(
// 			header(banner, {
// 				pkg: pkg
// 			})
// 		)
// 		.pipe(sourcemaps.write(mapout))
// 		.pipe(gulp.dest(config.cssout))
// 		.pipe(browserSync.stream())
// 		.pipe(
// 			notify({
// 				onLast: true,
// 				sound: 'Sosumi',
// 				message: function() {
// 					return 'CSS opty: <%= file.relative %> ' + s.prettySize;
// 				}
// 			})
// 		);
// 	cb();
// }

const sassCompile = cb => {
	const s = size();
	flog('-> Compile SASS Styles');
	return (
		gulp
			.src(config.scssin)
			.pipe(
				plumber({
					errorHandler: onError
				})
			)
			.pipe(prettyError())
			// .pipe(sourcemaps.init())
			.pipe(sass(sassOptions).on('error', reportError))
			.pipe(postcss(sortOptions))
			.pipe(concat(config.cssnamemin))
			.pipe(
				cleanCSS(
					{
						aggressiveMerging: false,
						debug: true,
						compatibility: 'ie9',
						level: {
							1: {
								specialComments: 0
							}
						}
					},
					details => {
						flog(`${details.name}: ${details.stats.originalSize}`);
						flog(`${details.name}: ${details.stats.minifiedSize}`);
					}
				)
			)
			.pipe(s)
			// .pipe(sourcemaps.write(mapout))
			.pipe(gulp.dest(config.cssout))
			.pipe(browserSync.stream())
			.pipe(
				notify({
					onLast: true,
					message() {
						return `CSS opty: <%= file.relative %> ${s.prettySize}`;
					}
				})
			)
			.on('end', cb)
	);
};
exports.sassCompile = sassCompile;

// =========================Dist min.css===============================//
const css = cb => {
	const s = size();
	flog('-> css minify');
	return gulp
		.src(config.cssin)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(prettyError())
		.pipe(concat(config.cssnamemin))
		.pipe(
			cleanCSS(
				{
					aggressiveMerging: false,
					debug: true,
					compatibility: 'ie9',
					keepSpecialComments: 0
				},
				details => {
					flog(`${details.name}: ${details.stats.originalSize}`);
					flog(`${details.name}: ${details.stats.minifiedSize}`);
				}
			)
		)
		.pipe(s)
		.pipe(purgeSourcemaps())
		.pipe(gulp.dest(config.distcss))
		.pipe(
			notify({
				onLast: true,
				message() {
					return `CSS min: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.css = css;

// ================================jshint=========================================//
const jslint = cb => {
	const s = size();
	flog('-> sprawdzanie js');
	return gulp
		.src(config.jsin)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(stripDebug())
		.pipe(jshint('.jshintrc'))
		.pipe(
			jshint.reporter('jshint-stylish', {
				beep: true
			})
		)
		.pipe(s)
		.pipe(
			notify({
				onLast: true,
				message() {
					return `JS check: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.jslint = jslint;

const jsx = cb => {
	const s = size();
	flog('-> sprawdzanie jsx');
	return gulp
		.src(config.jsxin)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(s)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write(mapout))
		.pipe(gulp.dest(config.jsxout))
		.pipe(
			notify({
				onLast: true,
				sound: 'Sosumi',
				message() {
					return `es5 js opty: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.jsx = jsx;

const jsx2 = cb => {
	const s = size();
	flog('-> sprawdzanie jsx');
	return gulp
		.src(config.jsxin)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(s)
		.pipe(named())
		.pipe(webpackstream(webpackconfig, webpack))
		.pipe(
			// eslint-disable-next-line func-names
			through.obj(function(file, enc, done) {
				// Dont pipe through any source map files as it will be handled
				// by gulp-sourcemaps
				const isSourceMap = /\.map$/.test(file.path);
				if (!isSourceMap) this.push(file);
				done();
			})
		)
		.pipe(gulp.dest(config.jsxout))
		.pipe(
			notify({
				onLast: true,
				sound: 'Sosumi',
				message() {
					return `es5 js opty: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.jsx2 = jsx2;

// ================================jsonlint=========================================//
const jsonlinter = cb => {
	const s = size();
	flog('-> json check');
	gulp.src(config.jsonin)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(jsonlint())
		.pipe(jsonlint.reporter())
		.pipe(jsonlint.reporter(jsonlintreporter))
		.pipe(s)
		.pipe(
			notify({
				onLast: true,
				sound: 'Sosumi',
				message() {
					return `JS check: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.jsonlinter = jsonlinter;

// ================================htmllint=========================================//
const htmllint = cb => {
	const s = size();
	flog('-> html check');
	return gulp
		.src(config.htmlin)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(htmlhint(htmlhintOpt))
		.pipe(htmlhint.reporter('htmlhint-stylish'))
		.pipe(
			htmlhint.failReporter({
				supress: true
			})
		)
		.pipe(s)
		.pipe(
			notify({
				onLast: true,
				sound: 'Sosumi',
				message() {
					return `html check: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.htmllint = htmllint;
// ================================htmllint=========================================//
const twiglinter = cb => {
	flog('-> twig check');
	return gulp
		.src(config.twig)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.on('end', cb);
};
exports.twiglinter = twiglinter;

// =========================taski bulid wps + rj.s========================//

// ==============================clean====================================//
const clean = cb => {
	flog('-> Cleaning build folder');
	return del([dist], cb);
};
exports.clean = clean;

//= ===========================rjsbuild===================================//
const rjsbuild = cb => {
	flog('-> requirejs optymizer');
	return rjs.optimize(
		rjsconfig,
		// eslint-disable-next-line func-names
		buildResponse => {
			console.log('build response', buildResponse);
			cb();
		},
		// eslint-disable-next-line func-names
		error => {
			console.error('requirejs task failed', JSON.stringify(error));
			process.exit(1);
		},
		cb
	);
};
exports.rjsbuild = rjsbuild;

// ============================clean-image================================//
const cleanImage = cb => {
	flog('-> Cleaning img files to preoptymize');
	del([`${config.imgout}**/**/*.{jpg,jpeg,png,gif}`]).then(
		paths => {
			flog(paths);
			cb();
		},
		reason => {
			cb(`Failed to delete files ${reason}`); // fail
		}
	);
};
exports.cleanImage = cleanImage;
// ========================IMG compres===================================//
const img = cb => {
	let nSrc = 0;
	let nDes = 0;
	flog('-> IMG minify');
	return gulp
		.src(config.imgin)
		.on('data', () => {
			nSrc += 1;
		})
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(prettyError())
		.pipe(
			imagemin(
				[
					gifsicle(),
					JpegRecompress({
						progressive: true,
						max: 80,
						min: 70
					}),
					pngquant({
						quality: [0.7, 0.9]
					}),
					svgo({
						plugins: [
							{
								removeViewBox: false
							}
						]
					})
				],
				{
					verbose: true
				}
			)
		)
		.pipe(gulp.dest(config.imgout))
		.on('data', () => {
			nDes += 1;
		})
		.on('finish', () => {
			flog('Results for img');
			flog('# src files: ', nSrc);
			flog('# dest files:', nDes);
		})
		.on('end', cb);
};
exports.img = img;

const img2 = cb => {
	const s = size();
	flog('-> IMG minify');
	return gulp
		.src(config.imgin2)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(prettyError())
		.pipe(tinypng())
		.pipe(s)
		.pipe(gulp.dest(config.imgout))
		.pipe(
			notify({
				onLast: true,
				message() {
					return `IMG min: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.img2 = img2;
// ========================rev===================================//
const revisionsCss = cb => {
	flog('-> revisions css style');
	const s = size();
	gulp.src([config.diststylefile], { base: dist })
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(s)
		.pipe(rev())
		.pipe(gulp.dest(dist))
		.pipe(rev.manifest())
		.pipe(gulp.dest(dist))
		.pipe(
			notify({
				onLast: true,
				message() {
					return `php rev: <%= file.relative %> ${s.prettySize}`;
				}
			})
		);
	setTimeout(cb, 1000);
};
exports.revisionsCss = revisionsCss;

// ======================revreplace===============================//
const revreplace = cb => {
	flog('-> Replace in html to revision css');
	const manifest = gulp.src(config.revmanifestfile);
	const s = size();
	gulp.src(config.revhead)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(s)
		.pipe(
			rename({
				extname: '.html'
			})
		)
		.pipe(
			revReplace({
				manifest
			})
		)
		.pipe(
			rename({
				extname: '.php'
			})
		)
		.pipe(gulp.dest(distphpdir))
		.pipe(
			notify({
				onLast: true,
				message() {
					return `php rev replace: <%= file.relative %> ${s.prettySize}`;
				}
			})
		);
	setTimeout(cb, 1000);
};
exports.revreplace = revreplace;
// ======================add lines to minify html in php output===============================//
const insertStylesBundle = cb => {
	flog('-> add lines to minify html in php output');
	const s = size();
	gulp.src(config.distindexphp)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(s)
		.pipe(
			rename({
				extname: '.html'
			})
		)
		.pipe(
			insertLines({
				after: /\/\/outminfyhtmls*$/i,
				lineAfter: 'ob_start("sanitize_output");'
			})
		)
		.pipe(
			rename({
				extname: '.php'
			})
		)
		.pipe(gulp.dest(dist))
		.pipe(
			notify({
				onLast: true,
				message() {
					return `add lines to minify html in php output: <%= file.relative %> ${s.prettySize}`;
				}
			})
		);
	setTimeout(cb, 100);
};
exports.insertStylesBundle = insertStylesBundle;
// ===================clean-dist-map-styles==========================//
const cleanDistMapStyles = cb => {
	flog('-> Cleaning unsued files');
	del([
		config.cleanscssdist,
		config.cleanscssdistBS,
		`${config.distcss}*.map`,
		config.diststylefile,
		`${dist}*.json`,
		`${config.distcss}*.json`
	]).then(
		paths => {
			flog(paths);
			cb(); // ok
		},
		reason => {
			cb(`Failed to delete files ${reason}`); // fail
		}
	);
};
exports.cleanDistMapStyles = cleanDistMapStyles;

const cleanDistAfter = cb => {
	flog('-> Cleaning unsued files');
	del([`${config.distcss}*.min.css`]).then(
		paths => {
			flog(paths);
			cb(); // ok
		},
		reason => {
			cb(`Failed to delete files ${reason}`); // fail
		}
	);
};
exports.cleanDistAfter = cleanDistAfter;
// =========================taski bulid no r.js========================//

// ============================Dist min.js==================================//
const buildJS = cb => {
	const s = size();
	flog('-> JS minify');
	return gulp
		.src(config.jsin)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(prettyError())
		.pipe(
			sourcemaps.init({
				loadMaps: true
			})
		)
		.pipe(concat(config.jsnamemin))
		.pipe(uglify())
		.pipe(s)
		.pipe(sourcemaps.write(mapout))
		.pipe(gulp.dest(config.jsout))
		.pipe(
			notify({
				onLast: true,
				message() {
					return `JS min: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.buildJS = buildJS;
// ============================Dist min html==================================//
const html = cb => {
	const s = size();
	flog('-> html minfy');
	return gulp
		.src(config.htmlin)
		.pipe(s)
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(prettyError())
		.pipe(
			htmlReaplce({
				css: config.cssreplaceout,
				js: config.jsreplaceout
			})
		)
		.pipe(
			htmlMin({
				sortAttributes: true,
				sortClassName: true,
				collapseWhitespace: true
			})
		)
		.pipe(gulp.dest(dist))
		.pipe(
			notify({
				onLast: true,
				message() {
					return `html min: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.html = html;
// ============================Dist fonts==================================//
const fonts = cb => {
	const s = size();
	flog('-> font copy dest');
	return gulp
		.src(config.fontin)
		.pipe(s)
		.pipe(gulp.dest(config.fontout))
		.pipe(
			notify({
				onLast: true,
				message() {
					return `FONT out: <%= file.relative %> ${s.prettySize}`;
				}
			})
		)
		.on('end', cb);
};
exports.fonts = fonts;

// ============================php bioutyfy==================================//

const phpcode = cb => {
	flog('-> php sniffer');
	return gulp
		.src(['src/src/', '!src/vendor/'])
		.pipe(
			phpcs({
				bin: `${config.vendorBin}phpcs`,
				standard: 'PSR2',
				extensions: 'php',
				warningSeverity: 0
			})
		)
		.pipe(phpcs.reporter('log'))
		.on('end', cb);
};
exports.phpcode = phpcode;

gulp.task(
	'phpcbf',
	shell.task([
		`"${config.vendorBin}phpcbf" --standard=PSR2 --extensions=php --ignore=${config.phpexclude} ` +
			`src/src/`
	])
);
gulp.task('PHP-PSR2', gulp.series(phpcode, 'phpcbf'));

// ============================rundist==================================//
const rundist = cb => {
	browserSync.init({
		// server: src,
		notify: false,
		browser: 'Chrome',
		proxy: `localhost/${localurl}/dist`
	});
	cb();
};
exports.rundist = rundist;
// ============================helper==================================//
const help = cb => {
	flog('---------------------------------------------------------------------');
	flog(`${pkg.name} ${pkg.version} ${config.environment} build`);
	flog('---------------------------------------------------------------------');
	flog(`${'browser serve url: localhost/'}${localurl}/src`);
	flog('---------------------------------------------------------------------');
	flog('                Usage: gulp [command]                                ');
	flog('     The commands for the task runner are the following.             ');
	flog('---------------------------------------------------------------------');
	flog('                  gulp: Compile sass linter js, html                 ');
	flog('          gulp prodrjs: buld for requrejs                            ');
	flog('             gulp prod: buld all for no AMD                          ');
	flog('            gulp prod2: buld for requrejs no compress img            ');
	flog('             gulp sass: Compile the Sass styles                      ');
	flog('            gulp clean: Removes all the compiled files on ./dist     ');
	flog('          gulp rundist: run dystrybution version                     ');
	flog('---------------------------------------------------------------------');
	cb();
};
exports.help = help;

// ========================watch + browserSync===============================//
const watchChange = cb => {
	// watch twig
	const twigcs = gulp.watch(
		config.twig,
		{
			interval: 750
		},
		gulp.series(twiglinter, reload)
	);
	twigcs.on('change', path => {
		console.log(`File ${path} was changed running tasks...`);
	});
	twigcs.on('add', path => {
		console.log(`File ${path} was added`);
	});
	twigcs.on('unlink', path => {
		console.log(`File ${path} was removed`);
	});

	// watch php
	// let php = gulp.watch(config.phpin, {
	//     interval: 750
	// }, gulp.series('phpcbf', phpcode, reload));
	// php.on('change', (path, stats) => {
	//     console.log('File ' + path + ' was changed running tasks...');
	// });
	// php.on('add', (path, stats) => {
	//     console.log('File ' + path + ' was added');
	// });
	// php.on('unlink', (path) => {
	//     console.log('File ' + path + ' was removed');
	// });

	// watch react
	const react = gulp.watch(
		config.jsxin,
		{
			interval: 750
		},
		gulp.series(jsx2, reload)
	);
	react.on('change', path => {
		console.log(`File ${path} was changed running tasks...`);
	});
	react.on('add', path => {
		console.log(`File ${path} was added`);
	});
	react.on('unlink', path => {
		console.log(`File ${path} was removed`);
	});

	// watch js
	const js = gulp.watch(
		config.jsin,
		{
			interval: 750
		},
		gulp.series(jslint, reload)
	);
	js.on('change', path => {
		console.log(`File ${path} was changed running tasks...`);
	});
	js.on('add', path => {
		console.log(`File ${path} was added`);
	});
	js.on('unlink', path => {
		console.log(`File ${path} was removed`);
	});

	// watch sass
	const scss = gulp.watch(
		config.scssin,
		{
			interval: 750
		},
		gulp.series(sassCompile, reload)
	);
	scss.on('change', path => {
		console.log(`File ${path} was changed running tasks...`);
	});
	scss.on('add', path => {
		console.log(`File ${path} was added`);
	});
	scss.on('unlink', path => {
		console.log(`File ${path} was removed`);
	});

	// watch json
	const json = gulp.watch(
		config.jsonin,
		{
			interval: 750
		},
		gulp.series(jsonlinter, reload)
	);
	json.on('change', path => {
		console.log(`File ${path} was changed running tasks...`);
	});
	json.on('add', path => {
		console.log(`File ${path} was added`);
	});
	json.on('unlink', path => {
		console.log(`File ${path} was removed`);
	});

	// watch image
	const image = gulp.watch(
		config.imgin,
		{
			interval: 750
		},
		gulp.series(reload)
	);
	image.on('change', path => {
		console.log(`File ${path} was changed running tasks...`);
	});
	image.on('add', path => {
		console.log(`File ${path} was added`);
	});
	image.on('unlink', path => {
		console.log(`File ${path} was removed`);
	});

	cb();
};
exports.watchChange = watchChange;
// ============================copysrctodist==================================//

const copySrcToDist = cb => {
	let nSrc = 0;
	let nDes = 0;
	flog('-> copy src');
	return gulp
		.src([`${src}**/*`, `!${src}public/**/*`, `${src}/public/js/`], { dot: true })
		.on('data', () => {
			nSrc += 1;
		})
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(prettyError())
		.pipe(gulp.dest(dist))
		.on('data', () => {
			nDes += 1;
		})
		.on('finish', () => {
			flog('Results for FILES');
			flog('# src files: ', nSrc);
			flog('# dest files:', nDes);
		})
		.on('end', cb);
};
exports.copySrcToDist = copySrcToDist;
// ============================callback==================================//
const callback = cb => {
	flog('-> build dist');
	cb();
};
exports.callback = callback;
// ============================prod default==================================//
const dev = gulp.series(help, sassCompile, jsx2, serve, watchChange);
exports.default = dev;
// ============================dist no r.js==================================//
const prod = gulp.series(clean, html, buildJS, css, img, fonts, callback);
exports.prod = prod;
// ============================dist r.js + tinnypng==================================//
const prodrjs = gulp.series(
	clean,
	rjsbuild,
	cleanImage,
	img2,
	revisionsCss,
	revreplace,
	cleanDistMapStyles,
	insertStylesBundle,
	cleanDistAfter,
	callback
);
exports.prodrjs = prodrjs;
// ============================dist r.js + no img compres==================================//
const prod2 = gulp.series(
	clean,
	rjsbuild,
	cleanImage,
	img,
	revisionsCss,
	revreplace,
	cleanDistMapStyles,
	insertStylesBundle,
	cleanDistAfter,
	callback
);
exports.prod2 = prod2;
