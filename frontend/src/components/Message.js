import React from "react";
import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = { variant: "info" };
// Could we set this default value by passing variant = "info" as props?

export default Message;
