module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:import/recommended", "plugin:prettier/recommended"],
  rules: {
    "import/order": [
      "warn",
      {
        groups: [["builtin", "external"], "internal", "parent", "sibling", "index"],
      }
    ]
  }
};
