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
    }, so I able to say say HELLO from imported <Bar /> component.`
  );
};

export default Bar;
