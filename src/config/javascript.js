const esbuild = require("esbuild");
const server = require("../config/server");
const isProduction = server.isProduction;

module.exports = {
    // All .js files will be recognised as a language. The contents of these files will be processed as per the compile method
    outputFileExtension: "js",
    compile: async (content, inputPath) => {
        // If the file isn't from the assets directory, ignore it. It's probably a config file.
        if (!inputPath.replace(/\\/g, "/").includes("./src/assets/")) {
            return;
        }

        // Let Eleventy own the output write. Inline development maps need no second writer.
        const result = await esbuild.build({
            entryPoints: [inputPath],
            outdir: "public/assets/js",
            write: false,
            bundle: true,
            minify: isProduction,
            sourcemap: isProduction ? false : "inline",
            target: isProduction ? "es6" : "esnext",
        });

        return () => result.outputFiles.find((file) => file.path.endsWith(".js")).text;
    }
};
