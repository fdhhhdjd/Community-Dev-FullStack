import React, { useState } from "react";

const SearchBar = (props) => {
  const { search } = useSearch();
  const [value, setValue] = useState("");

  //handle input change for search bar
  const onInputChange = (evt) => {};

  //handle 'enter' press event
  const onEnterKey = (evt) => {};

  return (
    <input
      className={
        props.showSearchOnMobile ? "search-bar--mobile " : "search-bar "
      }
      key="random1"
      placeholder={"Search..."}
    />
  );
};

export default SearchBar;
