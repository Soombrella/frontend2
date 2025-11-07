import React from "react";
import Book from "./Book"

function Library(props) {
    return (
        <div>
            <Book name="리액트에 대하여" numOfPage={300} />
        </div>
    );
}

export default Library;