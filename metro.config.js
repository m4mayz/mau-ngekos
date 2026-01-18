const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { withMonicon } = require("@monicon/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Ensure all monicon packages are resolvable
const nodeModulesPath = path.resolve(__dirname, "node_modules");
config.resolver = {
    ...config.resolver,
    nodeModulesPaths: [nodeModulesPath],
};

// Combine Monicon and NativeWind Metro configurations
module.exports = withNativeWind(
    withMonicon(config, {
        iconsDir: "node_modules/@iconify-json",
        collections: ["mdi", "material-symbols"],
    }),
    { input: "./global.css" },
);
