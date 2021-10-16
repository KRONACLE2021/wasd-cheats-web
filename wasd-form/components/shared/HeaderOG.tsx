import React from 'react'
import Head from 'next/head'

const HeaderOG: React.FC<{ title?: string, gqlBody?: string }> = ({ title, gqlBody }) => {
    return (
        <Head>
            <title>{title ? title : "WASD Cheats"}</title>
            <meta content="WASD Cheats" property="og:title" />

            <meta content="WASD Cheats, a cheating community." property="og:description" />

            <meta content="WASD" property="og:site_name" />

            <meta content={"/logo.png"} property='og:image' />
        </Head>
    )
}

export default HeaderOG;