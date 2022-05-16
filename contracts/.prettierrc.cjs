module.exports = {
    ...require("../.prettierrc.cjs"),
    plugins: [require("prettier-plugin-solidity")],
    overrides: [
        {
            files: "*.sol",
            options: {
                ...require("../.prettierrc.cjs"),
                explicitTypes: "always",
            },
        },
    ],
};
