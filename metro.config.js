const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { withMonicon } = require("@monicon/metro");

const config = getDefaultConfig(__dirname);

// Combine Monicon and NativeWind Metro configurations
module.exports = withNativeWind(
    withMonicon(config, {
        iconsDir: "node_modules/@iconify-json",
        collections: ["mdi", "material-symbols"],
    }),
    { input: "./global.css" }
);
