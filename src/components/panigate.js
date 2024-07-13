import React from "react";

const Paginate = ({ postPerPage, totalPost, currentPage, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPost / postPerPage); i++) {
    pageNumbers.push(i);
  }

  // console.log("totlal post", totalPost);
  // console.log(pageNumbers);
  return (
    <ul className="pagination">
      {pageNumbers.map((number) => (
        <li
          key={number}
          onClick={() => paginate(number)}
          className={"page-item " + (number === currentPage ? "active" : "")}
        >
          <a className="page-link" href="" onClick={(e) => e.preventDefault()}>
            {number}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Paginate;
