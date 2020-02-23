module.exports = {
    paths: {
        public: "src/main/resources/static/out",
        watched: [
            "src/main/resources/static/js",
            "src/main/resources/static/css",
            "node_modules/bootstrap/dist/css"
        ]
    },
    files: {
        javascripts: {
            joinTo: "app.js"
        },
        stylesheets: {
            joinTo: "app.css"
        }
    },
    plugins: {
        brunchTypescript: {
            removeComments: true,
            target: "es6",
            module: "commonjs",
            emitDecoratorMetadata: true,
            experimentalDecorators: true
        }
    }
};
