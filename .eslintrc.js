module.exports = {
  root: true,

  env: {
    browser: true,

    node: true,

    jasmine: true,

    jest: true,

    es6: true,
  },

  extends: ["eslint:recommended", "plugin:vue/essential", "plugin:prettier/recommended"],

  plugins: ["vue", "prettier"],

  rules: {
    "prettier/prettier": "error",

    // allow debugger during development

    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
