const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [0],
    "header-max-length": [0],
    "body-max-line-length": [0],
  },
};

export default config;
