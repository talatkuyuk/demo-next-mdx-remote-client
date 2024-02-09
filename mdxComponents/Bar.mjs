import React from "react";

const Bar = ({ enabled }) => {
  return React.createElement(
    "div",
    {
      className: "bar-content",
      style: { color: "red", marginTop: "1rem" },
    },
    `"Imports" is ${
      enabled ? "enabled" : "disabled"
    }, so I am able to say HELLO from imported <Bar /> component.`
  );
};

export default Bar;
