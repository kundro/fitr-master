import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";
import { ISearchBoxProps } from "./props";
// import qs from "query-string";

function SearchBox({ disabled, onSearch }: ISearchBoxProps) {
  const [value, setValue] = useState("");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [value, onSearch]);

  return (
    <>
      <Input
        disabled={disabled}
        type="text"
        bsSize="sm"
        onChange={handleOnChange}
        value={value}
        placeholder="Search"
      />
    </>
  );
}

export default SearchBox;
