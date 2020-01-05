module.exports = {
    paths: {
        public: "src/main/resources/static/out",
        watched: ["src/main/resources/static/js"]
    },
    files: {
        javascripts: {
            joinTo: "app.js"
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
