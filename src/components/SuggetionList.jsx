import React from "react";

function SuggetionList({
  suggestData = [],
  heighlight,
  onSuggetions,
  activeIndex,
}) {
  let dataKey = "name";
  const highlightData = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <b className="highlight" key={index}>
              {part}
            </b>
          ) : (
            part
          )
        )}
      </span>
    );
  };
  return (
    <>
      <div className="suggest-page">
        <ul>
          {suggestData.map((item, index) => {
            const currSuggestion = dataKey ? item[dataKey] : item;
            return (
              <>
                <li
                  key={index}
                  onClick={() => onSuggetions(item)}
                  className={index === activeIndex ? "active" : ""}
                >
                  {highlightData(currSuggestion, heighlight)}
                </li>
              </>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default SuggetionList;
