import React, { useEffect, useState } from "react";
import { Input } from "reactstrap/lib";

export default function SearchInput(props: {
  id?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  bsSize?: "sm" | "lg";
  onSearch?: (value: string) => void;
  onMouseDown?: React.MouseEventHandler<HTMLInputElement>;
}): JSX.Element {
  const [value, setValue] = useState("");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (props.onSearch) {
        props.onSearch(value);
      }
    }, 700);
    return () => clearTimeout(timeoutId);
  }, [value, props]);

  return (
    <Input
      id={props.id}
      placeholder={props.placeholder}
      bsSize={props.bsSize}
      value={value}
      className={props.className}
      onMouseDown={props.onMouseDown}
      onChange={handleOnChange}
    ></Input>
  );
}
