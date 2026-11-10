import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [".next-dev/**", "node_modules/**"],
  },
];

export default eslintConfig;
