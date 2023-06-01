/*------------------ GULP -----------------*/
const { src, dest, watch, series } = require("gulp");

/*------------------ SASS y CSS -----------------*/
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");

// Compilar SASS en CSS
function css() {
	return (
		src("src/scss/app.scss")
			.pipe(sourcemaps.init())
			.pipe(sass())
			// .pipe(postcss([autoprefixer(), cssnano()]))
			.pipe(postcss([autoprefixer()]))
			.pipe(sourcemaps.write("."))
			.pipe(dest("build/css"))
	);
}

/*------------------ IMAGENES -----------------*/
const webp = require("gulp-webp");
const avif = require("gulp-avif");

// Optimizar imagenes
async function imagenes() {
	const imagemin = await import("gulp-imagemin");

	return src("src/img/**/*")
		.pipe(imagemin.default({ optimizationLevel: 3 }))
		.pipe(dest("build/img"));
}

// Crear versión .webp de los .png y .jpg
function imgWebp() {
	return src("src/img/**/*.{png,jpg}").pipe(webp()).pipe(dest("build/img"));
}

// Crear versión .avif de los .png y .jpg
function imgAvif() {
	const opciones = { quality: 50 };

	return src("src/img/**/*.{png,jpg}").pipe(avif(opciones)).pipe(dest("build/img"));
}

/*------------------ UTILIDADES -----------------*/
// Observar los cambios en SCSS y el directorio de imagenes
function dev() {
	watch("src/scss/**/*.scss", css);
	watch("src/img/**/*", imagenes);
}

// Exportar las funciones
exports.css = css;
exports.imagenes = imagenes;
exports.imgWebp = imgWebp;
exports.imgAvif = imgAvif;
exports.dev = dev;

// Ejecutar las funciones por defecto en orden
// exports.default = series(imagenes, imgWebp, css, dev);
exports.default = series(css, dev);
