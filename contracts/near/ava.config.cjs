require("util").inspect.defaultOptions.depth = 5 // Increase AVA's printing depth

module.exports = {
  timeout: "300000",
  files: ["**/*.ava.{js,ts}"],
  failWithoutAssertions: false,
  extensions: ["js", "ts"],
  require: ["ts-node/register"],
}
