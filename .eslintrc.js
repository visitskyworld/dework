module.exports = {
  extends: ["react-app", "plugin:prettier/recommended"],
  rules: {
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "warn",
    "react/jsx-no-literals": "warn",
  },
};
