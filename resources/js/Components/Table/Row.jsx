import React from "react";

const Row = ({children}) => {
    return (
        <tr
            className={`text-sm relative`}
        >
            {React.Children.toArray(children).filter(
                (child) => React.isValidElement(child)
            )}
        </tr>
    );
};

export default Row;
