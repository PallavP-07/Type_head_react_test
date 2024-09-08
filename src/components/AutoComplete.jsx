import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import SuggetionList from "./SuggetionList";
import { debounce } from "lodash";
const staticData = ["apple", "banana", "mango", "nuts"];

const AutoComplete = () => {
  const [searchItem, setSearchItem] = useState("");
  const [suggetsRecipes, setSuggetsRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  let dataKey = "name";
  const searchHandler = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchItem(value);
    setActiveIndex(-1);
  };

  const getSuggetions = async (query) => {
    setError(null);
    setLoading(true);
    try {
      let result;
      if (staticData && staticData.length > 0) {
        result = staticData.filter((item) => {
          return item.toLowerCase().includes(query.toLowerCase());
        });
      } else {
        result = await fetchSuggetions(query);
      }
      result = await fetchSuggetions(query);
      setSuggetsRecipes(result);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch data");
      setSuggetsRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggetions = async (query) => {
    const response = await fetch(
      `https://dummyjson.com/recipes/search?q=${query}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();

    return result.recipes;
  };
  const suggestDataDebounce = useCallback(debounce(getSuggetions, 300), []);
  useEffect(() => {
    if (searchItem.length > 1) {
      suggestDataDebounce(searchItem);
    } else {
      setSuggetsRecipes([]);
    }
  }, [searchItem]);

  const handleClickSuggetion = (item) => {
    setSearchItem(dataKey ? item[dataKey] : dataKey);
    setSuggetsRecipes([]);
  };

  //key navigation code
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      // Move down the list, and wrap around if reaching the end
      setActiveIndex((prevIndex) =>
        prevIndex < suggetsRecipes.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Move up the list, and wrap around if reaching the top
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggetsRecipes.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      // Select the active suggestion
      setSearchItem(
        dataKey
          ? suggetsRecipes[activeIndex][dataKey]
          : suggetsRecipes[activeIndex]
      );
      setSuggetsRecipes([]);
      setActiveIndex(-1);
    }
  };
  return (
    <>
      <div className="container">
        <input
          type="text"
          name="searchItem"
          placeholder="please enter recipe ..."
          value={searchItem}
          onChange={searchHandler}
          onKeyDown={handleKeyDown}
        />
        {(suggetsRecipes.length > 0 || loading || error) && (
          <ul>
            {error && <div className="error">{error} </div>}
            {loading && (
              <div className="loading">
                <p>Loading...</p>
              </div>
            )}
            <SuggetionList
              suggestData={suggetsRecipes}
              heighlight={searchItem}
              onSuggetions={handleClickSuggetion}
              activeIndex={activeIndex}
            />
          </ul>
        )}
      </div>
    </>
  );
};

export default AutoComplete;
