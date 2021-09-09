import React, { useState } from 'react';
import styles from '../../styles/fourms.module.css';

const Paginator: React.FC<{ postsPerPage: number, totalPosts: number, maxPaginationNumbers: number, currentPage: number, paginate: Function }> = (props) => {
    
    const pageNumbers = [];
    let renderPageNumbers;

    for (let i = 1; i <= Math.ceil(props.totalPosts / props.postsPerPage); i++) {
        pageNumbers.push(i);
    }

    renderPageNumbers = pageNumbers.map(number => {
        let classes = props.currentPage === number ? styles.active : '';
      
        if (number == 1 || number == props.totalPosts || (number >= props.currentPage - props.maxPaginationNumbers && number <= props.currentPage + props.maxPaginationNumbers)) {
          

          return (
            <>  
                <li key={number} className={classes} onClick={() => {
                    props.paginate(number)
                }}>{number}</li> 
            </>
          );
        }
      });
    
    return (
        <div className={styles.paginator_contianer}>
            <ul className={styles.pagination_list}>
                {renderPageNumbers}
            </ul>
        </div>
    )
}

export default Paginator;