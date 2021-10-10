import React, { ReactChild } from 'react'
import styles from '../../styles/admin.module.css';

const Table: React.FC<{ 
    table_data: ReactChild,
    table_colomns: Array<string>
}> = ({ table_data, table_colomns }) => {
    return (
        <table className={styles.admin_table}>
            <tr>
                {table_colomns.map(colomn => {
                    return <th key={colomn}>{colomn}</th>
                })}
            </tr>
            {table_data}
        </table>
    )
}

export default Table;