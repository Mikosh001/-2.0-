export default {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "prettier"
      ],
      plugins: ["@typescript-eslint"]
    }
  ]
};
